"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const DIFF_COLORS = {
    feature: chalk.yellowBright.bold,
    fix: chalk.greenBright.bold,
};
function colorizeSemverDiff(semverDiff) {
    var _a;
    if (!semverDiff) {
        throw new TypeError('semverDiff must be defined');
    }
    if (typeof semverDiff.change !== 'string') {
        throw new TypeError('semverDiff.change must be defined');
    }
    const highlight = (_a = DIFF_COLORS[semverDiff.change], (_a !== null && _a !== void 0 ? _a : chalk.redBright.bold));
    const same = joinVersionTuples(semverDiff.diff[0], 0);
    const other = highlight(joinVersionTuples(semverDiff.diff[1], semverDiff.diff[0].length));
    if (!same)
        return other;
    if (!other) {
        // Happens when current is 1.0.0-rc.0 and latest is 1.0.0
        return same;
    }
    return semverDiff.diff[0].length === 3
        ? `${same}-${other}` : `${same}.${other}`;
}
exports.default = colorizeSemverDiff;
function joinVersionTuples(versionTuples, startIndex) {
    const neededForSemver = 3 - startIndex;
    if (versionTuples.length <= neededForSemver || neededForSemver <= 0) {
        return versionTuples.join('.');
    }
    return `${versionTuples.slice(0, neededForSemver).join('.')}-${versionTuples.slice(neededForSemver).join('.')}`;
}
