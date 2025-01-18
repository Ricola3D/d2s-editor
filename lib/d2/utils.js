"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shift = exports.numValues = exports.getValueTooltip = exports.isSkill = exports.isClassSkillTab = exports.isClass = exports.getMinValue = exports.getMaxValue = exports.getValueBitSize = exports.getItemTypeDef = exports.hexStringToArrayBuffer = exports.arrayBufferToHexString = exports.arrayBufferToBase64String = exports.b64StringToArrayBuffer = exports.swapObjectKeyValue = exports.nameRegex = void 0;
// Character name must be 2-15 characters, with at most once "-" or "_" character not placed at first or last.
exports.nameRegex = /^[A-Za-z](?=.{0,14}$)[A-Za-z]*[A-Za-z\-_][A-Za-z]+$/;
function swapObjectKeyValue(obj) {
    const swappedObj = {};
    for (const key in obj) {
        swappedObj[obj[key]] = key;
    }
    return swappedObj;
}
exports.swapObjectKeyValue = swapObjectKeyValue;
// Convert a base-64 encoded string to an ArrayBuffer of char codes
function b64StringToArrayBuffer(base64string) {
    if (typeof window !== 'undefined') {
        // Browser version
        const string = window.atob(base64string);
        const bytes = new Uint8Array(string.length);
        for (let i = 0; i < string.length; i++) {
            bytes[i] = string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    else {
        // NodeJS version (or could use JSDOM in our scripts)
        return Buffer.from(base64string, 'base64').buffer;
    }
}
exports.b64StringToArrayBuffer = b64StringToArrayBuffer;
// Convert an ArrayBuffer of char codes to a base-64 encoded string
function arrayBufferToBase64String(arrayBuffer) {
    if (typeof window !== 'undefined') {
        // Browser version
        let str = '';
        const bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return window.btoa(str);
    }
    else {
        // NodeJS version (or could use JSDOM in our scripts)
        return Buffer.from(arrayBuffer).toString('base64');
    }
}
exports.arrayBufferToBase64String = arrayBufferToBase64String;
// Convert an ArrayBuffer to an hex string (each 2char is the hexa representation a byte)
function arrayBufferToHexString(arrayBuffer) {
    return [...new Uint8Array(arrayBuffer)] // To normal array
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    // return Buffer.from(arrayBuffer).toString("hex"); // Only for NodeJS
}
exports.arrayBufferToHexString = arrayBufferToHexString;
// Convert an hex string (each 2char is the hexa representation a byte) to an ArrayBuffer
function hexStringToArrayBuffer(hexStr) {
    const bytesHexValues = hexStr.match(/[\da-f]{2}/gi);
    let bytes = [];
    if (bytesHexValues) {
        bytes = bytesHexValues.map((hex) => parseInt(hex, 16));
    }
    const typedArray = new Uint8Array(bytes);
    return typedArray.buffer;
    // return Buffer.from(hexStr, "hex").buffer; // Only for NodeJS
}
exports.hexStringToArrayBuffer = hexStringToArrayBuffer;
function getItemTypeDef(item, constants) {
    if (constants.armor_items && constants.armor_items[item.type]) {
        return constants.armor_items[item.type];
    }
    else if (constants.weapon_items && constants.weapon_items[item.type]) {
        return constants.weapon_items[item.type];
    }
    else if (constants.other_items && constants.other_items[item.type]) {
        return constants.other_items[item.type];
    }
    return null;
}
exports.getItemTypeDef = getItemTypeDef;
function getValueBitSize(itemStatDef, valIdx) {
    // 0-indexed
    let bitSize = itemStatDef.sB;
    switch (itemStatDef.e) {
        case 1: // Logic is reversed: Param is the value, and values are the Params
            if (valIdx == 1 && itemStatDef.sP)
                bitSize = itemStatDef.sP;
            break;
        case 2: // 2 Params (6bits skill level + 10bits skill ID) + 1 Value (7bits chance)
            if (valIdx == 0)
                bitSize = 6;
            if (valIdx == 1)
                bitSize = 10;
            break;
        case 3: // 2 Params (6bits skill level + 10bits skill ID) + 2 Values (8bits current charges, 8bits max charges)
            if (valIdx == 0)
                bitSize = 6;
            if (valIdx == 1)
                bitSize = 10;
            if (valIdx == 2)
                bitSize = 8;
            if (valIdx == 3)
                bitSize = 8;
            break;
        default: // Undefined: optional (sP bits param) + sB bits value
            if (valIdx == 0 && itemStatDef.sP)
                bitSize = itemStatDef.sP;
            break;
    }
    return bitSize;
}
exports.getValueBitSize = getValueBitSize;
function getMaxValue(statId, valIdx, magical_properties) {
    // 0-indexed
    let stat = magical_properties[statId];
    if (stat.np && valIdx < stat.np) {
        // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
        stat = magical_properties[statId + valIdx];
    }
    const bitSize = getValueBitSize(stat, valIdx);
    const add = stat.sA ? stat.sA : 0;
    return shift(1, bitSize) - 1 - add;
    // let maxValue = stat.sS ? shift(1, stat.sB - 1) - 1 - add : shift(1, stat.sB) - 1 - add;
    // return maxValue
}
exports.getMaxValue = getMaxValue;
function getMinValue(statId, valIdx, magical_properties) {
    //for the stat to be present need value > 0
    let stat = magical_properties[statId];
    if (valIdx > 0) {
        if (stat.np && valIdx < stat.np) {
            // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
            stat = magical_properties[statId + valIdx];
        }
        // TODO: encode
    }
    const add = stat.sA ? stat.sA : 0;
    return -add;
    // let minValue = stat.sS ? -1 * shift(1, stat.sB - 1) - add : -add;
    // return minValue
}
exports.getMinValue = getMinValue;
function isClass(statId, valueIdx, magical_properties) {
    // Is it a combobox with choice among 7 classes ?
    const stat = magical_properties[statId];
    if (stat.dF == 14 && valueIdx == 2) {
        return true;
    }
    if (stat.dF == 13 && valueIdx == 1) {
        return true;
    }
    return false;
}
exports.isClass = isClass;
function isClassSkillTab(statId, valueIdx, magical_properties) {
    // Is it a combobox with choice among 3 tabs ?
    const stat = magical_properties[statId];
    if (stat.dF == 14 && valueIdx == 1) {
        return true;
    }
    return false;
}
exports.isClassSkillTab = isClassSkillTab;
function isSkill(statId, valueIdx, magical_properties) {
    const stat = magical_properties[statId];
    if (stat.dF == 15 || stat.dF == 24) {
        // Similar to e=2 or 3
        return valueIdx == 2;
    }
    if (stat.dF == 16) {
        return valueIdx == 1;
    }
    if (stat.dF == 16 || stat.dF == 27 || stat.dF == 28) {
        // Aura when equipped or Similar to e=1
        return valueIdx == 1;
    }
    return false;
}
exports.isSkill = isSkill;
function getValueTooltip(statId, valueIdx, magical_properties) {
    const stat = magical_properties[statId];
    if (stat.dF == 14) {
        if (valueIdx == 1)
            return 'Skill Tab';
        if (valueIdx == 2)
            return 'Class';
        if (valueIdx == 3)
            return 'Bonus Level';
    }
    else if (stat.dF == 13) {
        if (valueIdx == 1)
            return 'Class';
        if (valueIdx == 2)
            return 'Bonus Level';
    }
    else if (stat.sP) {
        if (stat.e == 3) {
            if (valueIdx == 1)
                return 'Skill Level';
            if (valueIdx == 2)
                return 'Skill';
            if (valueIdx == 3)
                return 'Current charges';
            if (valueIdx == 4)
                return 'Max charges';
            return valueIdx == 2;
        }
        else if (stat.e == 2) {
            if (valueIdx == 1)
                return 'Skill Level';
            if (valueIdx == 2)
                return 'Skill';
            if (valueIdx == 3)
                return 'Chances to Cast';
            return valueIdx == 2;
        }
        else {
            if (valueIdx == 1)
                return 'Skill';
            if (valueIdx == 2)
                return 'Skill Level';
        }
    }
    else if (stat.np && stat.np > 1) {
        if (valueIdx == 1)
            return stat.s === 'poisonmindam' ? 'Min (xLength/256)' : 'Min';
        if (valueIdx == 2)
            return 'Max';
        if (valueIdx == 3)
            return 'Length in frames (25frames = 1s)';
    }
    return '';
}
exports.getValueTooltip = getValueTooltip;
function numValues(statId, magical_properties) {
    // 1 - +[value] [string1]
    // 2 - [value]% [string1]
    // 3 - [value] [string1]
    // 4 - +[value]% [string1]
    // 5 - [value*100/128]% [string1]
    // 6 - +[value] [string1] [string2]
    // 7 - [value]% [string1] [string2]
    // 8 - +[value]% [string1] [string2]
    // 9 - [value] [string1] [string2]
    // 10 - [value*100/128]% [string1] [string2]
    // 11 - Repairs 1 Durability In [100 / value] Seconds
    // 12 - +[value] [string1]
    // 13 - +[value] to [class] Skill Levels
    // 14 - +[value] to [skilltab] Skill Levels ([class] Only)
    // 15 - [chance]% to case [slvl] [skill] on [event]
    // 16 - Level [sLvl] [skill] Aura When Equipped
    // 17 - [value] [string1] (Increases near [time])
    // 18 - [value]% [string1] (Increases near [time])
    // 19 - this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
    // 20 - [value * -1]% [string1]
    // 21 - [value * -1] [string1]
    // 22 - [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
    // 23 - [value]% [string1] [monster]
    // 24 - used for charges, we all know how that desc looks
    // 25 - not used by vanilla, present in the code but I didn't test it yet
    // 26 - not used by vanilla, present in the code but I didn't test it yet
    // 27 - +[value] to [skill] ([class] Only)
    // 28 - +[value] to [skill]
    const statDef = magical_properties[statId];
    if (statDef.np) {
        return statDef.np;
    }
    if (statDef.dF == 24 || statDef.e == 3) {
        return 4;
    }
    if (statDef.dF == 14 || statDef.e == 2) {
        return 3;
    }
    if (statDef.dF == 13 ||
        statDef.dF == 16 ||
        (statDef.dF >= 22 && statDef.dF <= 23) ||
        (statDef.dF >= 27 && statDef.dF <= 28) ||
        statDef.sP) {
        return 2;
    }
    if ((statDef.dF >= 1 && statDef.dF <= 12) || (statDef.dF >= 17 && statDef.dF <= 18) || (statDef.dF >= 20 && statDef.dF <= 21)) {
        return 1;
    }
    // Mostly dF 19 (Blizzard's sprintf implementation)
    return 1;
}
exports.numValues = numValues;
function shift(number, shift) {
    return number * Math.pow(2, shift);
}
exports.shift = shift;
