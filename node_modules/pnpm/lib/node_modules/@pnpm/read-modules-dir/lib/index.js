"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("mz/fs");
const path = require("path");
async function readModulesDir(modulesDir) {
    try {
        return await _readModulesDir(modulesDir);
    }
    catch (err) {
        if (err['code'] === 'ENOENT')
            return null;
        throw err;
    }
}
exports.default = readModulesDir;
async function _readModulesDir(modulesDir, scope) {
    let pkgNames = [];
    const parentDir = scope ? path.join(modulesDir, scope) : modulesDir;
    for (const dir of await fs.readdir(parentDir)) {
        if (dir[0] === '.')
            continue;
        if (!scope && dir[0] === '@') {
            pkgNames = [
                ...pkgNames,
                ...await _readModulesDir(modulesDir, dir),
            ];
            continue;
        }
        const pkgName = scope ? `${scope}/${dir}` : dir;
        pkgNames.push(pkgName);
    }
    return pkgNames;
}
//# sourceMappingURL=index.js.map