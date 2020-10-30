"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_workspace_dir_1 = require("@pnpm/find-workspace-dir");
const npx = require("@zkochan/libnpx/index");
const path = require("path");
const PNPM_PATH = path.join(__dirname, '../../bin/pnpm.js');
(async () => {
    const workspaceRoot = await find_workspace_dir_1.default(process.cwd());
    if (workspaceRoot) {
        process.env.PATH = `${path.join(workspaceRoot, 'node_modules/.bin')}${path.delimiter}${process.env.PATH}`;
    }
    npx({
        ...npx.parseArgs(process.argv, PNPM_PATH),
        installerStdio: 'inherit',
    });
})();
