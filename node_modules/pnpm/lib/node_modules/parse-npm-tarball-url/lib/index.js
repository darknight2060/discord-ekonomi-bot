"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const assert = require("assert");
const semver_1 = require("semver");
function parseNpmTarballUrl(url) {
    assert(url, 'url is required');
    assert(typeof url === 'string', 'url should be a string');
    const { path, host } = url_1.parse(url);
    if (!path || !host)
        return null;
    const pkg = parsePath(path);
    if (!pkg)
        return null;
    return {
        host,
        name: pkg.name,
        version: pkg.version,
    };
}
exports.default = parseNpmTarballUrl;
function parsePath(path) {
    const parts = path.split('/-/');
    if (parts.length !== 2)
        return null;
    const name = parts[0] && decodeURIComponent(parts[0].substr(1));
    if (!name)
        return null;
    const pathWithNoExtension = parts[1].replace(/\.tgz$/, '');
    const scopelessNameLength = name.length - (name.indexOf('/') + 1);
    const version = pathWithNoExtension.substr(scopelessNameLength + 1);
    if (!semver_1.valid(version, true))
        return null;
    return { name, version };
}
//# sourceMappingURL=index.js.map