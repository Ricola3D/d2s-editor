"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeItem = exports.readItem = exports.write = exports.read = exports.reader = void 0;
const header_1 = require("./header");
const attributes_1 = require("./attributes");
const bitreader_1 = require("../binary/bitreader");
const bitwriter_1 = require("../binary/bitwriter");
const skills_1 = require("./skills");
const items = __importStar(require("./items"));
const constants_1 = require("./constants");
const attribute_enhancer_1 = require("./attribute_enhancer");
const defaultConfig = {
    extendedStash: false,
    sortProperties: true,
};
function reader(buffer) {
    return new bitreader_1.BitReader(buffer);
}
exports.reader = reader;
async function read(buffer, mod, userConfig) {
    const char = {};
    const reader = new bitreader_1.BitReader(buffer);
    const config = Object.assign(defaultConfig, userConfig);
    await (0, header_1.readHeader)(char, reader);
    //could load constants based on version here
    await (0, header_1.readHeaderData)(char, reader, mod);
    await (0, attributes_1.readAttributes)(char, reader, mod);
    await (0, skills_1.readSkills)(char, reader, mod);
    await items.readCharItems(char, reader, mod, config);
    await items.readCorpseItems(char, reader, mod, config);
    if (char.header.status.expansion) {
        await items.readMercItems(char, reader, mod, config);
        await items.readGolemItems(char, reader, mod, config);
    }
    await (0, attribute_enhancer_1.enhanceAttributes)(char, mod, char.header.version, config);
    return char;
}
exports.read = read;
async function readItem(buffer, mod, version, userConfig) {
    const reader = new bitreader_1.BitReader(buffer);
    const config = Object.assign(defaultConfig, userConfig);
    const item = await items.readItem(reader, mod, version, config);
    await (0, attribute_enhancer_1.enhanceItems)([item], mod, version);
    return item;
}
exports.readItem = readItem;
async function write(data, mod, version, userConfig) {
    const config = Object.assign(defaultConfig, userConfig);
    const writer = new bitwriter_1.BitWriter();
    data.header.version = version;
    writer.WriteArray(await (0, header_1.writeHeader)(data));
    const constants = (0, constants_1.getConstantData)(mod, data.header.version);
    writer.WriteArray(await (0, header_1.writeHeaderData)(data, constants));
    writer.WriteArray(await (0, attributes_1.writeAttributes)(data, constants));
    writer.WriteArray(await (0, skills_1.writeSkills)(data));
    writer.WriteArray(await items.writeCharItems(data, mod, version, config));
    writer.WriteArray(await items.writeCorpseItem(data, mod, version, config));
    if (data.header.status.expansion) {
        writer.WriteArray(await items.writeMercItems(data, mod, version, config));
        writer.WriteArray(await items.writeGolemItems(data, mod, version, config));
    }
    await (0, header_1.fixHeader)(writer);
    return writer.ToArray();
}
exports.write = write;
async function writeItem(item, mod, version, userConfig) {
    const config = Object.assign(defaultConfig, userConfig);
    const writer = new bitwriter_1.BitWriter();
    writer.WriteArray(await items.writeItem(item, mod, version, config));
    return writer.ToArray();
}
exports.writeItem = writeItem;
