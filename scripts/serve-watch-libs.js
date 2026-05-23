const { spawn, execSync } = require("node:child_process");
const chokidar = require("chokidar");
const { rm } = require("node:fs/promises");
const path = require("node:path");

const PORT = 4200;

const WATCH_PATHS = [
    "../angular-components/dist",
];

let proc = null;
let stopping = false;
let firstStart = true;

function runNpmScript(scriptName) {
    console.log(`[scripts] Ejecutando npm run ${scriptName}`);
    execSync(`npm run ${scriptName}`, { stdio: "inherit" });
}

function releasePort(port) {
    try {
        const result = execSync(`netstat -ano | findstr :${port}`);
        const lines = result.toString().split("\n").filter(l => l.trim());

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts.at(-1);

            if (pid && pid !== "0") {
                try {
                    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
                    console.log(`[port] Proceso ${pid} terminado`);
                } catch {}
            }
        }
    } catch {}
}

function startNgServe() {
    releasePort(PORT);

    const args = ["serve", "--port", String(PORT), "--poll", "1000"];

    if (firstStart) {
        args.push("--open");
        firstStart = false;
    }

    proc = spawn("ng", args, { stdio: "inherit", shell: true });

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

        try {
            p.kill("SIGTERM");
        } catch {
            clearTimeout(timeout);
            resolve();
        }
    });

    await new Promise(r => setTimeout(r, 800));
}

async function clearAngularCache() {
    await rm(path.resolve(".angular/cache"), { recursive: true, force: true });
    console.log("[cache] .angular/cache borrada");
}

function refreshDemoAssets() {
    runNpmScript("lib:refresh");
    runNpmScript("merge-translations");
}

let timer = null;
let rebuilding = false;

async function rebuild() {
    if (rebuilding) return;

    rebuilding = true;

    try {
        await stopNgServe();
        refreshDemoAssets();
        await clearAngularCache();
        startNgServe();
    } catch (e) {
        console.error("[rebuild] error:", e);
    } finally {
        rebuilding = false;
    }
}

const watcher = chokidar.watch(WATCH_PATHS, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 }
});

watcher.on("all", (event, file) => {
    if (!["add", "change", "unlink", "addDir", "unlinkDir"].includes(event)) return;

    console.log(`[watch] ${event}: ${file}`);

    if (timer) clearTimeout(timer);
    timer = setTimeout(rebuild, 2500);
});

(async () => {
    refreshDemoAssets();
    await clearAngularCache();
    startNgServe();
})();
