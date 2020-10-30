"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graceful_fs_1 = require("graceful-fs");
const isSubdir = require("is-subdir");
const pFilter = require("p-filter");
const path = require("path");
const util_1 = require("util");
const readdirP = util_1.promisify(graceful_fs_1.readdir);
const statP = util_1.promisify(graceful_fs_1.stat);
async function binify(manifest, pkgPath) {
    if (manifest.bin) {
        return commandsFromBin(manifest.bin, manifest.name, pkgPath);
    }
    if (manifest.directories && manifest.directories.bin) {
        const binDir = path.join(pkgPath, manifest.directories.bin);
        const files = await findFiles(binDir);
        return pFilter(files.map((file) => ({
            name: file,
            path: path.join(binDir, file),
        })), async (cmd) => (await statP(cmd.path)).isFile());
    }
    return [];
}
exports.default = binify;
async function findFiles(dir) {
    try {
        return await readdirP(dir);
    }
    catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return [];
    }
}
function commandsFromBin(bin, pkgName, pkgPath) {
    if (typeof bin === 'string') {
        return [
            {
                name: pkgName.startsWith('@') ? pkgName.substr(pkgName.indexOf('/') + 1) : pkgName,
                path: path.join(pkgPath, bin),
            },
        ];
    }
    return Object.keys(bin)
        .filter((commandName) => encodeURIComponent(commandName) === commandName)
        .map((commandName) => ({
        name: commandName,
        path: path.join(pkgPath, bin[commandName]),
    }))
        .filter((cmd) => isSubdir(pkgPath, cmd.path));
}
