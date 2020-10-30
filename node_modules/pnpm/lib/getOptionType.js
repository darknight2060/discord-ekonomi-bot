"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nopt = require("nopt");
const R = require("ramda");
function getOptionCompletions(optionTypes, shorthands, option) {
    const optionType = getOptionType(optionTypes, shorthands, option);
    return optionTypeToCompletion(optionType);
}
exports.getOptionCompletions = getOptionCompletions;
function optionTypeToCompletion(optionType) {
    switch (optionType) {
        // In this case the option is complete
        case undefined:
        case Boolean: return undefined;
        // In this case, anything may be the option value
        case String:
        case Number: return [];
    }
    if (!Array.isArray(optionType))
        return [];
    if (optionType.length === 1) {
        return optionTypeToCompletion(optionType);
    }
    return optionType.filter((ot) => typeof ot === 'string');
}
function getOptionType(optionTypes, shorthands, option) {
    var _a;
    const allBools = R.fromPairs(Object.entries(optionTypes).map(([optionName]) => [optionName, Boolean]));
    const result = nopt(allBools, shorthands, [option], 0);
    delete result.argv;
    return optionTypes[(_a = Object.entries(result)[0]) === null || _a === void 0 ? void 0 : _a[0]];
}
function getLastOption(completionCtx) {
    if (isOption(completionCtx.prev))
        return completionCtx.prev;
    if (completionCtx.lastPartial === '' || completionCtx.words <= 1)
        return null;
    const words = completionCtx.line.slice(0, completionCtx.point).trim().split(/\s+/);
    const lastWord = words[words.length - 2];
    return isOption(lastWord) ? lastWord : null;
}
exports.getLastOption = getLastOption;
function isOption(word) {
    return word.startsWith('--') && word.length >= 3 ||
        word.startsWith('-') && word.length >= 2;
}
function currentTypedWordType(completionCtx) {
    if (completionCtx.partial.endsWith(' '))
        return null;
    return completionCtx.lastPartial.startsWith('-') ? 'option' : 'value';
}
exports.currentTypedWordType = currentTypedWordType;
