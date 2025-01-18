"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAttributes = exports.readAttributes = void 0;
const bitwriter_1 = require("../binary/bitwriter");
const constants_1 = require("./constants");
//todo use constants.magical_properties and csvBits
function readAttributes(char, reader, mod) {
    const constants = (0, constants_1.getConstantData)(mod, char.header.version);
    // Stats = magical_properties with "Saved" = 1.
    // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
    const attributes = constants.magical_properties.filter((val, idx) => val && val.c && val.cB && idx < 256);
    // Initial values
    char.attributes = attributes.reduce((acc, curr) => {
        acc[curr.s || `attribute_${curr.id}`] = 0; // Add the attribute with value 0
        return acc;
    }, {});
    const header = reader.ReadString(2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
    if (header != 'gf') {
        // header is not present in first save after char is created
        if (char.header.level === 1) {
            const classData = constants.classes.find((c) => c.n === char.header.class).a;
            char.attributes = {
                strength: +classData.str,
                energy: +classData.int,
                dexterity: +classData.dex,
                vitality: +classData.vit,
                statpts: 0,
                newskills: 0,
                hitpoints: +classData.vit + +classData.hpadd,
                maxhp: +classData.vit + +classData.hpadd,
                mana: +classData.int,
                maxmana: +classData.int,
                stamina: +classData.stam,
                maxstamina: +classData.stam,
                level: 1,
                experience: 0,
                gold: 0,
                goldbank: 0,
            };
            return;
        }
        throw new Error(`Attribute header 'gf' not found at position ${reader.offset - 2 * 8}`);
    }
    //let bitOffset = 0;
    let id = reader.ReadUInt16(9);
    //read till 0x1ff end of attributes is found
    while (id != 0x1ff) {
        // bitOffset += 9;
        const charStatDef = constants.magical_properties[id];
        if (charStatDef === undefined) {
            throw new Error(`Invalid attribute id: ${id}`);
        }
        const size = charStatDef.cB;
        if (size === undefined) {
            throw new Error(`Missing CSV save bits for id: ${id}`);
        }
        char.attributes[charStatDef.s || `attribute_${charStatDef.id}`] = reader.ReadUInt32(size);
        if (charStatDef.cVS) {
            //hitpoints - maxstamina need to be bit shifted
            char.attributes[charStatDef.s || `attribute_${charStatDef.id}`] >>>= charStatDef.cVS;
        }
        // Next attribute
        // bitOffset += size;
        id = reader.ReadUInt16(9);
    }
    const prevOffset = reader.offset;
    reader.Align();
    const newOffset = reader.offset;
    char.unk_after_attr = reader.bits.subarray(prevOffset, newOffset);
}
exports.readAttributes = readAttributes;
async function writeAttributes(char, constants) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteString('gf', 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
    // Stats = magical_properties with "Saved" = 1.
    // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
    const charStatDefs = constants.magical_properties.filter((val, idx) => val && val.c && idx < 256);
    for (const charStatDef of charStatDefs) {
        let value = char.attributes[charStatDef.s || `attribute_${charStatDef.id}`];
        if (!value) {
            continue; // 0 values are not saved to gain file size
        }
        const size = charStatDef.cB;
        if (size === undefined) {
            throw new Error(`Missing CSV save bits for attribute: ${charStatDef}`);
        }
        if (charStatDef.cVS) {
            value <<= charStatDef.cVS;
        }
        writer.WriteUInt16(charStatDef.id, 9);
        writer.WriteUInt32(value, size);
    }
    writer.WriteUInt16(0x1ff, 9); // Attribute 511 is reserved for end tag
    writer.Align();
    return writer.ToArray();
}
exports.writeAttributes = writeAttributes;
