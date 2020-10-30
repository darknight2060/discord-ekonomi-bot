"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf = require("@zkochan/rimraf");
const dint = require("dint");
const execa = require("execa");
const path = require("path");
const pathTemp = require("path-temp");
exports.default = () => {
    return {
        git: async function fetchFromGit(resolution, targetFolder) {
            const tempLocation = pathTemp(targetFolder);
            await execGit(['clone', resolution.repo, tempLocation]);
            await execGit(['checkout', resolution.commit], { cwd: tempLocation });
            // removing /.git to make directory integrity calculation faster
            await rimraf(path.join(tempLocation, '.git'));
            return {
                filesIndex: await dint.from(tempLocation),
                tempLocation,
            };
        },
    };
};
function prefixGitArgs() {
    return process.platform === 'win32' ? ['-c', 'core.longpaths=true'] : [];
}
function execGit(args, opts) {
    const fullArgs = prefixGitArgs().concat(args || []);
    return execa('git', fullArgs, opts);
}
