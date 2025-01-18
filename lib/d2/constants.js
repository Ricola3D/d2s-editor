"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConstantData = exports.getConstantData = void 0;
const versionedConstants = {
    vanilla: {},
    remodded: {},
};
function getConstantData(mod, version) {
    if (!(mod in versionedConstants)) {
        throw new Error(`No constant data found for this mod ${mod}. Supported mods are: ${Object.keys(versionedConstants).join(', ')}`);
    }
    if (!(version.toString() in versionedConstants[mod])) {
        throw new Error(`No constant data found for version ${version} of mod ${mod}. Supported versions are: ${Object.keys(versionedConstants[mod]).join(', ')}`);
    }
    const constants = versionedConstants[mod][version.toString()];
    return constants;
}
exports.getConstantData = getConstantData;
function setConstantData(mod, version, data) {
    versionedConstants[mod][version.toString()] = data;
}
exports.setConstantData = setConstantData;
