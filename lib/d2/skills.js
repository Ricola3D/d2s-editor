"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSkills = exports.readSkills = void 0;
const bitwriter_1 = require("../binary/bitwriter");
const constants_1 = require("./constants");
function readSkills(char, reader, mod) {
    const constants = (0, constants_1.getConstantData)(mod, char.header.version);
    char.skills = [];
    const offset = SkillOffset[char.header.class];
    const header = reader.ReadString(2); //0x0000 [skills header = 0x69, 0x66 "if"]
    if (header !== 'if') {
        // header is not present in first save after char is created
        if (char.header.level === 1) {
            return; // TODO: return starter skills based on class
        }
        throw new Error(`Skills header 'if' not found at position ${reader.offset - 2 * 8}`);
    }
    for (let i = 0; i < 30; i++) {
        const id = offset + i;
        char.skills.push({
            id: id,
            points: reader.ReadUInt8(),
            name: constants.skills[id].s,
        });
    }
}
exports.readSkills = readSkills;
async function writeSkills(char) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteString('if', 2); //0x0000 [skills header = 0x69, 0x66 "if"]
    //probably array length checking/sorting of skills by id...
    for (let i = 0; i < 30; i++) {
        writer.WriteUInt8(char.skills[i].points);
    }
    return writer.ToArray();
}
exports.writeSkills = writeSkills;
const SkillOffset = {
    Amazon: 6,
    Sorceress: 36,
    Necromancer: 66,
    Paladin: 96,
    Barbarian: 126,
    Druid: 221,
    Assassin: 251,
};
