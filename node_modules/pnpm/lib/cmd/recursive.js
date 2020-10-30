"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_utils_1 = require("@pnpm/cli-utils");
const common_cli_options_help_1 = require("@pnpm/common-cli-options-help");
const constants_1 = require("@pnpm/constants");
const common_tags_1 = require("common-tags");
const renderHelp = require("render-help");
exports.rcOptionsTypes = () => ({});
exports.cliOptionsTypes = () => ({});
exports.commandNames = ['recursive', 'multi', 'm'];
function help() {
    return renderHelp({
        description: common_tags_1.oneLine `
      Concurrently performs some actions in all subdirectories with a \`package.json\` (excluding node_modules).
      A \`pnpm-workspace.yaml\` file may be used to control what directories are searched for packages.`,
        descriptionLists: [
            {
                title: 'Commands',
                list: [
                    {
                        name: 'install',
                    },
                    {
                        name: 'add',
                    },
                    {
                        name: 'update',
                    },
                    {
                        description: 'Uninstall a dependency from each package',
                        name: 'remove <pkg>...',
                    },
                    {
                        description: 'Removes links to local packages and reinstalls them from the registry.',
                        name: 'unlink',
                    },
                    {
                        description: 'List dependencies in each package.',
                        name: 'list [<pkg>...]',
                    },
                    {
                        description: 'List packages that depend on <pkg>.',
                        name: 'why <pkg>...',
                    },
                    {
                        description: 'Check for outdated dependencies in every package.',
                        name: 'outdated [<pkg>...]',
                    },
                    {
                        description: common_tags_1.oneLine `
              This runs an arbitrary command from each package's "scripts" object.
              If a package doesn't have the command, it is skipped.
              If none of the packages have the command, the command fails.`,
                        name: 'run <command> [-- <args>...]',
                    },
                    {
                        description: `This runs each package's "test" script, if one was provided.`,
                        name: 'test [-- <args>...]',
                    },
                    {
                        description: common_tags_1.oneLine `
              This command runs the "npm build" command on each package.
              This is useful when you install a new version of node,
              and must recompile all your C++ addons with the new binary.`,
                        name: 'rebuild [[<@scope>/<name>]...]',
                    },
                    {
                        description: `Run a command in each package.`,
                        name: 'exec -- <command> [args...]',
                    },
                    {
                        description: 'Publishes packages to the npm registry. Only publishes a package if its version is not taken in the registry.',
                        name: 'publish [--tag <tag>] [--access <public|restricted>]',
                    },
                ],
            },
            {
                title: 'Options',
                list: [
                    {
                        description: 'Continues executing other tasks even if a task threw an error.',
                        name: '--no-bail',
                    },
                    {
                        description: 'Set the maximum number of concurrency. Default is 4. For unlimited concurrency use Infinity.',
                        name: '--workspace-concurrency <number>',
                    },
                    {
                        description: common_tags_1.oneLine `
              Locally available packages are linked to node_modules instead of being downloaded from the registry.
              Convenient to use in a multi-package repository.`,
                        name: '--link-workspace-packages',
                    },
                    {
                        description: 'Sort packages topologically (dependencies before dependents). Pass --no-sort to disable.',
                        name: '--sort',
                    },
                    {
                        description: common_tags_1.oneLine `
              Creates a single ${constants_1.WANTED_LOCKFILE} file in the root of the workspace.
              A shared lockfile also means that all dependencies of all projects will be in a single node_modules.`,
                        name: '--shared-workspace-lockfile',
                    },
                ],
            },
            common_cli_options_help_1.FILTERING,
        ],
        url: cli_utils_1.docsUrl('recursive'),
        usages: [
            'pnpm recursive [command] [flags] [--filter <package selector>]',
            'pnpm multi [command] [flags] [--filter <package selector>]',
            'pnpm m [command] [flags] [--filter <package selector>]',
        ],
    });
}
exports.help = help;
function handler() {
    console.log(help());
    process.exit(1);
}
exports.handler = handler;
