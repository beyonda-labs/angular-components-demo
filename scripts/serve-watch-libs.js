const { spawn, execSync } = require('node:child_process');
const chokidar = require('chokidar');
const { existsSync } = require('node:fs');
const path = require('node:path');

const PORT = 4200;

const DIST_PATH = path.resolve(__dirname, '../../angular-components/dist');
const LIB_NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules/@beyonda-labs/angular-components');
const NG_BIN = path.resolve(__dirname, '../node_modules/@angular/cli/bin/ng.js');

const WATCH_PATHS = [DIST_PATH];

// The local library is only watched after `pnpm run install:local`; installed from Verdaccio there is no dist to wait for.
const IS_LOCAL = String(require('../package.json').dependencies['@beyonda-labs/angular-components']).startsWith(
    'link:'
);

const DIST_POLL_INTERVAL_MS = 2000;

let proc = null;
let stopping = false;
let firstStart = true;

function runPackageScript(scriptName) {
    console.log(`[scripts] Running pnpm run ${scriptName}`);
    execSync(`pnpm run ${scriptName}`, { stdio: 'inherit' });
}

// Only LISTENING sockets whose local address uses the port count: killing every PID
// netstat shows with that port would also kill connected clients (browsers, curl...).
function getListeningPids(port) {
    try {
        const result = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`);
        const lines = result
            .toString()
            .split('\n')
            .filter(l => l.trim());

        const pids = new Set();

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const localAddress = parts[1] ?? '';
            const pid = parts.at(-1);

            if (localAddress.endsWith(`:${port}`) && pid && pid !== '0') {
                pids.add(pid);
            }
        }

        return [...pids];
    } catch {
        return [];
    }
}

async function waitForPortFree(port, timeoutMs) {
    const deadline = Date.now() + timeoutMs;

    while (getListeningPids(port).length > 0 && Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 250));
    }
}

async function releasePort(port) {
    for (const pid of getListeningPids(port)) {
        try {
            execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
            console.log(`[port] Process ${pid} stopped`);
        } catch {}
    }

    await waitForPortFree(port, 5000);
}

async function startNgServe() {
    await releasePort(PORT);

    // Listen on the IPv4 loopback: with the default "localhost" Node only binds [::1] (IPv6),
    // and browsers that resolve localhost to IPv4 (Edge, depending on its settings) cannot
    // connect and show a blank page.
    const args = [NG_BIN, 'serve', '--host', '127.0.0.1', '--port', String(PORT), '--poll', '1000'];

    if (firstStart) {
        args.push('--open');
        firstStart = false;
    }

    // node runs ng.js directly, without a shell: a shell would add an intermediate cmd.exe,
    // and killing its tree can orphan the real node process, which then fights the next
    // ng serve for the port.
    proc = spawn(process.execPath, args, { stdio: 'inherit' });

    proc.once('exit', (code, signal) => {
        console.log(`[serve] ng serve exited (code: ${code}, signal: ${signal})`);
        stopping = false;
        proc = null;
    });

    console.log('[serve] ng serve started');
}

async function stopNgServe() {
    if (!proc || stopping) return;

    stopping = true;
    const p = proc;

    await new Promise(resolve => {
        const timeout = setTimeout(() => {
            try {
                p.kill('SIGKILL');
            } catch {}
            resolve();
        }, 6000);

        p.once('exit', () => {
            clearTimeout(timeout);
            resolve();
        });

        // On Windows p.kill() only ends the main process and would leave its children
        // (esbuild and the like) alive; taskkill /T ends the whole tree.
        if (process.platform === 'win32') {
            try {
                execSync(`taskkill /PID ${p.pid} /T /F`, { stdio: 'ignore' });
            } catch {}
        } else {
            try {
                p.kill('SIGTERM');
            } catch {
                clearTimeout(timeout);
                resolve();
            }
        }
    });

    await waitForPortFree(PORT, 5000);
}

function isDistReady() {
    return existsSync(path.join(DIST_PATH, 'package.json'));
}

async function waitForDist() {
    if (!IS_LOCAL || isDistReady()) return;

    console.log(`[dist] Waiting for ${DIST_PATH} (run build or build:watch in angular-components)...`);

    while (!isDistReady()) {
        await new Promise(r => setTimeout(r, DIST_POLL_INTERVAL_MS));
    }

    console.log('[dist] Library found');
}

// node_modules/@beyonda-labs/angular-components is a symlink to dist, so a reinstall is
// only needed when the link is missing or broken.
function refreshDemoAssets() {
    if (!existsSync(path.join(LIB_NODE_MODULES_PATH, 'package.json'))) {
        runPackageScript('lib:refresh');
    }

    runPackageScript('merge-translations');
}

let timer = null;
let rebuilding = false;
let pendingRebuild = false;

async function rebuild() {
    if (rebuilding) {
        pendingRebuild = true;
        return;
    }

    rebuilding = true;

    try {
        await stopNgServe();

        try {
            await waitForDist();
            refreshDemoAssets();
        } catch (e) {
            console.error('[rebuild] Could not refresh the library (restarting the server anyway):', e);
        }

        await startNgServe();
    } catch (e) {
        console.error('[rebuild] error:', e);
    } finally {
        rebuilding = false;

        if (pendingRebuild) {
            pendingRebuild = false;
            timer = setTimeout(rebuild, 1000);
        }
    }
}

let translationsTimer = null;

function mergeTranslationsOnly() {
    if (rebuilding) return;

    try {
        runPackageScript('merge-translations');
        console.log('[i18n] Translations updated (reload the browser to see them)');
    } catch (e) {
        console.error('[i18n] Could not update the translations:', e);
    }
}

const watcher = chokidar.watch(WATCH_PATHS, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 }
});

// ng-packagr writes dist in stages over several seconds, so reacting to every file would
// restart the server several times per build. package.json is written last, so it marks
// a finished build. Changes that only touch assets/i18n (the library's translation
// pipeline) need no restart: merging the translations again is enough.
watcher.on('all', (event, file) => {
    if (!IS_LOCAL) return;
    if (!['add', 'change', 'unlink', 'addDir', 'unlinkDir'].includes(event)) return;

    const relative = path.relative(DIST_PATH, file).replace(/\\/g, '/');

    if (relative === 'package.json') {
        console.log(`[watch] Library build detected (${event}: ${relative})`);

        if (timer) clearTimeout(timer);
        timer = setTimeout(rebuild, 2500);
        return;
    }

    if (relative.startsWith('assets/i18n/')) {
        if (translationsTimer) clearTimeout(translationsTimer);
        translationsTimer = setTimeout(mergeTranslationsOnly, 2500);
    }
});

(async () => {
    console.log(
        `[start] Library ${IS_LOCAL ? 'linked locally (install:local)' : 'from the registry (install:remote)'}`
    );

    try {
        await waitForDist();
        refreshDemoAssets();
        await startNgServe();
    } catch (e) {
        console.error('[start] Could not start the demo:', e);
        process.exitCode = 1;
    }
})();
