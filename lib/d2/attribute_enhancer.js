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
exports.enhanceItem = exports.enhanceItems = exports.enhancePlayerAttributes = exports.enhanceAttributes = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const types = __importStar(require("./types"));
const utils_1 = require("./utils");
const types_1 = require("./types");
//do nice stuff
//combine group properties (all resists/all stats) and build friendly strings for a ui
//enhanced def/durability/weapon damage.
//lookup socketed compact items (runes/gems) properties for the slot they are in
//compute attributes like str/resists/etc..
function enhanceAttributes(char, mod, version, config) {
    enhanceItems(char.items, mod, version, char.attributes, config);
    enhanceItems([char.golem_item], mod, version, char.attributes, config);
    enhanceItems(char.merc_items, mod, version, char.attributes, config);
    enhanceItems(char.corpse_items, mod, version, char.attributes, config);
    //enhancePlayerAttributes(char, mod, version, config);
}
exports.enhanceAttributes = enhanceAttributes;
function enhancePlayerAttributes(char, mod, version, config) {
    const constants = (0, constants_1.getConstantData)(mod, version);
    const items = char.items.filter((item) => {
        return item.location_id === 1 && item.equipped_id !== 13 && item.equipped_id !== 14;
    });
    char.item_bonuses = [].concat
        .apply([], items.map((item) => _allAttributes(item /*, constants*/)))
        .filter((attribute) => attribute != null);
    char.item_bonuses = _groupAttributes(char.item_bonuses, constants);
    char.displayed_item_bonuses = _enhanceAttributeDescription(char.item_bonuses, constants, char.attributes, config);
}
exports.enhancePlayerAttributes = enhancePlayerAttributes;
function enhanceItems(items, mod, version, attributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
}, config, parent) {
    if (!items) {
        return;
    }
    for (const item of items) {
        if (!item) {
            continue;
        }
        if (item.socketed_items && item.socketed_items.length) {
            enhanceItems(item.socketed_items, mod, version, attributes, config, item);
        }
        enhanceItem(item, mod, version, attributes, config, parent);
    }
}
exports.enhanceItems = enhanceItems;
// Bound values (inclusive min and max)
function boundValue(v, min, max) {
    return Math.min(max, Math.max(min, v));
}
function enhanceItem(item, mod, version, attributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
}, config, parent) {
    const constants = (0, constants_1.getConstantData)(mod, version);
    const itemTypeDef = (0, utils_1.getItemTypeDef)(item, constants);
    if (itemTypeDef.m) {
        // Socketable gem/rune. Magical Attributes are computed dynamically
        if (parent) {
            // Socketed: re-compute magic_attributes
            const parentTypeDef = constants.armor_items[parent.type] || constants.weapon_items[parent.type] || constants.other_items[parent.type];
            const gemMods = itemTypeDef.m[parentTypeDef.gt];
            item.magic_attributes = _gemModsToAttributes(gemMods, constants);
        }
        else {
            // In inventory/stash/cube
            item.magic_attributes = [
                ..._gemModsToAttributes(itemTypeDef.m[0], constants).map((magicalProp) => Object.assign(magicalProp, { condition: 'Weapon/Gloves' })),
                ..._gemModsToAttributes(itemTypeDef.m[1], constants).map((magicalProp) => Object.assign(magicalProp, { condition: 'Armor/Boots/Helm/Belt' })),
                ..._gemModsToAttributes(itemTypeDef.m[2], constants).map((magicalProp) => Object.assign(magicalProp, { condition: 'Shield/Jewelry' })),
            ];
        }
    }
    // Enforce level is between 1 and 99
    item.level = boundValue(item.level, 1, 99);
    if (item.quality !== types_1.EQuality.Magic) {
        item.magic_prefix = 0;
        item.magic_suffix = 0;
    }
    if (item.quality === types_1.EQuality.Rare || item.quality === types_1.EQuality.Crafted || item.quality === types_1.EQuality.DemonTempered) {
        item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : '';
        item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : '';
        // Demon tempered doesn't have magical_name_ids since it's made from a unique
        if (item.quality === types_1.EQuality.DemonTempered)
            item.magical_name_ids = [0, 0, 0, 0, 0, 0];
    }
    else {
        item.rare_name_id = 0;
        item.rare_name = '';
        item.rare_name_id2 = 0;
        item.rare_name2 = '';
        item.magical_name_ids = [0, 0, 0, 0, 0, 0];
    }
    if (item.quality === types_1.EQuality.Set) {
        item.set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : '';
    }
    else {
        item.set_id = 0;
        item.set_name = '';
        item.set_attributes = [];
    }
    if (item.quality === types_1.EQuality.Unique) {
        item.unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : '';
    }
    else {
        item.unique_id = 0;
        item.unique_name = '';
    }
    if (item.quality !== types_1.EQuality.Magic && item.quality !== types_1.EQuality.Unique) {
        item.personalized = false;
        item.personalized_name = '';
    }
    // Set type_id
    // Also for armors: set defense_rating to the max
    // Also for weapons: set base_damage
    if (constants.armor_items[item.type]) {
        item.type_id = types_1.ETypeId.Armor;
        if (itemTypeDef.maxac) {
            if (!item.ethereal) {
                item.defense_rating = itemTypeDef.maxac;
            }
            else if (item.ethereal) {
                item.defense_rating = Math.floor(itemTypeDef.maxac * 1.5);
            }
        }
    }
    else if (constants.weapon_items[item.type]) {
        item.type_id = types_1.ETypeId.Weapon;
        const base_damage = {};
        if (!item.ethereal) {
            if (itemTypeDef.mind)
                base_damage.mindam = itemTypeDef.mind;
            if (itemTypeDef.maxd)
                base_damage.maxdam = itemTypeDef.maxd;
            if (itemTypeDef.min2d)
                base_damage.twohandmindam = itemTypeDef.min2d;
            if (itemTypeDef.max2d)
                base_damage.twohandmaxdam = itemTypeDef.max2d;
        }
        else if (item.ethereal) {
            if (itemTypeDef.mind)
                base_damage.mindam = Math.floor(itemTypeDef.mind * 1.5);
            if (itemTypeDef.maxd)
                base_damage.maxdam = Math.floor(itemTypeDef.maxd * 1.5);
            if (itemTypeDef.min2d)
                base_damage.twohandmindam = Math.floor(itemTypeDef.min2d * 1.5);
            if (itemTypeDef.max2d)
                base_damage.twohandmaxdam = Math.floor(itemTypeDef.max2d * 1.5);
        }
        item.base_damage = base_damage;
    }
    else if (constants.other_items[item.type]) {
        item.type_id = types_1.ETypeId.Other;
        item.ethereal = false;
    }
    if (itemTypeDef) {
        if (itemTypeDef.n)
            item.type_name = itemTypeDef.n;
        if (itemTypeDef.rs)
            item.reqstr = itemTypeDef.rs;
        if (itemTypeDef.rd)
            item.reqdex = itemTypeDef.rd;
        if (itemTypeDef.i)
            item.inv_file = itemTypeDef.i;
        if (itemTypeDef.hdi)
            item.hd_inv_file = itemTypeDef.hdi;
        if (itemTypeDef.ih)
            item.inv_height = itemTypeDef.ih;
        if (itemTypeDef.iw)
            item.inv_width = itemTypeDef.iw;
        if (itemTypeDef.it)
            item.inv_transform = itemTypeDef.it;
        if (itemTypeDef.iq)
            item.item_quality = itemTypeDef.iq;
        if (itemTypeDef.c)
            item.categories = itemTypeDef.c;
        if (itemTypeDef.gs)
            item.max_sockets = itemTypeDef.gs;
        if (itemTypeDef.durability) {
            if (!item.ethereal) {
                item.current_durability = itemTypeDef.durability;
                item.max_durability = itemTypeDef.durability;
            }
            else if (item.ethereal) {
                item.current_durability = itemTypeDef.durability - Math.ceil(itemTypeDef.durability / 2) + 1;
                item.max_durability = itemTypeDef.durability - Math.ceil(itemTypeDef.durability / 2) + 1;
            }
        }
        // If the item has been edited, we must update class_specific
        if (itemTypeDef.c) {
            let classSpecific = false;
            if (![types.EQuality.Unique, types.EQuality.Set, types.EQuality.DemonTempered].includes(item.quality) &&
                !itemTypeDef.c.includes('Relic')) {
                // Unique/set/Ready-for-tempering/tempered don't have the staff mods
                // Does any of the category is "<class> Item" ?
                for (const cat of itemTypeDef.c) {
                    if (cat.endsWith(' Item')) {
                        classSpecific = true;
                        break;
                    }
                }
            }
            if (classSpecific) {
                item.class_specific = true;
            }
            else {
                item.class_specific = false;
                item.auto_affix_id = 0;
            }
        }
        // Enforce stackable consistency
        if (itemTypeDef.s) {
            item.quantity = boundValue(item.quantity, 1, itemTypeDef.smax || 500);
        }
        else {
            item.quantity = 0;
        }
        // Enforce total_nr_of_sockets between 0 and max for this item type
        item.total_nr_of_sockets = boundValue(item.total_nr_of_sockets, 0, itemTypeDef.gs || 0);
        // Enforce coherence between total_nr_of_sockets & socketed
        item.socketed = item.total_nr_of_sockets > 0;
        // Enforce nr_of_items_in_sockets & socketed_items inferior or equal to total_nr_of_sockets
        item.nr_of_items_in_sockets = boundValue(item.nr_of_items_in_sockets, 0, item.total_nr_of_sockets);
        item.socketed_items = (item.socketed_items || []).slice(0, item.nr_of_items_in_sockets);
        // Ensure coherence of other attributes with quality
        item.given_runeword = item.quality <= types_1.EQuality.Superior && item.nr_of_items_in_sockets > 0 && item.runeword_id > 0;
        if (item.given_runeword) {
            item.runeword_name = constants.runewords[item.runeword_id] ? constants.runewords[item.runeword_id].n : '';
        }
        else {
            item.given_runeword = false;
            item.runeword_id = 0;
            item.runeword_name = '';
            item.runeword_attributes = [];
        }
        // Enforce personalization validity, and coherence between personalized_name & personalized
        if (item.personalized_name && item.personalized_name.length) {
            // Check it is valid
            const valid = utils_1.nameRegex.test(item.personalized_name);
            if (!valid) {
                item.personalized_name = '';
                item.personalized = false;
            }
            else {
                item.personalized = true;
            }
        }
        else {
            item.personalized = false;
        }
        // Multiple_pictures: ensure coherence with base item type
        if (itemTypeDef.ig && itemTypeDef.ig.length && !item.multiple_pictures) {
            // Activate multiple pictures
            item.multiple_pictures = true;
            item.picture_id = 0;
        }
        else if (!itemTypeDef.ig && item.multiple_pictures) {
            item.multiple_pictures = false; // Type changed to a not-multiple pictures one
            item.picture_id = 0;
        }
        // Set inv_file, hd_inv_file & transform_color
        if (item.multiple_pictures && itemTypeDef.ig && itemTypeDef.ig.length && itemTypeDef.ig[item.picture_id]) {
            item.inv_file = itemTypeDef.ig[item.picture_id];
        }
        if (item.multiple_pictures && itemTypeDef.hdig && itemTypeDef.hdig.length && itemTypeDef.hdig[item.picture_id]) {
            item.hd_inv_file = itemTypeDef.hdig[item.picture_id];
        }
        if (item.magic_prefix || item.magic_suffix) {
            if (item.magic_prefix && constants.magic_prefixes[item.magic_prefix]?.tc) {
                item.transform_color = constants.magic_prefixes[item.magic_prefix].tc;
            }
            if (item.magic_suffix && constants.magic_suffixes[item.magic_suffix]?.tc) {
                item.transform_color = constants.magic_suffixes[item.magic_suffix].tc;
            }
        }
        else if (item.quality == types_1.EQuality.Rare && item.magical_name_ids) {
            for (let i = 0; i < 6; i++) {
                const id = item.magical_name_ids[i];
                if (id) {
                    if (i % 2 == 0 && constants.magic_prefixes[id] && constants.magic_prefixes[id]?.tc) {
                        // even is prefixes
                        item.transform_color = constants.magic_prefixes[id].tc;
                    }
                    else if (constants.magic_suffixes[id] && constants.magic_suffixes[id]?.tc) {
                        // odd is suffixes
                        item.transform_color = constants.magic_suffixes[id].tc;
                    }
                }
            }
        }
        else if (item.unique_id) {
            const unq = constants.unq_items[item.unique_id];
            if (itemTypeDef.ui) {
                item.inv_file = itemTypeDef.ui;
            }
            if (unq) {
                if ([itemTypeDef.nc, itemTypeDef.exc, itemTypeDef.elc].includes(unq.c)) {
                    // We exclude cases where base have been completely changed (ex: Tempering in ReMoDDeD)
                    if (unq.i) {
                        item.inv_file = unq.i;
                    }
                    if (unq.hdi) {
                        item.hd_inv_file = unq.hdi;
                    }
                }
                if (unq.tc)
                    item.transform_color = unq.tc;
            }
        }
        else if (item.set_id) {
            const set = constants.set_items[item.set_id];
            if (itemTypeDef.ui) {
                item.inv_file = itemTypeDef.ui;
            }
            if (set) {
                if ([itemTypeDef.nc, itemTypeDef.exc, itemTypeDef.elc].includes(set.c)) {
                    // We exclude cases where base have been completely changed (ex: Tempering in ReMoDDeD)
                    if (set.i) {
                        item.inv_file = set.i;
                    }
                    if (set.hdi) {
                        item.hd_inv_file = set.hdi;
                    }
                }
                if (set.tc)
                    item.transform_color = set.tc;
            }
        }
    }
    // Set read-only attributes useful for display in hero editors
    if (item.magic_attributes || item.runeword_attributes || item.socketed_items) {
        // Just the intrinsec attributes
        item.displayed_magic_attributes = _enhanceAttributeDescription(item.magic_attributes, constants, attributes, config);
        // Just the runeword attributes
        item.displayed_runeword_attributes = _enhanceAttributeDescription(item.runeword_attributes, constants, attributes, config);
        // Just the socketed attributes
        item.socketed_attributes = _groupAttributes(_socketedAttributes(item /*, constants*/), constants);
        item.displayed_socketed_attributes = _enhanceAttributeDescription(item.socketed_attributes, constants, attributes, config);
        // All attributes together
        item.combined_magic_attributes = _groupAttributes(_allAttributes(item /*, constants*/), constants);
        item.displayed_combined_magic_attributes = _enhanceAttributeDescription(item.combined_magic_attributes, constants, attributes, config);
    }
}
exports.enhanceItem = enhanceItem;
function _enhanceAttributeDescription(_magic_attributes, constants, attributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
}, config) {
    if (!_magic_attributes)
        return [];
    // Check values that group together
    const magic_attributes = (0, lodash_1.cloneDeep)(_magic_attributes);
    magic_attributes.sort((a, b) => a.id - b.id); // Sort by id in case of consecutive props (np>0)
    // -------------------------------
    // First pass: check groups and operand attributes
    const groups = [];
    for (const magical_attribute of magic_attributes) {
        const itemStatDef = constants.magical_properties[magical_attribute.id];
        // It only concerns attributes with 1 value
        if (magical_attribute.values.length == 1 && itemStatDef.dg) {
            const value = magical_attribute.values[0];
            // First check groups
            if (itemStatDef.dg) {
                if (!groups[itemStatDef.dg]) {
                    groups[itemStatDef.dg] = {
                        value: value, // Save the value of the 1st occurence (to compare with others)
                        currCount: 1,
                        fullSize: constants.magical_properties.filter((prop) => prop && prop.dg && prop.dg == itemStatDef.dg).length, // Only group when all attrs are here (ex: all 4 elemental resistances)
                    };
                }
                else if (groups[itemStatDef.dg].value === value) {
                    // Increment count only if values are identical
                    groups[itemStatDef.dg].currCount++;
                }
            }
            // Second check operands
            if (itemStatDef.ob && itemStatDef.ob in attributes) {
                switch (itemStatDef.o) {
                    case 1: {
                        magical_attribute.op_value = Math.floor((attributes[itemStatDef.ob] * value) / 100);
                        break;
                    }
                    case 2:
                    case 3:
                    case 4:
                    case 5: {
                        magical_attribute.op_value = Math.floor((attributes[itemStatDef.ob] * value) / 2 ** (itemStatDef.op || 0));
                        break;
                    }
                    default: {
                        magical_attribute.op_value = value;
                        break;
                    }
                }
                magical_attribute.op_stats = itemStatDef.os;
            }
        }
    }
    // -------------------------------
    // Second pass: prepare the description
    for (let i = 0; i < magic_attributes.length; i++) {
        const magical_attribute = magic_attributes[i];
        const itemStatDef = constants.magical_properties[magical_attribute.id];
        if (itemStatDef.np) {
            // Case 1: multiple consecutive attributes are merged into one (damage range or enhanced damage)
            let count = 0;
            let descString = itemStatDef.dR || 'Missing description';
            if (itemStatDef.s === 'coldmindam') {
                const seconds = Math.round(magical_attribute.values[2] / 25);
                magical_attribute.values[2] = seconds;
            }
            if (itemStatDef.s === 'poisonmindam') {
                //poisonmindam see https://user.xmission.com/~trevin/DiabloIIv1.09_Magic_Properties.shtml for reference
                const min = Math.round((magical_attribute.values[0] * magical_attribute.values[2]) / 256);
                const max = Math.round((magical_attribute.values[1] * magical_attribute.values[2]) / 256);
                const seconds = Math.round(magical_attribute.values[2] / 25);
                magical_attribute.values = [min, max, seconds];
            }
            if (magical_attribute.values[0] === magical_attribute.values[1]) {
                count++;
                descString = itemStatDef.dE || 'Missing description';
                //TODO. why???
                if (itemStatDef.s === 'item_maxdamage_percent') {
                    descString = `+%d% ${descString.replace(/}/gi, '').replace(/%\+?d%%/gi, '')}`;
                }
            }
            descString ||= 'Missing description'; // To avoid crashs
            if (magical_attribute.condition)
                descString = `[${magical_attribute.condition}] ${descString}`;
            magical_attribute.description = descString.replace(/%\+?d/gi, () => {
                const v = magical_attribute.values[count++];
                return v.toString();
            });
            // Skip next "np" properties
            i += itemStatDef.np;
        }
        else {
            // Case 2: not part of a range of consecutive attributes
            let descFunc = itemStatDef.dF;
            let descString = itemStatDef.dP || 'Missing description'; // To avoid crashs;
            let descVal = itemStatDef.dV || 0;
            let desc2 = itemStatDef.d2 || '';
            const mainValue = magical_attribute.values[magical_attribute.values.length - 1];
            // Is it a group ? Is the group complete ?
            if (magical_attribute.values.length == 1 && itemStatDef.dg && groups[itemStatDef.dg].currCount == groups[itemStatDef.dg].fullSize) {
                // Case 2a: attribute will be grouped with others
                if (mainValue >= 0) {
                    if (itemStatDef.dgP) {
                        descString = itemStatDef.dgP;
                    }
                    else if (itemStatDef.dgN) {
                        // Fallback
                        descString = itemStatDef.dgN;
                    }
                }
                else if (mainValue < 0) {
                    if (itemStatDef.dgN) {
                        descString = itemStatDef.dgN;
                    }
                    else if (itemStatDef.dgP) {
                        // Fallback
                        descString = itemStatDef.dgP;
                    }
                }
                descVal = itemStatDef.dgV || descVal;
                descFunc = itemStatDef.dgF || descFunc;
                desc2 = itemStatDef.dg2 || desc2;
            }
            else {
                // Case 2b: attribute is standalone
                if (mainValue >= 0) {
                    if (itemStatDef.dP) {
                        descString = itemStatDef.dP;
                    }
                    else if (itemStatDef.dN) {
                        // Fallback
                        descString = itemStatDef.dN;
                    }
                }
                else if (mainValue < 0) {
                    if (itemStatDef.dN) {
                        descString = itemStatDef.dN;
                    }
                    else if (itemStatDef.dP) {
                        // Fallback
                        descString = itemStatDef.dP;
                    }
                }
            }
            if (magical_attribute.condition)
                descString = `[${magical_attribute.condition}] ${descString}`;
            _descFunc(magical_attribute, constants, descFunc, descVal, descString, desc2);
        }
    }
    // -------------------------------
    // Do we sort ?
    if (config?.sortProperties) {
        //sort using sort order from game.
        magic_attributes.sort((a, b) => constants.magical_properties[b.id].so - constants.magical_properties[a.id].so);
    }
    // -------------------------------
    // Hide multiple attributes with same description
    for (let i = magic_attributes.length - 1; i >= 1; i--) {
        for (let j = i - 1; j >= 0; j--) {
            if (magic_attributes[i].description === magic_attributes[j].description) {
                magic_attributes[j].visible = false;
            }
        }
    }
    return magic_attributes;
}
function _gemModsToAttributes(mods, constants) {
    const magic_attributes = [];
    for (const mod of mods) {
        const properties = constants.properties[mod.m] || [];
        // Some properties are made of a few consecutive properties (ex min/max ED%, coldmin/max/length)
        for (let propertyCount = 0; propertyCount < properties.length; propertyCount++) {
            const propertyDef = properties[propertyCount];
            let stat = propertyDef.s;
            switch (propertyDef.f) {
                case 5: {
                    stat = 'mindamage';
                    break;
                }
                case 6: {
                    stat = 'maxdamage';
                    break;
                }
                case 7: {
                    stat = 'item_maxdamage_percent';
                    break;
                }
                case 20: {
                    stat = 'item_indesctructible';
                    break;
                }
                default: {
                    break;
                }
            }
            const id = _itemStatFromName(stat, constants);
            // const itemStatDef = constants.magical_properties[id];
            if (propertyDef.np)
                propertyCount += propertyDef.np;
            const numVal = (0, utils_1.numValues)(id, constants.magical_properties);
            let v = [mod.min, mod.max, mod.p || 0].slice(0, numVal);
            if (mod.min == mod.max && numVal == 1) {
                v = [mod.min]; // Ex: +1 allsk
            }
            else {
                v = [mod.min, mod.max];
            }
            if (mod.p) {
                v.push(mod.p);
            }
            magic_attributes.push({
                id: id,
                values: v,
                name: propertyDef.s,
            });
        }
    }
    return magic_attributes;
}
function _descFunc(attribute, constants, descFunc, descVal, descString, desc2) {
    if (!descFunc) {
        return;
    }
    const mainValue = attribute.values[attribute.values.length - 1];
    const sign = mainValue >= 0 ? '+' : '';
    let value = null;
    switch (descFunc) {
        case 1:
        // +[value] [string1]
        case 6:
        // +[value] [string1] [string2]
        case 12: {
            // +[value] [string1]
            value = `${sign}${mainValue}`;
            break;
        }
        case 2:
        // [value]% [string1]
        case 7: {
            // [value]% [string1] [string2]
            value = `${mainValue}%`;
            break;
        }
        case 3:
        // [value] [string1]
        case 9: {
            // [value] [string1] [string2]
            value = `${mainValue}`;
            break;
        }
        case 4:
        // +[value]% [string1]
        case 8: {
            // +[value]% [string1] [string2]
            value = `${sign}${mainValue}%`;
            break;
        }
        case 5:
        // [value*100/128]% [string1]
        case 10: {
            // [value*100/128]% [string1] [string2]
            if (descString.indexOf('%%') < 0) {
                value = `${(mainValue * 100) / 128}%`;
            }
            else {
                value = (mainValue * 100) / 128;
            }
            break;
        }
        case 11: {
            // Repairs 1 Durability In [100 / value] Seconds
            attribute.description = descString.replace(/%d/, (mainValue / 100).toString());
            break;
        }
        case 13: {
            // +[value] to [class] Skill Levels
            const clazz = constants.classes[attribute.values[0]];
            attribute.description = `${sign}${mainValue} ${clazz.as}`;
            break;
        }
        case 14: {
            // +[value] to [skilltab] Skill Levels ([class] Only)
            const clazz = constants.classes[attribute.values[1]];
            const skillTabStr = clazz.ts[attribute.values[0]];
            descString = _sprintf(skillTabStr, mainValue);
            attribute.description = `${descString} ${clazz.co}`;
            break;
        }
        case 15: {
            // [chance]% to cast [slvl] [skill] on [event]
            const skillId = attribute.values[1] || -1;
            const skill = constants.skills[skillId];
            let skillStr = '';
            if (skill) {
                skillStr = skill.s;
                if (skillId > 5 && !skill.c)
                    skillStr += ' (item)';
            }
            else {
                skillStr = `Unknown_Skill_${skillId}`;
            }
            descString = _sprintf(descString, attribute.values[2], attribute.values[0], skillStr);
            attribute.description = `${descString}`;
            break;
        }
        case 16: {
            // Level [sLvl] [skill] Aura When Equipped
            const skillId = attribute.values[0] || -1;
            const skill = constants.skills[skillId];
            let skillStr = '';
            if (skill) {
                skillStr = skill.s;
                if (skillId > 5 && !skill.c)
                    skillStr += ' (item)';
            }
            else {
                skillStr = `Unknown_Skill_${skillId}`;
            }
            attribute.description = descString.replace(/%d/, mainValue.toString());
            attribute.description = attribute.description.replace(/%s/, skillStr);
            break;
        }
        case 17: {
            // [value] [string1] (Increases near [time])
            attribute.description = `${mainValue} ${descString} (Increases near [time])`;
            break;
        }
        case 18: {
            // [value]% [string1] (Increases near [time])
            attribute.description = `${mainValue}% ${descString} (Increases near [time])`;
            break;
        }
        case 19: {
            // [value * -1]% [string1]
            attribute.description = _sprintf(descString, mainValue.toString());
            break;
        }
        case 20: {
            // [value * -1]% [string1]
            value = `${mainValue * -1}%`;
            break;
        }
        case 21: {
            // [value * -1] [string1]
            value = `${mainValue * -1}`;
            break;
        }
        case 22: {
            // [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
            attribute.description = `${mainValue}% ${descString} [montype]`;
            break;
        }
        case 23: {
            // [value]% [string1] [monster]
            attribute.description = `${mainValue}% ${descString} [monster]]`;
            break;
        }
        case 24: {
            // Level [lvl] [skill] ([curr]/[max] charges)
            const skillLevel = attribute.values[0] || 0;
            const skillId = attribute.values[1] || -1;
            const curCharges = attribute.values[2] || 0;
            const maxCharges = attribute.values[3] || 0;
            const skill = constants.skills[skillId];
            let skillStr = '';
            if (skill) {
                skillStr = skill.s;
                if (skillId > 5 && !skill.c)
                    skillStr += ' (item)';
            }
            else {
                skillStr = `Unknown_Skill_${skillId}`;
            }
            attribute.description = _sprintf(descString, skillLevel, skillStr, curCharges, maxCharges);
            break;
        }
        case 27: {
            // +[value] to [skill] ([class] Only)
            const skillId = attribute.values[0] || -1;
            const skill = constants.skills[skillId];
            let skillStr = '';
            let clazzStr = '';
            if (skill) {
                skillStr = skill.s;
                if (skillId > 5 && !skill.c)
                    skillStr += ' (item)';
                const clazz = _classFromCode(skill.c, constants);
                clazzStr = clazz ? clazz.co : '(Unknown_Class)';
            }
            else {
                skillStr = `Unknown_Skill_${skillId}`;
            }
            if (descString) {
                attribute.description = _sprintf(descString, mainValue, skillStr, clazzStr);
            }
            else {
                attribute.description = `${sign}${mainValue} to ${skillStr} ${clazzStr}`;
            }
            break;
        }
        case 28: {
            // +[value] to [skill]
            const skillId = attribute.values[0] || -1;
            const skill = constants.skills[skillId];
            let skillStr = '';
            if (skill) {
                skillStr = skill.s;
                if (skillId > 5 && !skill.c)
                    skillStr += ' (item)';
            }
            else {
                skillStr = `Unknown_Skill_${skillId}`;
            }
            attribute.description = `${sign}${mainValue} to ${skillStr}`;
            break;
        }
        case 29: {
            // Diablo regex
            attribute.description = _sprintf(descString, mainValue.toString());
            break;
        }
        default: {
            throw new Error(`No handler for descFunc: ${descFunc}`);
        }
    }
    if (value) {
        descVal = descVal ? descVal : 0;
        switch (descVal) {
            case 0: {
                attribute.description = _sprintf(descString, value);
                break;
            }
            case 1: {
                attribute.description = `${value} ${descString}`;
                break;
            }
            case 2: {
                attribute.description = `${descString} ${value}`;
                break;
            }
            default: {
                throw new Error(`No handler for descVal: ${descVal}`);
            }
        }
    }
    if (desc2) {
        attribute.description += ` ${desc2}`;
    }
}
function _sprintf(str, ...args) {
    let i = 0;
    return str
        .replace(/%\+?d|%\+?s/gi, (m) => {
        let v = args[i++].toString();
        if (m.indexOf('+') >= 0) {
            v = '+' + v;
        }
        return v;
    })
        .replace('%%', '%');
}
function _itemStatFromName(stat, constants) {
    return constants.magical_properties.findIndex((e) => e && e.s === stat);
}
function _classFromCode(code, constants) {
    return constants.classes.filter((e) => e.c === code)[0];
}
function _socketedAttributes(item /*, constants: types.IConstantData*/) {
    let socketed_attributes = [];
    if (item.socketed_items) {
        for (const i of item.socketed_items) {
            if (i.magic_attributes) {
                socketed_attributes = socketed_attributes.concat((0, lodash_1.cloneDeep)(i.magic_attributes));
            }
        }
    }
    return socketed_attributes;
}
function _allAttributes(item /*, constants: types.IConstantData*/) {
    const socketed_attributes = _socketedAttributes(item /*, constants*/);
    const magic_attributes = item.magic_attributes || [];
    //const set_attributes = item.set_attributes || [];
    const runeword_attributes = item.runeword_attributes || [];
    return [
        ...(0, lodash_1.cloneDeep)(magic_attributes),
        //...cloneDeep(JSON.stringify(set_attributes),
        ...(0, lodash_1.cloneDeep)(runeword_attributes),
        ...(0, lodash_1.cloneDeep)(socketed_attributes),
    ].filter((attribute) => attribute != null);
}
function _groupAttributes(all_magical_attributes, constants) {
    const combined_magical_attributes = [];
    for (const magical_attribute of all_magical_attributes) {
        const itemStatDef = constants.magical_properties[magical_attribute.id];
        // Check in already treated attributes if there is one we can combine with
        const combined_magical_attribute = combined_magical_attributes.find((attr) => {
            // Id must be the same
            if (attr.id !== magical_attribute.id)
                return false;
            if (attr.condition != magical_attribute.condition)
                return false;
            if (itemStatDef.sP) {
                // Param(s) & Value(s)
                if (itemStatDef.e === 2 || itemStatDef.e === 3 || itemStatDef.dF === 14) {
                    // e2 - "%d%% Chance to cast level %d [Skill] on [...]": to combine, skill id and level must be the same. Values = [level, skillId, chances%]
                    // e3 - "Level %d [Skill] (%d/%d Charges)": to combine, skill id and level must be the same. Values = [level, skillId, currentCharges, maxCharges]
                    // dF14 - "%+d to [Tab] Skill Levels ([Class] only)": to combine, tab & class must be the same. Values = [tabId, classId, bonusPts]
                    if (attr.values[0] !== magical_attribute.values[0])
                        return false;
                    if (attr.values[1] !== magical_attribute.values[1])
                        return false;
                }
                else if (itemStatDef.s === 'state') {
                    // Identical states are merged, different ones are not combined
                    if (!(0, lodash_1.isEqual)(attr.values, magical_attribute.values))
                        return false;
                }
                else {
                    /*if (propertyDef.e === 1 || [13, 16, 19, 22, 23].includes(propertyDef.dF))*/
                    // There is 1 Param and 1 Value, generaly to combine Value must be the same
                    // e1   - "%+d to [Skill]": to combine, skill must be the same. Values = [skillId, bonusPts]
                    // dF13 - "%+d to [Amazon] Skills": to combine, tab must be the same. Values = [classId, bonusPts]
                    // dF16 - "Level %d [Skill] Aura When Equipped": to combine, skill must be the same. Values = [SkillId, auraLevel]
                    // dF19 - "%+d to [Elemental] Skills": to combine, element must be the same. Values = [elementId, bonusPts]
                    // dF22 - "%d%% to Attack Rating versus"/"%d%% to Dage versus": to combine, monster must be the same. Values = [monsterTypeId, bonus%]
                    // dF23 - "%0%% Reanimate as: %1": to combine, skill must be the same. Values = [monsterTypeId, chances%]
                    // dF27 - "%+d to [Skill] ([Class] only)". Values = [skillId, bonusPts]
                    // dF28 - "%+d to [Skill]". Values = [skillId, bonusPts]
                    if (attr.values[0] !== magical_attribute.values[0])
                        return false;
                }
            }
            // Just value
            return true;
        });
        if (combined_magical_attribute) {
            // Let's merge into the already treated attribute
            if (itemStatDef.np) {
                //+ Damage props. Values = [Min, Max, (Length)]
                // Sum for Min & Max, Max for Length
                combined_magical_attribute.values[0] += magical_attribute.values[0];
                combined_magical_attribute.values[1] += magical_attribute.values[1];
                if (combined_magical_attribute.values[2] && magical_attribute.values[2]) {
                    combined_magical_attribute.values[2] = Math.max(combined_magical_attribute.values[2], magical_attribute.values[2]);
                }
            }
            else if (itemStatDef.sP) {
                // Param(s) & Value(s)
                if (itemStatDef.e === 2 || itemStatDef.dF === 14) {
                    // e2 - "%d%% Chance to cast level %d [Skill] on [...]": sum chances%. Values = [level, skillId, chances%]
                    // dF14 - "%+d to [Tab] Skill Levels ([Class] only)": sum bonus pts. Values = [tabId, classId, bonusPts]
                    combined_magical_attribute.values[2] += magical_attribute.values[2];
                }
                else if (itemStatDef.e === 3) {
                    // e3 - "Level %d [Skill] (%d/%d Charges)": sum current & max charges. Values = [level, skillId, currentCharges, maxCharges]
                    combined_magical_attribute.values[2] += magical_attribute.values[2];
                    combined_magical_attribute.values[3] += magical_attribute.values[3];
                }
                else if (itemStatDef.s === 'state') {
                    // Identical states are combined with no change
                }
                else {
                    /*if (propertyDef.e === 1 || [13, 16, 19, 22, 23].includes(propertyDef.dF))*/
                    // There is 1 Param and 1 Value, generaly we sum Params
                    // e1   - "%+d to [Skill]": to combine, skill must be the same. Values = [skillId, bonusPts]
                    // dF13 - "%+d to [Amazon] Skills": to combine, tab must be the same. Values = [classId, bonusPts]
                    // dF16 - "Level %d [Skill] Aura When Equipped": to combine, skill must be the same. Values = [SkillId, auraLevel]
                    // dF19 - "%+d to [Elemental] Skills": to combine, element must be the same. Values = [elementId, bonusPts]
                    // dF22 - "%d%% to Attack Rating versus"/"%d%% to Dage versus": to combine, monster must be the same. Values = [monsterTypeId, bonus%]
                    // dF23 - "%0%% Reanimate as: %1": to combine, skill must be the same. Values = [monsterTypeId, chances%]
                    // dF27 - "%+d to [Skill] ([Class] only)". Values = [skillId, bonusPts]
                    // dF28 - "%+d to [Skill]". Values = [skillId, bonusPts]
                    combined_magical_attribute.values[1] += magical_attribute.values[1];
                }
            }
            else {
                // Just 1 Value: sum it
                combined_magical_attribute.values[0] += magical_attribute.values[0];
            }
        }
        else {
            combined_magical_attributes.push({
                id: magical_attribute.id,
                values: magical_attribute.values,
                name: magical_attribute.name,
                condition: magical_attribute.condition,
            });
        }
    }
    return combined_magical_attributes;
}
