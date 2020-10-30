"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
exports.globalInfo = logger_1.globalInfo;
exports.globalWarn = logger_1.globalWarn;
const streamParser_1 = require("./streamParser");
exports.streamParser = streamParser_1.default;
exports.createStreamParser = streamParser_1.createStreamParser;
const writeToConsole_1 = require("./writeToConsole");
exports.writeToConsole = writeToConsole_1.default;
exports.default = logger_1.default;
//# sourceMappingURL=index.js.map