"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const decompress = require("decompress-maybe");
const tar = require("tar-fs");
const ssri = require("ssri");
function remote(stream, dest, opts = {}) {
    return new Promise((resolve, reject) => {
        const actualShasum = crypto.createHash('sha1');
        if (typeof stream.statusCode === 'number' && stream.statusCode !== 200) {
            return reject(new Error(`Invalid response: ${stream.statusCode}`));
        }
        if (opts.onStart)
            opts.onStart();
        if (opts.onProgress && stream.headers['content-length']) {
            const onProgress = opts.onProgress;
            let downloaded = 0;
            let size = parseInt(stream.headers['content-length']);
            stream.on('data', (chunk) => {
                downloaded += chunk.length;
                onProgress(downloaded, size);
            });
        }
        const streamToUnpack = stream
            .on('data', (_) => { actualShasum.update(_); })
            .on('error', reject);
        local(streamToUnpack, dest, opts).then(finish).catch(reject);
        // without pausing, gunzip/tar-fs would miss the beginning of the stream
        if (stream.resume)
            stream.resume();
        function finish(index) {
            const digest = actualShasum.digest('hex');
            if (opts.shasum && digest !== opts.shasum) {
                reject(new Error(`Incorrect shasum (expected ${opts.shasum}, got ${digest})`));
                return;
            }
            resolve(index);
        }
    });
}
exports.remote = remote;
function local(stream, dest, opts = {}) {
    const ignore = opts.ignore ? function (filename, header) {
        return opts.ignore((header && header.name) || filename);
    } : function () { return false; };
    const generateIntegrity = opts.generateIntegrity !== false;
    const headers = {};
    return new Promise((resolve, reject) => {
        stream
            .on('error', reject)
            .pipe(decompress()).on('error', reject)
            .pipe(tar.extract(dest, {
            chown: false,
            dmode: 0o755,
            fmode: 0o644,
            ignore,
            mapStream(fileStream, header) {
                headers[header.name] = header;
                if (generateIntegrity) {
                    headers[header.name].generatingIntegrity = ssri.fromStream(fileStream);
                }
                return fileStream;
            },
            strip: 1,
        }))
            .on('error', reject)
            .on('finish', () => {
            resolve(headers);
        });
    });
}
exports.local = local;
//# sourceMappingURL=index.js.map