"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bole = require("bole");
bole.setFastTime();
exports.default = bole('pnpm');
const globalLogger = bole('pnpm:global');
function globalWarn(message) {
    globalLogger.warn(message);
}
exports.globalWarn = globalWarn;
function globalInfo(message) {
    globalLogger.info(message);
}
exports.globalInfo = globalInfo;
//# sourceMappingURL=logger.js.map