"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const makeDir = require("make-dir");
const path = require("path");
const lockfile = require("proper-lockfile");
async function withLock(dir, opts) {
    dir = path.resolve(dir);
    await makeDir(opts.locks);
    const lockFilename = path.join(opts.locks, crypto.createHash('sha1').update(dir).digest('hex'));
    return await lock(lockFilename, {
        firstTime: true,
        stale: opts.stale,
        whenLocked: opts.whenLocked,
    });
}
exports.default = withLock;
async function lock(lockFilename, opts) {
    try {
        await lockfile.lock(lockFilename, { realpath: false, stale: opts.stale });
        async function unlockThis() {
            try {
                await lockfile.unlock(lockFilename, { realpath: false });
            }
            catch (err) {
                // We don't care if the folder was not locked or already unlocked
                if (err.code !== 'ENOTACQUIRED')
                    throw err;
            }
        }
        unlockThis['sync'] = function unlockSync() {
            try {
                lockfile.unlockSync(lockFilename, { realpath: false });
            }
            catch (err) {
                // We don't care if the folder was not locked or already unlocked
                if (err.code !== 'ENOTACQUIRED')
                    throw err;
            }
        };
        return unlockThis;
    }
    catch (err) {
        if (err.code !== 'ELOCKED')
            throw err;
        if (opts.firstTime && opts.whenLocked) {
            opts.whenLocked();
        }
        await delay(200);
        return await lock(lockFilename, {
            firstTime: false,
            stale: opts.stale,
            whenLocked: opts.whenLocked,
        });
    }
}
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map