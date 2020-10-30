"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findUp = require("find-up");
const path = require("path");
const WORKSPACE_MANIFEST_FILENAME = 'pnpm-workspace.yaml';
async function findWorkspaceDir(cwd) {
    const workspaceManifestLocation = await findUp(WORKSPACE_MANIFEST_FILENAME, { cwd });
    return workspaceManifestLocation && path.dirname(workspaceManifestLocation);
}
exports.default = findWorkspaceDir;
