"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function resolveTarball(wantedDependency) {
    if (!wantedDependency.pref.startsWith('http:') && !wantedDependency.pref.startsWith('https:')) {
        return null;
    }
    return {
        id: wantedDependency.pref
            .replace(/^.*:\/\/(git@)?/, '')
            .replace(/\.tgz$/, ''),
        // TODO BREAKING CHANGE: uncomment the following: (or never remove extensions)
        // .replace(/\.tar.gz$/, ''),
        // .replace(/\.tar$/, ''),
        normalizedPref: wantedDependency.pref,
        resolution: {
            tarball: wantedDependency.pref,
        },
        resolvedVia: 'url',
    };
}
exports.default = resolveTarball;
