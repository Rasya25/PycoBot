console.clear()
import path from "path";
import { spawn } from "child_process";
import { watchFile, unwatchFile } from "fs";
import treeKill from "./system/lib/treekill.js";

let activeProcess = null;

async function start(file) {
    if (activeProcess) {
        await treeKill(activeProcess.pid, 'SIGTERM');
        activeProcess = null;
    }

    const args = [path.join(process.cwd(), file), ...process.argv.slice(2)];
    const p = spawn(process.argv[0], args, { stdio: 'inherit' });
    activeProcess = p;

    p.on('message', data => {
        switch (data) {
            case 'reset':
                start(file);
                break;
            case 'uptime':
                p.send(process.uptime());
                break;
        }
    });

    p.on('exit', code => {
        if (Number(code) && code === 0) return;
        watchFile(args[0], () => {
            unwatchFile(args[0]);
            start(file);
        });
    });
}

start("./system/main.js")
