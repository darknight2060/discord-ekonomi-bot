"use strict";
const table_1 = require("table");
const NO_BORDERS = {
    topBody: '',
    topJoin: '',
    topLeft: '',
    topRight: '',
    bottomBody: '',
    bottomJoin: '',
    bottomLeft: '',
    bottomRight: '',
    bodyJoin: '',
    bodyLeft: '',
    bodyRight: '',
    joinBody: '',
    joinLeft: '',
    joinRight: '',
};
const TABLE_OPTIONS = {
    border: NO_BORDERS,
    singleLine: true,
};
const FIRST_COLUMN = { paddingLeft: 2, width: 3 };
const SHORT_OPTION_COLUMN = { alignment: 'right' };
const LONG_OPTION_COLUMN = { paddingLeft: 0 };
const DESCRIPTION_COLUMN = {
    paddingRight: 0,
    wrapWord: true,
};
function renderDescriptionList(descriptionItems, width) {
    const data = descriptionItems
        .sort((item1, item2) => item1.name.localeCompare(item2.name))
        .map(({ shortAlias, name, description }) => [shortAlias && `${shortAlias},` || ' ', name, description || '']);
    const firstColumnMaxWidth = getColumnMaxWidth(data, 0);
    const nameColumnWidth = Math.max(getColumnMaxWidth(data, 1), 19);
    const descriptionColumnWidth = Math.max(2, width - firstColumnMaxWidth - nameColumnWidth - 2 - 2 - 1);
    return multiTrim(table_1.table(data, Object.assign(Object.assign({}, TABLE_OPTIONS), { columns: [
            Object.assign(Object.assign({}, SHORT_OPTION_COLUMN), FIRST_COLUMN),
            Object.assign({ width: nameColumnWidth }, LONG_OPTION_COLUMN),
            Object.assign({ width: descriptionColumnWidth }, DESCRIPTION_COLUMN),
        ] })));
}
function multiTrim(str) {
    return str.split('\n').map((line) => line.trimRight()).filter(Boolean).join('\n');
}
function getColumnMaxWidth(data, columnNumber) {
    return data.reduce((maxWidth, row) => Math.max(maxWidth, row[columnNumber].length), 0);
}
module.exports = function renderHelp(config) {
    var _a, _b;
    const width = (_b = (_a = config.width) !== null && _a !== void 0 ? _a : process.stdout.columns) !== null && _b !== void 0 ? _b : 80;
    let outputSections = [];
    if (config.usages.length > 0) {
        const [firstUsage, ...restUsages] = config.usages;
        let usageOutput = `Usage: ${firstUsage}`;
        for (let usage of restUsages) {
            usageOutput += `\n       ${usage}`;
        }
        outputSections.push(usageOutput);
    }
    if (config.aliases && config.aliases.length) {
        outputSections.push(`${config.aliases.length === 1 ? 'Alias' : 'Aliases'}: ${config.aliases.join(', ')}`);
    }
    if (config.description)
        outputSections.push(`${config.description}`);
    if (config.descriptionLists) {
        for (let { title, list } of config.descriptionLists) {
            outputSections.push(`${title}:\n` + renderDescriptionList(list, width));
        }
    }
    if (config.url) {
        outputSections.push(`Visit ${config.url} for documentation about this command.`);
    }
    return outputSections.join('\n\n');
};
//# sourceMappingURL=index.js.map