const { spawn, execSync } = require("node:child_process");
const chokidar = require("chokidar");
const { existsSync } = require("node:fs");
const path = require("node:path");

const PORT = 4200;

const DIST_PATH = path.resolve(__dirname, "../../angular-components/dist");
const LIB_NODE_MODULES_PATH = path.resolve(__dirname, "../node_modules/@beyonda-labs/angular-components");
const NG_BIN = path.resolve(__dirname, "../node_modules/@angular/cli/bin/ng.js");

const WATCH_PATHS = [DIST_PATH];

const DIST_POLL_INTERVAL_MS = 2000;

let proc = null;
let stopping = false;
let firstStart = true;

function runNpmScript(scriptName) {
    console.log(`[scripts] Ejecutando npm run ${scriptName}`);
    execSync(`npm run ${scriptName}`, { stdio: "inherit" });
}

// Solo se consideran sockets en LISTENING cuya dirección local usa el puerto:
// matar cualquier PID que aparezca en netstat con ese puerto también mataría
// clientes conectados (navegadores, curl...).
function getListeningPids(port) {
    try {
        const result = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`);
        const lines = result.toString().split("\n").filter(l => l.trim());

        const pids = new Set();

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const localAddress = parts[1] ?? "";
            const pid = parts.at(-1);

            if (localAddress.endsWith(`:${port}`) && pid && pid !== "0") {
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
            execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
            console.log(`[port] Proceso ${pid} terminado`);
        } catch {}
    }

    await waitForPortFree(port, 5000);
}

async function startNgServe() {
    await releasePort(PORT);

    // Escuchar en IPv4 loopback: si se deja el "localhost" por defecto, Node solo
    // hace bind en [::1] (IPv6) y los navegadores que resuelven localhost por IPv4
    // (p. ej. Edge según configuración) no conectan y muestran la página en blanco.
    const args = [NG_BIN, "serve", "--host", "127.0.0.1", "--port", String(PORT), "--poll", "1000"];

    if (firstStart) {
        args.push("--open");
        firstStart = false;
    }

    // Se invoca node sobre ng.js directamente, sin shell: con shell habría un
    // cmd.exe intermedio y matar su árbol puede dejar huérfano al node real
    // (que luego compite por el puerto con el siguiente ng serve).
    proc = spawn(process.execPath, args, { stdio: "inherit" });

    proc.once("exit", (code, signal) => {
        console.log(`[serve] ng serve finalizado (code: ${code}, signal: ${signal})`);
        stopping = false;
        proc = null;
    });

    console.log("[serve] ng serve iniciado");
}

async function stopNgServe() {
    if (!proc || stopping) return;

    stopping = true;
    const p = proc;

    await new Promise(resolve => {
        const timeout = setTimeout(() => {
            try { p.kill("SIGKILL"); } catch {}
            resolve();
        }, 6000);

        p.once("exit", () => {
            clearTimeout(timeout);
            resolve();
        });

        // En Windows p.kill() solo termina el proceso principal y dejaría vivos
        // a sus hijos (esbuild, etc.); taskkill /T mata el árbol completo.
        if (process.platform === "win32") {
            try {
                execSync(`taskkill /PID ${p.pid} /T /F`, { stdio: "ignore" });
            } catch {}
        } else {
            try {
                p.kill("SIGTERM");
            } catch {
                clearTimeout(timeout);
                resolve();
            }
        }
    });

    await waitForPortFree(PORT, 5000);
}

function isDistReady() {
    return existsSync(path.join(DIST_PATH, "package.json"));
}

async function waitForDist() {
    if (isDistReady()) return;

    console.log(`[dist] Esperando a que exista ${DIST_PATH} (ejecuta build o build:watch en angular-components)...`);

    while (!isDistReady()) {
        await new Promise(r => setTimeout(r, DIST_POLL_INTERVAL_MS));
    }

    console.log("[dist] Librería detectada");
}

// node_modules/@beyonda-labs/angular-components es un symlink a dist, así que
// solo hace falta reinstalar si el enlace no existe o quedó roto.
function refreshDemoAssets() {
    if (!existsSync(path.join(LIB_NODE_MODULES_PATH, "package.json"))) {
        runNpmScript("lib:refresh");
    }

    runNpmScript("merge-translations");
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
            console.error("[rebuild] Error refrescando la librería (se reinicia el servidor igualmente):", e);
        }

        await startNgServe();
    } catch (e) {
        console.error("[rebuild] error:", e);
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
        runNpmScript("merge-translations");
        console.log("[i18n] Traducciones actualizadas (recarga el navegador para verlas)");
    } catch (e) {
        console.error("[i18n] Error actualizando traducciones:", e);
    }
}

const watcher = chokidar.watch(WATCH_PATHS, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 }
});

// ng-packagr escribe dist por fases durante bastantes segundos; reaccionar a
// cualquier archivo provoca varios reinicios por build. package.json se escribe
// al final del empaquetado, así que se usa como centinela de "build terminada".
// Los cambios que solo tocan assets/i18n (pipeline de traducciones de la librería)
// no necesitan reiniciar el servidor: basta con re-mergear las traducciones.
watcher.on("all", (event, file) => {
    if (!["add", "change", "unlink", "addDir", "unlinkDir"].includes(event)) return;

    const relative = path.relative(DIST_PATH, file).replace(/\\/g, "/");

    if (relative === "package.json") {
        console.log(`[watch] Build de la librería detectada (${event}: ${relative})`);

        if (timer) clearTimeout(timer);
        timer = setTimeout(rebuild, 2500);
        return;
    }

    if (relative.startsWith("assets/i18n/")) {
        if (translationsTimer) clearTimeout(translationsTimer);
        translationsTimer = setTimeout(mergeTranslationsOnly, 2500);
    }
});

(async () => {
    try {
        await waitForDist();
        refreshDemoAssets();
        await startNgServe();
    } catch (e) {
        console.error("[start] Error arrancando la demo:", e);
        process.exitCode = 1;
    }
})();
