"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dint = require("dint");
const loadJsonFile = require("load-json-file");
const path = require("path");
async function untouched(pkgDir) {
    let dirIntegrity = null;
    try {
        dirIntegrity = await loadJsonFile(path.join(path.dirname(pkgDir), 'integrity.json'));
    }
    catch (err) {
        if (err.code !== 'ENOENT')
            throw err;
        return false; // for backward compatibility
    }
    return dint.check(pkgDir, dirIntegrity)
        .then((ok) => ok && dirIntegrity);
}
exports.default = untouched;
//# sourceMappingURL=index.js.map