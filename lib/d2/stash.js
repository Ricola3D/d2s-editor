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
exports.write = exports.read = void 0;
const types = __importStar(require("./types"));
const bitwriter_1 = require("../binary/bitwriter");
const items = __importStar(require("./items"));
const attribute_enhancer_1 = require("./attribute_enhancer");
const bitreader_1 = require("../binary/bitreader");
const defaultConfig = {
    extendedStash: false,
};
async function read(buffer, mod /*, userConfig?: types.IConfig*/) {
    const stash = {};
    const reader = new bitreader_1.BitReader(buffer);
    // const config = Object.assign(defaultConfig, userConfig);
    const firstHeader = reader.ReadUInt32();
    reader.SeekByte(0);
    if (firstHeader == 0xaa55aa55) {
        stash.pages = [];
        let pageCount = 0;
        while (reader.offset < reader.bits.length) {
            pageCount++;
            await readStashHeader(stash, reader);
            await readStashPart(stash, reader, mod, parseInt(stash.version));
        }
        stash.pageCount = pageCount;
    }
    else {
        await readStashHeader(stash, reader);
        await readStashPages(stash, reader, mod, parseInt(stash.version));
    }
    return stash;
}
exports.read = read;
async function readStashHeader(stash, reader) {
    const header = reader.ReadUInt32();
    switch (header) {
        // Resurrected
        case 0xaa55aa55:
            stash.type = types.EStashType.shared;
            stash.hardcore = reader.ReadUInt32() == 0;
            stash.version = reader.ReadUInt32().toString();
            stash.sharedGold = reader.ReadUInt32();
            reader.ReadUInt32(); // size of the sector
            reader.SkipBytes(44); // empty
            break;
        // LoD
        case 0x535353: // SSS
        case 0x4d545343: // CSTM
            stash.version = reader.ReadString(2);
            if (stash.version !== '01' && stash.version !== '02') {
                throw new Error(`unkown stash version ${stash.version} at position ${reader.offset - 2 * 8}`);
            }
            stash.type = header === 0x535353 ? types.EStashType.shared : types.EStashType.private;
            if (stash.type === types.EStashType.shared && stash.version == '02') {
                stash.sharedGold = reader.ReadUInt32();
            }
            if (stash.type === types.EStashType.private) {
                reader.ReadUInt32();
                stash.sharedGold = 0;
            }
            stash.pageCount = reader.ReadUInt32();
            break;
        default:
            debugger;
            throw new Error(`shared stash header 'SSS' / 0xAA55AA55 / private stash header 'CSTM' not found at position ${reader.offset - 3 * 8}`);
    }
}
async function readStashPages(stash, reader, mod, version) {
    stash.pages = [];
    for (let i = 0; i < stash.pageCount; i++) {
        await readStashPage(stash, reader, mod, version);
    }
}
async function readStashPage(stash, reader, mod, version) {
    const page = {
        items: [],
        name: '',
        type: 0,
    };
    const header = reader.ReadString(2);
    if (header !== 'ST') {
        throw new Error(`can not read stash page header ST at position ${reader.offset - 2 * 8}`);
    }
    page.type = reader.ReadUInt32();
    page.name = reader.ReadNullTerminatedString();
    page.items = await items.readItems(reader, mod, version, defaultConfig);
    (0, attribute_enhancer_1.enhanceItems)(page.items, mod, version);
    stash.pages.push(page);
}
async function readStashPart(stash, reader, mod, version) {
    const page = {
        items: [],
        name: '',
        type: 0,
    };
    page.items = await items.readItems(reader, mod, version, defaultConfig);
    (0, attribute_enhancer_1.enhanceItems)(page.items, mod, version);
    stash.pages.push(page);
}
async function write(data, mod, version, userConfig) {
    const config = Object.assign(defaultConfig, userConfig);
    const writer = new bitwriter_1.BitWriter();
    if (version > 0x61) {
        for (const page of data.pages) {
            writer.WriteArray(await writeStashSection(data, page, mod, version, config));
        }
    }
    else {
        writer.WriteArray(await writeStashHeader(data));
        writer.WriteArray(await writeStashPages(data, mod, version, config));
    }
    return writer.ToArray();
}
exports.write = write;
async function writeStashHeader(data) {
    const writer = new bitwriter_1.BitWriter();
    if (data.type === types.EStashType.private) {
        writer.WriteString('CSTM', 4);
    }
    else {
        writer.WriteString('SSS', 4);
    }
    writer.WriteString(data.version, data.version.length);
    if (data.type === types.EStashType.private) {
        writer.WriteString('', 4);
    }
    else {
        if (data.version == '02') {
            writer.WriteUInt32(data.sharedGold);
        }
    }
    writer.WriteUInt32(data.pages.length);
    return writer.ToArray();
}
async function writeStashSection(data, page, mod, version, userConfig) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteUInt32(0xaa55aa55);
    writer.WriteUInt32(data.hardcore ? 0 : 1);
    writer.WriteUInt32(version);
    writer.WriteUInt32(data.sharedGold);
    writer.WriteUInt32(0); // size of the sector, to be fixed later
    writer.WriteBytes(new Uint8Array(44).fill(0)); // empty
    writer.WriteArray(await items.writeItems(page.items, mod, version, userConfig));
    const size = writer.offset;
    writer.SeekByte(16);
    writer.WriteUInt32(Math.ceil(size / 8));
    return writer.ToArray();
}
async function writeStashPages(data, mod, version, config) {
    const writer = new bitwriter_1.BitWriter();
    for (let i = 0; i < data.pages.length; i++) {
        writer.WriteArray(await writeStashPage(data.pages[i], mod, version, config));
    }
    return writer.ToArray();
}
async function writeStashPage(data, mod, version, config) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteString('ST', 2);
    writer.WriteUInt32(data.type);
    writer.WriteString(data.name, data.name.length + 1);
    writer.WriteArray(await items.writeItems(data.items, mod, version, config));
    return writer.ToArray();
}
