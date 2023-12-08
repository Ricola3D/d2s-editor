var d2s =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/d2/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/binary/bitreader.ts":
/*!*********************************!*\
  !*** ./src/binary/bitreader.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BitReader = void 0;
var BitReader = /** @class */ (function () {
    function BitReader(arrBuffer) {
        var _this = this;
        this.littleEndian = true;
        this.offset = 0;
        var typedArray = new Uint8Array(arrBuffer);
        this.bits = new Uint8Array(typedArray.length * 8);
        typedArray.reduce(function (acc, c) {
            var b = c
                .toString(2)
                .padStart(8, "0")
                .split("")
                .reverse()
                .map(function (e) { return parseInt(e, 2); });
            b.forEach(function (bit) { return (_this.bits[acc++] = bit); });
            return acc;
        }, 0);
    }
    BitReader.prototype.ReadBit = function () {
        return this.bits[this.offset++];
    };
    BitReader.prototype.ReadBitArray = function (count) {
        var bits = new Uint8Array(count);
        for (var i = 0; i < count; i++) {
            bits[i] = this.bits[this.offset++];
        }
        return bits;
    };
    BitReader.prototype.ReadBits = function (bytes, count) {
        var byteIndex = 0;
        var bitIndex = 0;
        for (var i = 0; i < count; i++) {
            if (this.bits[this.offset + i]) {
                bytes[byteIndex] |= (1 << bitIndex) & 0xff;
            }
            bitIndex++;
            if (bitIndex == 8) {
                byteIndex++;
                bitIndex = 0;
            }
        }
        this.offset += count;
        return bytes;
    };
    BitReader.prototype.ReadBytes = function (bytes) {
        return this.ReadBits(new Uint8Array(bytes), bytes * 8);
    };
    BitReader.prototype.ReadArray = function (bytes) {
        return this.ReadBytes(bytes);
    };
    BitReader.prototype.ReadByte = function (bits) {
        if (bits === void 0) { bits = 8; }
        var dataview = new DataView(this.ReadBits(new Uint8Array(1), bits).buffer);
        return dataview.getUint8(0);
    };
    BitReader.prototype.ReadUInt8 = function (bits) {
        if (bits === void 0) { bits = 8; }
        return this.ReadByte(bits);
    };
    BitReader.prototype.ReadUInt16 = function (bits) {
        if (bits === void 0) { bits = 8 * 2; }
        var dataview = new DataView(this.ReadBits(new Uint8Array(2), bits).buffer);
        return dataview.getUint16(0, this.littleEndian);
    };
    BitReader.prototype.ReadUInt32 = function (bits) {
        if (bits === void 0) { bits = 8 * 4; }
        var dataview = new DataView(this.ReadBits(new Uint8Array(4), bits).buffer);
        return dataview.getUint32(0, this.littleEndian);
    };
    BitReader.prototype.ReadString = function (bytes) {
        var buffer = this.ReadBytes(bytes).buffer;
        return new TextDecoder().decode(buffer);
    };
    BitReader.prototype.ReadNullTerminatedString = function () {
        var start = this.offset;
        while (this.ReadByte()) { }
        var end = this.offset - 8;
        var buffer = this.SeekBit(start).ReadBytes((end - start) / 8);
        this.SeekBit(end + 8);
        return new TextDecoder().decode(buffer);
    };
    BitReader.prototype.SkipBits = function (number) {
        this.offset += number;
        return this;
    };
    BitReader.prototype.SkipBytes = function (number) {
        return this.SkipBits(number * 8);
    };
    BitReader.prototype.SeekBit = function (offset) {
        this.offset = offset;
        return this;
    };
    BitReader.prototype.SeekByte = function (offset) {
        return this.SeekBit(offset * 8);
    };
    BitReader.prototype.Align = function () {
        this.offset = (this.offset + 7) & ~7;
        return this;
    };
    return BitReader;
}());
exports.BitReader = BitReader;


/***/ }),

/***/ "./src/binary/bitwriter.ts":
/*!*********************************!*\
  !*** ./src/binary/bitwriter.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BitWriter = void 0;
var BitWriter = /** @class */ (function () {
    function BitWriter(capacity) {
        if (capacity === void 0) { capacity = 8192; }
        this.littleEndian = true;
        this.offset = 0;
        this.length = 0;
        this.bits = new Uint8Array(capacity);
    }
    BitWriter.prototype.WriteBit = function (value) {
        if (this.offset >= this.bits.length) {
            var resized = new Uint8Array(this.bits.length + 8192);
            resized.set(this.bits, 0);
            this.bits = resized;
        }
        this.bits[this.offset++] = value;
        if (this.offset > this.length)
            this.length++;
        return this;
    };
    BitWriter.prototype.WriteBits = function (bits, numberOfBits) {
        for (var i = 0; i < numberOfBits; i++) {
            this.WriteBit(bits[i]);
        }
        return this;
    };
    BitWriter.prototype.WriteBytes = function (bytes, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = bytes.length * 8; }
        var toWrite = new Uint8Array(numberOfBits);
        bytes.reduce(function (acc, c) {
            var b = c
                .toString(2)
                .padStart(8, "0")
                .split("")
                .reverse()
                .map(function (e) { return parseInt(e, 2); });
            b.forEach(function (bit) { return (toWrite[acc++] = bit); });
            return acc;
        }, 0);
        return this.WriteBits(toWrite, numberOfBits);
    };
    BitWriter.prototype.WriteArray = function (bytes, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = bytes.length * 8; }
        return this.WriteBytes(bytes, numberOfBits);
    };
    BitWriter.prototype.WriteByte = function (value, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = 8; }
        var buffer = new Uint8Array(1);
        new DataView(buffer.buffer).setUint8(0, value);
        return this.WriteBytes(buffer, numberOfBits);
    };
    BitWriter.prototype.WriteUInt8 = function (value, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = 8; }
        return this.WriteByte(value, numberOfBits);
    };
    BitWriter.prototype.WriteUInt16 = function (value, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = 8 * 2; }
        var buffer = new Uint8Array(2);
        new DataView(buffer.buffer).setUint16(0, value, this.littleEndian);
        return this.WriteBytes(buffer, numberOfBits);
    };
    BitWriter.prototype.WriteUInt32 = function (value, numberOfBits) {
        if (numberOfBits === void 0) { numberOfBits = 8 * 4; }
        var buffer = new Uint8Array(4);
        new DataView(buffer.buffer).setUint32(0, value, this.littleEndian);
        return this.WriteBytes(buffer, numberOfBits);
    };
    BitWriter.prototype.WriteString = function (value, numberOfBytes) {
        var buffer = new TextEncoder().encode(value);
        return this.WriteBytes(buffer, numberOfBytes * 8);
    };
    BitWriter.prototype.SeekBit = function (offset) {
        this.offset = offset;
        if (this.offset > this.length) {
            this.length = this.offset;
        }
        return this;
    };
    BitWriter.prototype.SeekByte = function (offset) {
        return this.SeekBit(offset * 8);
    };
    BitWriter.prototype.PeekBytes = function (count) {
        var buffer = new Uint8Array(count);
        var byteIndex = 0;
        var bitIndex = 0;
        for (var i = 0; i < count * 8; ++i) {
            if (this.bits[this.offset + i]) {
                buffer[byteIndex] |= (1 << bitIndex) & 0xff;
            }
            ++bitIndex;
            if (bitIndex >= 8) {
                ++byteIndex;
                bitIndex = 0;
            }
        }
        return buffer;
    };
    BitWriter.prototype.Align = function () {
        this.offset = (this.offset + 7) & ~7;
        if (this.offset > this.length) {
            this.length = this.offset;
        }
        return this;
    };
    BitWriter.prototype.ToArray = function () {
        var buffer = new Uint8Array((this.length - 1) / 8 + 1);
        var byteIndex = 0;
        var bitIndex = 0;
        for (var i = 0; i < this.length; ++i) {
            if (this.bits[i]) {
                buffer[byteIndex] |= (1 << bitIndex) & 0xff;
            }
            ++bitIndex;
            if (bitIndex >= 8) {
                ++byteIndex;
                bitIndex = 0;
            }
        }
        return buffer;
    };
    return BitWriter;
}());
exports.BitWriter = BitWriter;


/***/ }),

/***/ "./src/d2/attribute_enhancer.ts":
/*!**************************************!*\
  !*** ./src/d2/attribute_enhancer.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceItem = exports.enhanceItems = exports.enhancePlayerAttributes = exports.enhanceAttributes = void 0;
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Armor"] = 1] = "Armor";
    ItemType[ItemType["Shield"] = 2] = "Shield";
    ItemType[ItemType["Weapon"] = 3] = "Weapon";
    ItemType[ItemType["Other"] = 4] = "Other";
})(ItemType || (ItemType = {}));
//do nice stuff
//combine group properties (all resists/all stats) and build friendly strings for a ui
//enhanced def/durability/weapon damage.
//lookup socketed compact items (runes/gems) properties for the slot they are in
//compute attributes like str/resists/etc..
function enhanceAttributes(char, mod, version, config) {
    enhanceItems(char.items, mod, version, char.attributes.level, config);
    enhanceItems([char.golem_item], mod, version, char.attributes.level, config);
    enhanceItems(char.merc_items, mod, version, char.attributes.level, config);
    enhanceItems(char.corpse_items, mod, version, char.attributes.level, config);
    enhancePlayerAttributes(char, mod, version, config);
}
exports.enhanceAttributes = enhanceAttributes;
function enhancePlayerAttributes(char, mod, version, config) {
    var constants = constants_1.getConstantData(mod, version);
    var items = char.items.filter(function (item) {
        return item.location_id === 1 && item.equipped_id !== 13 && item.equipped_id !== 14;
    });
    char.item_bonuses = [].concat
        .apply([], items.map(function (item) { return _allAttributes(item, constants); }))
        .filter(function (attribute) { return attribute != null; });
    char.item_bonuses = _groupAttributes(char.item_bonuses, constants);
    _enhanceAttributeDescription(char.item_bonuses, constants, char.attributes.level, config);
}
exports.enhancePlayerAttributes = enhancePlayerAttributes;
function enhanceItems(items, mod, version, level, config, parent) {
    if (level === void 0) { level = 1; }
    if (!items) {
        return;
    }
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (!item) {
            continue;
        }
        if (item.socketed_items && item.socketed_items.length) {
            enhanceItems(item.socketed_items, mod, version, level, config, item);
        }
        enhanceItem(item, mod, version, level, config, parent);
    }
}
exports.enhanceItems = enhanceItems;
function enhanceItem(item, mod, version, level, config, parent) {
    var _a, _b, _c, _d;
    if (level === void 0) { level = 1; }
    var constants = constants_1.getConstantData(mod, version);
    if (parent) {
        //socket item.
        var pt = constants.armor_items[parent.type] || constants.weapon_items[parent.type] || constants.other_items[parent.type];
        var t = constants.other_items[item.type];
        if (t.m) {
            item.magic_attributes = _compactAttributes(t.m[pt.gt], constants);
        }
    }
    var details = null;
    if (constants.armor_items[item.type]) {
        details = constants.armor_items[item.type];
        item.type_id = ItemType.Armor;
        if (details.maxac) {
            if (item.ethereal == 0) {
                item.defense_rating = details.maxac;
            }
            else if (item.ethereal == 1) {
                item.defense_rating = Math.floor(details.maxac * 1.5);
            }
        }
    }
    else if (constants.weapon_items[item.type]) {
        details = constants.weapon_items[item.type];
        item.type_id = ItemType.Weapon;
        var base_damage = {};
        if (item.ethereal == 0) {
            if (details.mind)
                base_damage.mindam = details.mind;
            if (details.maxd)
                base_damage.maxdam = details.maxd;
            if (details.min2d)
                base_damage.twohandmindam = details.min2d;
            if (details.max2d)
                base_damage.twohandmaxdam = details.max2d;
        }
        else if (item.ethereal == 1) {
            if (details.mind)
                base_damage.mindam = Math.floor(details.mind * 1.5);
            if (details.maxd)
                base_damage.maxdam = Math.floor(details.maxd * 1.5);
            if (details.min2d)
                base_damage.twohandmindam = Math.floor(details.min2d * 1.5);
            if (details.max2d)
                base_damage.twohandmaxdam = Math.floor(details.max2d * 1.5);
        }
        item.base_damage = base_damage;
    }
    else if (constants.other_items[item.type]) {
        item.type_id = ItemType.Other;
        details = constants.other_items[item.type];
    }
    if (details) {
        if (details.n)
            item.type_name = details.n;
        if (details.rs)
            item.reqstr = details.rs;
        if (details.rd)
            item.reqdex = details.rd;
        if (details.i)
            item.inv_file = details.i;
        if (details.hdi)
            item.hd_inv_file = details.hdi;
        if (details.ih)
            item.inv_height = details.ih;
        if (details.iw)
            item.inv_width = details.iw;
        if (details.it)
            item.inv_transform = details.it;
        if (details.iq)
            item.item_quality = details.iq;
        if (details.c)
            item.categories = details.c;
        if (details.durability) {
            if (item.ethereal == 0) {
                item.current_durability = details.durability;
                item.max_durability = details.durability;
            }
            else if (item.ethereal == 1) {
                item.current_durability = details.durability - Math.ceil(details.durability / 2) + 1;
                item.max_durability = details.durability - Math.ceil(details.durability / 2) + 1;
            }
        }
        if (item.multiple_pictures && details.ig && details.ig[item.picture_id]) {
            item.inv_file = details.ig[item.picture_id];
        }
        if (item.magic_prefix || item.magic_suffix) {
            if (item.magic_prefix && ((_a = constants.magic_prefixes[item.magic_prefix]) === null || _a === void 0 ? void 0 : _a.tc)) {
                item.transform_color = constants.magic_prefixes[item.magic_prefix].tc;
            }
            if (item.magic_suffix && ((_b = constants.magic_suffixes[item.magic_suffix]) === null || _b === void 0 ? void 0 : _b.tc)) {
                item.transform_color = constants.magic_suffixes[item.magic_suffix].tc;
            }
        }
        else if (item.magical_name_ids && item.magical_name_ids.length === 6) {
            for (var i = 0; i < 6; i++) {
                var id = item.magical_name_ids[i];
                if (id) {
                    if (i % 2 == 0 && constants.magic_prefixes[id] && ((_c = constants.magic_prefixes[id]) === null || _c === void 0 ? void 0 : _c.tc)) {
                        // even is prefixes
                        item.transform_color = constants.magic_prefixes[id].tc;
                    }
                    else if (constants.magic_suffixes[id] && ((_d = constants.magic_suffixes[id]) === null || _d === void 0 ? void 0 : _d.tc)) {
                        // odd is suffixes
                        item.transform_color = constants.magic_suffixes[id].tc;
                    }
                }
            }
        }
        else if (item.unique_id) {
            var unq = constants.unq_items[item.unique_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (unq && unq.i)
                item.inv_file = unq.i;
            if (unq && unq.hdi)
                item.hd_inv_file = unq.hdi;
            if (unq && unq.tc)
                item.transform_color = unq.tc;
        }
        else if (item.set_id) {
            var set = constants.set_items[item.set_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (set && set.i)
                item.inv_file = set.i;
            if (set && set.hdi)
                item.hd_inv_file = set.hdi;
            if (set && set.tc)
                item.transform_color = set.tc;
        }
    }
    if (item.magic_attributes || item.runeword_attributes || item.socketed_items) {
        item.displayed_magic_attributes = _enhanceAttributeDescription(item.magic_attributes, constants, level, config);
        item.displayed_runeword_attributes = _enhanceAttributeDescription(item.runeword_attributes, constants, level, config);
        item.combined_magic_attributes = _groupAttributes(_allAttributes(item, constants), constants);
        item.displayed_combined_magic_attributes = _enhanceAttributeDescription(item.combined_magic_attributes, constants, level, config);
    }
}
exports.enhanceItem = enhanceItem;
function _enhanceAttributeDescription(_magic_attributes, constants, level, config) {
    if (level === void 0) { level = 1; }
    if (!_magic_attributes)
        return [];
    var magic_attributes = __spreadArrays(_magic_attributes.map(function (attr) { return (__assign({}, attr)); }));
    var dgrps = [0, 0, 0];
    var dgrpsVal = [0, 0, 0];
    for (var _i = 0, magic_attributes_1 = magic_attributes; _i < magic_attributes_1.length; _i++) {
        var property = magic_attributes_1[_i];
        var prop = constants.magical_properties[property.id];
        var v = property.values[property.values.length - 1];
        if (prop.dg) {
            if (dgrpsVal[prop.dg - 1] === 0) {
                dgrpsVal[prop.dg - 1] = v;
            }
            if (dgrpsVal[prop.dg - 1] - v === 0) {
                dgrps[prop.dg - 1]++;
            }
        }
    }
    var _loop_1 = function (property) {
        var prop = constants.magical_properties[property.id];
        if (prop == null) {
            throw new Error("Cannot find Magical Property for id: " + property.id);
        }
        var v = property.values[property.values.length - 1];
        if (prop.ob === "level") {
            switch (prop.o) {
                case 1: {
                    v = Math.floor((level * v) / 100);
                    break;
                }
                case 2:
                case 3:
                case 4:
                case 5: {
                    v = Math.floor((level * v) / Math.pow(2, prop.op));
                    break;
                }
                default: {
                    break;
                }
            }
            property.op_stats = prop.os;
            property.op_value = v;
        }
        var descFunc = prop.dF;
        var descString = void 0;
        if (v >= 0) {
            if (prop.dP) {
                descString = prop.dP;
            }
            else if (prop.dN) {
                // Fallback
                descString = prop.dN;
            }
        }
        else if (v < 0) {
            if (prop.dN) {
                descString = prop.dN;
            }
            else if (prop.dP) {
                // Fallback
                descString = prop.dP;
            }
        }
        else {
            descString = "Missing description";
        }
        //hack for d2r...?
        if (property.id == 39 || property.id == 41 || property.id == 43 || property.id == 45) {
            descString = prop.dP;
        }
        var descVal = prop.dV;
        var desc2 = prop.d2;
        if (prop.dg && dgrps[prop.dg - 1] === 4) {
            v = dgrpsVal[prop.dg - 1];
            descString = v >= 0 ? prop.dgP : prop.dgN ? prop.dgN : prop.dgP;
            descVal = prop.dgV;
            descFunc = prop.dgF;
            desc2 = prop.dg2;
        }
        if (prop.np) {
            //damage range or enhanced damage.
            var count_1 = 0;
            descString = prop.dR;
            if (prop.s === "poisonmindam") {
                //poisonmindam see https://user.xmission.com/~trevin/DiabloIIv1.09_Magic_Properties.shtml for reference
                var min = Math.floor((property.values[0] * property.values[2]) / 256);
                var max = Math.floor((property.values[1] * property.values[2]) / 256);
                var seconds = Math.floor(property.values[2] / 25);
                property.values = [min, max, seconds];
            }
            if (property.values[0] === property.values[1]) {
                count_1++;
                descString = prop.dE;
                //TODO. why???
                if (prop.s === "item_maxdamage_percent") {
                    descString = "+%d% " + descString.replace(/}/gi, "").replace(/%\+?d%%/gi, "");
                }
            }
            property.description = descString.replace(/%d/gi, function () {
                var v = property.values[count_1++];
                return v;
            });
        }
        else {
            _descFunc(property, constants, v, descFunc, descVal, descString, desc2);
        }
    };
    for (var _a = 0, magic_attributes_2 = magic_attributes; _a < magic_attributes_2.length; _a++) {
        var property = magic_attributes_2[_a];
        _loop_1(property);
    }
    if (config === null || config === void 0 ? void 0 : config.sortProperties) {
        //sort using sort order from game.
        magic_attributes.sort(function (a, b) { return constants.magical_properties[b.id].so - constants.magical_properties[a.id].so; });
    }
    for (var i = magic_attributes.length - 1; i >= 1; i--) {
        for (var j = i - 1; j >= 0; j--) {
            if (magic_attributes[i].description === magic_attributes[j].description) {
                magic_attributes[j].visible = false;
            }
        }
    }
    return magic_attributes;
}
function _compactAttributes(mods, constants) {
    var magic_attributes = [];
    for (var _i = 0, mods_1 = mods; _i < mods_1.length; _i++) {
        var mod = mods_1[_i];
        var properties = constants.properties[mod.m] || [];
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            var stat = property.s;
            switch (property.f) {
                case 5: {
                    stat = "mindamage";
                    break;
                }
                case 6: {
                    stat = "maxdamage";
                    break;
                }
                case 7: {
                    stat = "item_maxdamage_percent";
                    break;
                }
                case 20: {
                    stat = "item_indesctructible";
                    break;
                }
                default: {
                    break;
                }
            }
            var id = _itemStatCostFromStat(stat, constants);
            var prop = constants.magical_properties[id];
            if (prop.np)
                i += prop.np;
            var v = [mod.min, mod.max];
            if (mod.p) {
                v.push(mod.p);
            }
            magic_attributes.push({
                id: id,
                values: v,
                name: prop.s,
            });
        }
    }
    return magic_attributes;
}
function _descFunc(property, constants, v, descFunc, descVal, descString, desc2) {
    if (!descFunc) {
        return;
    }
    var sign = v >= 0 ? "+" : "";
    var value = null;
    var desc2Present = descFunc >= 6 && descFunc <= 10;
    switch (descFunc) {
        case 1:
        // +[value] [string1]
        case 6:
        // +[value] [string1] [string2]
        case 12: {
            // +[value] [string1]
            value = "" + sign + v;
            break;
        }
        case 2:
        // [value]% [string1]
        case 7: {
            // [value]% [string1] [string2]
            value = v + "%";
            break;
        }
        case 3:
        // [value] [string1]
        case 9: {
            // [value] [string1] [string2]
            value = "" + v;
            break;
        }
        case 4:
        // +[value]% [string1]
        case 8: {
            // +[value]% [string1] [string2]
            value = "" + sign + v + "%";
            break;
        }
        case 5:
        // [value*100/128]% [string1]
        case 10: {
            // [value*100/128]% [string1] [string2]
            if (descString.indexOf("%%") < 0) {
                value = (v * 100) / 128 + "%";
            }
            else {
                value = (v * 100) / 128;
            }
            break;
        }
        case 11: {
            // Repairs 1 Durability In [100 / value] Seconds
            property.description = descString.replace(/%d/, (v / 100).toString());
            break;
        }
        case 13: {
            // +[value] to [class] Skill Levels
            var clazz = constants.classes[property.values[0]];
            property.description = "" + sign + v + " " + clazz.as;
            break;
        }
        case 14: {
            // +[value] to [skilltab] Skill Levels ([class] Only)
            var clazz = constants.classes[property.values[1]];
            var skillTabStr = clazz.ts[property.values[0]];
            descString = _sprintf(skillTabStr, v);
            property.description = descString + " " + clazz.co;
            break;
        }
        case 15: {
            // [chance]% to case [slvl] [skill] on [event]
            var skillId = property.values[1];
            var skill = constants.skills[skillId];
            var skillStr = skill ? skill.s : "Unknown_Skill_" + skillId;
            descString = _sprintf(descString, property.values[2], property.values[0], skillStr);
            property.description = "" + descString;
            break;
        }
        case 16: {
            // Level [sLvl] [skill] Aura When Equipped
            var skillId = property.values[0];
            var skill = constants.skills[skillId];
            var skillStr = skill ? skill.s : "Unknown_Skill_" + skillId;
            property.description = descString.replace(/%d/, v.toString());
            property.description = property.description.replace(/%s/, skillStr);
            break;
        }
        case 17: {
            // [value] [string1] (Increases near [time])
            property.description = v + " " + descString + " (Increases near [time])";
            break;
        }
        case 18: {
            // [value]% [string1] (Increases near [time])
            property.description = v + "% " + descString + " (Increases near [time])";
            break;
        }
        case 19: {
            // [value * -1]% [string1]
            property.description = _sprintf(descString, v.toString());
            break;
        }
        case 20: {
            // [value * -1]% [string1]
            value = v * -1 + "%";
            break;
        }
        case 21: {
            // [value * -1] [string1]
            value = "" + v * -1;
            break;
        }
        case 22: {
            // [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
            property.description = v + "% " + descString + " [montype]";
            break;
        }
        case 23: {
            // [value]% [string1] [monster]
            property.description = v + "% " + descString + " [monster]]";
            break;
        }
        case 24: {
            // Level [lvl] [skill] ([curr]/[max] charges)
            var skillId = property.values[1];
            var skill = constants.skills[skillId];
            var skillStr = skill ? skill.s : "Unknown_Skill_" + skillId;
            if (descString.indexOf("(") == 0) {
                var count_2 = 0;
                descString = descString.replace(/%d/gi, function () {
                    return property.values[2 + count_2++].toString();
                });
                property.description = "Level " + property.values[0] + " " + skillStr + " " + descString;
            }
            else {
                property.description = _sprintf(descString, property.values[0], skillStr, property.values[2], property.values[3]);
            }
            break;
        }
        case 27: {
            // +[value] to [skill] ([class] Only)
            var skillId = property.values[0];
            var skill = constants.skills[skillId];
            var skillStr = skill ? skill.s : "Unknown_Skill_" + skillId;
            var clazz = _classFromCode(skill.c, constants);
            var clazzStr = clazz ? clazz.co : "";
            if (descString) {
                property.description = _sprintf(descString, v, skillStr, clazzStr);
            }
            else {
                property.description = "" + sign + v + " to " + skillStr + " " + (clazz === null || clazz === void 0 ? void 0 : clazz.co);
            }
            break;
        }
        case 28: {
            // +[value] to [skill]
            var skillId = property.values[0];
            var skill = constants.skills[skillId];
            var skillStr = skill ? skill.s : "Unknown_Skill_" + skillId;
            property.description = "" + sign + v + " to " + skillStr;
            break;
        }
        case 29: {
            // Diablo regex
            property.description = _sprintf(descString, v.toString());
            break;
        }
        default: {
            throw new Error("No handler for descFunc: " + descFunc);
        }
    }
    if (value) {
        descVal = descVal ? descVal : 0;
        switch (descVal) {
            case 0: {
                property.description = _sprintf(descString, value);
                break;
            }
            case 1: {
                property.description = value + " " + descString;
                break;
            }
            case 2: {
                property.description = descString + " " + value;
                break;
            }
            default: {
                throw new Error("No handler for descVal: " + descVal);
            }
        }
    }
    if (desc2Present) {
        property.description += " " + desc2;
    }
}
function _sprintf(str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var i = 0;
    return str
        .replace(/%\+?d|%\+?s/gi, function (m) {
        var v = args[i++].toString();
        if (m.indexOf("+") >= 0) {
            v = "+" + v;
        }
        return v;
    })
        .replace("%%", "%");
}
function _itemStatCostFromStat(stat, constants) {
    return constants.magical_properties.findIndex(function (e) { return e && e.s === stat; });
}
function _classFromCode(code, constants) {
    return constants.classes.filter(function (e) { return e.c === code; })[0];
}
function _allAttributes(item, constants) {
    var socketed_attributes = [];
    if (item.socketed_items) {
        for (var _i = 0, _a = item.socketed_items; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.magic_attributes) {
                socketed_attributes = socketed_attributes.concat.apply(socketed_attributes, JSON.parse(JSON.stringify(i.magic_attributes)));
            }
        }
    }
    var magic_attributes = item.magic_attributes || [];
    var runeword_attributes = item.runeword_attributes || [];
    return __spreadArrays([], JSON.parse(JSON.stringify(magic_attributes)), JSON.parse(JSON.stringify(runeword_attributes)), JSON.parse(JSON.stringify(socketed_attributes))).filter(function (attribute) { return attribute != null; });
}
function _groupAttributes(all_attributes, constants) {
    var combined_magic_attributes = [];
    var _loop_2 = function (magic_attribute) {
        var prop = constants.magical_properties[magic_attribute.id];
        var properties = combined_magic_attributes.filter(function (e) {
            //encoded skills need to look at those params too.
            if (prop.e === 3) {
                return e.id === magic_attribute.id && e.values[0] === magic_attribute.values[0] && e.values[1] === magic_attribute.values[1];
            }
            if (prop.dF === 15) {
                return (e.id === magic_attribute.id &&
                    e.values[0] === magic_attribute.values[0] &&
                    e.values[1] === magic_attribute.values[1] &&
                    e.values[2] === magic_attribute.values[2]);
            }
            if (prop.dF === 16 || prop.dF === 23) {
                return e.id === magic_attribute.id && e.values[0] === magic_attribute.values[0] && e.values[1] === magic_attribute.values[1];
            }
            if (prop.s === "state" || prop.s === "item_nonclassskill") {
                //state
                return e.id === magic_attribute.id && e.values[0] === magic_attribute.values[0] && e.values[1] === magic_attribute.values[1];
            }
            return e.id === magic_attribute.id;
        });
        if (properties && properties.length) {
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                if (prop.np) {
                    //damage props
                    property.values[0] += magic_attribute.values[0];
                    property.values[1] += magic_attribute.values[1];
                    break;
                }
                //only combine attributes if the params for the descFunc are the same.
                var sameParams = true;
                var numValues = prop.e === 3 ? 2 : 1;
                for (var j = 0; j < property.values.length - numValues; j++) {
                    sameParams = property.values[j] === magic_attribute.values[j];
                    if (!sameParams) {
                        break;
                    }
                }
                if (sameParams) {
                    for (var j = 1; j <= numValues; j++) {
                        var idx = property.values.length - j;
                        property.values[idx] += magic_attribute.values[idx];
                    }
                }
                else {
                    combined_magic_attributes.push({
                        id: magic_attribute.id,
                        values: magic_attribute.values,
                        name: magic_attribute.name,
                    });
                }
            }
        }
        else {
            combined_magic_attributes.push({
                id: magic_attribute.id,
                values: magic_attribute.values,
                name: magic_attribute.name,
            });
        }
    };
    for (var _i = 0, all_attributes_1 = all_attributes; _i < all_attributes_1.length; _i++) {
        var magic_attribute = all_attributes_1[_i];
        _loop_2(magic_attribute);
    }
    return combined_magic_attributes;
}


/***/ }),

/***/ "./src/d2/attributes.ts":
/*!******************************!*\
  !*** ./src/d2/attributes.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAttributes = exports.readAttributes = void 0;
var bitwriter_1 = __webpack_require__(/*! ../binary/bitwriter */ "./src/binary/bitwriter.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
//todo use constants.magical_properties and csvBits
function readAttributes(char, reader, mod) {
    var constants = constants_1.getConstantData(mod, char.header.version);
    char.attributes = {
        // For optional values, set default
        unused_stats: 0,
        unused_skill_points: 0,
        experience: 0,
        gold: 0,
        stashed_gold: 0,
        killtrack: 0,
        deathtrack: 0,
        unused210: 0,
        unused211: 0,
    };
    var header = reader.ReadString(2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
    if (header != "gf") {
        // header is not present in first save after char is created
        if (char.header.level === 1) {
            var classData = constants.classes.find(function (c) { return c.n === char.header.class; }).a;
            char.attributes = {
                strength: +classData.str,
                energy: +classData.int,
                dexterity: +classData.dex,
                vitality: +classData.vit,
                unused_stats: 0,
                unused_skill_points: 0,
                current_hp: +classData.vit + +classData.hpadd,
                max_hp: +classData.vit + +classData.hpadd,
                current_mana: +classData.int,
                max_mana: +classData.int,
                current_stamina: +classData.stam,
                max_stamina: +classData.stam,
                level: 1,
                experience: 0,
                gold: 0,
                stashed_gold: 0,
                killtrack: 0,
                deathtrack: 0,
                unused210: 0,
                unused211: 0,
            };
            return;
        }
        throw new Error("Attribute header 'gf' not found at position " + (reader.offset - 2 * 8));
    }
    var bitoffset = 0;
    var id = reader.ReadUInt16(9);
    //read till 0x1ff end of attributes is found
    while (id != 0x1ff) {
        bitoffset += 9;
        var field = constants.magical_properties[id];
        if (field === undefined) {
            throw new Error("Invalid attribute id: " + id);
        }
        var size = field.cB;
        char.attributes[Attributes[field.s]] = reader.ReadUInt32(size);
        //current_hp - max_stamina need to be bit shifted
        if (id >= 6 && id <= 11) {
            char.attributes[Attributes[field.s]] >>>= 8;
        }
        bitoffset += size;
        id = reader.ReadUInt16(9);
    }
    reader.Align();
}
exports.readAttributes = readAttributes;
function writeAttributes(char, constants) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, attributeIds, _i, attributeIds_1, i, property, value, size;
        return __generator(this, function (_a) {
            writer = new bitwriter_1.BitWriter();
            writer.WriteString("gf", 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
            attributeIds = Array.from(Array(16).keys()).concat([210, 211]);
            for (_i = 0, attributeIds_1 = attributeIds; _i < attributeIds_1.length; _i++) {
                i = attributeIds_1[_i];
                property = constants.magical_properties[i];
                if (property === undefined) {
                    throw new Error("Invalid attribute: " + property);
                }
                value = char.attributes[Attributes[property.s]];
                if (!value) {
                    continue;
                }
                size = property.cB;
                if (i >= 6 && i <= 11) {
                    value <<= 8;
                }
                writer.WriteUInt16(i, 9);
                writer.WriteUInt32(value, size);
            }
            writer.WriteUInt16(0x1ff, 9);
            writer.Align();
            return [2 /*return*/, writer.ToArray()];
        });
    });
}
exports.writeAttributes = writeAttributes;
//nokkas names
var Attributes = {
    strength: "strength",
    energy: "energy",
    dexterity: "dexterity",
    vitality: "vitality",
    statpts: "unused_stats",
    newskills: "unused_skill_points",
    hitpoints: "current_hp",
    maxhp: "max_hp",
    mana: "current_mana",
    maxmana: "max_mana",
    stamina: "current_stamina",
    maxstamina: "max_stamina",
    level: "level",
    experience: "experience",
    gold: "gold",
    goldbank: "stashed_gold",
    killtrack: "killtrack",
    deathtrack: "deathtrack",
    unused210: "unused210",
    unused211: "unused211",
};


/***/ }),

/***/ "./src/d2/constants.ts":
/*!*****************************!*\
  !*** ./src/d2/constants.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setConstantData = exports.getConstantData = void 0;
var versionedConstants = {
    vanilla: {},
    remodded: {},
};
function getConstantData(mod, version) {
    if (!(mod in versionedConstants)) {
        throw new Error("No constant data found for this mod " + mod + ". Supported mods are: " + Object.keys(versionedConstants).join(", "));
    }
    if (!(version.toString() in versionedConstants[mod])) {
        throw new Error("No constant data found for version " + version + " of mod " + mod + ". Supported versions are: " + Object.keys(versionedConstants[mod]).join(", "));
    }
    var constants = versionedConstants[mod][version.toString()];
    return constants;
}
exports.getConstantData = getConstantData;
function setConstantData(mod, version, data) {
    versionedConstants[mod][version.toString()] = data;
}
exports.setConstantData = setConstantData;


/***/ }),

/***/ "./src/d2/d2s.ts":
/*!***********************!*\
  !*** ./src/d2/d2s.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeItem = exports.readItem = exports.write = exports.read = exports.writer = exports.reader = void 0;
var header_1 = __webpack_require__(/*! ./header */ "./src/d2/header.ts");
var attributes_1 = __webpack_require__(/*! ./attributes */ "./src/d2/attributes.ts");
var bitreader_1 = __webpack_require__(/*! ../binary/bitreader */ "./src/binary/bitreader.ts");
var bitwriter_1 = __webpack_require__(/*! ../binary/bitwriter */ "./src/binary/bitwriter.ts");
var skills_1 = __webpack_require__(/*! ./skills */ "./src/d2/skills.ts");
var items = __importStar(__webpack_require__(/*! ./items */ "./src/d2/items.ts"));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
var attribute_enhancer_1 = __webpack_require__(/*! ./attribute_enhancer */ "./src/d2/attribute_enhancer.ts");
var defaultConfig = {
    extendedStash: false,
    sortProperties: true,
};
function reader(buffer) {
    return new bitreader_1.BitReader(buffer);
}
exports.reader = reader;
function read(buffer, mod, userConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var char, reader, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    char = {};
                    reader = new bitreader_1.BitReader(buffer);
                    config = Object.assign(defaultConfig, userConfig);
                    return [4 /*yield*/, header_1.readHeader(char, reader)];
                case 1:
                    _a.sent();
                    //could load constants based on version here
                    return [4 /*yield*/, header_1.readHeaderData(char, reader, mod)];
                case 2:
                    //could load constants based on version here
                    _a.sent();
                    return [4 /*yield*/, attributes_1.readAttributes(char, reader, mod)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, skills_1.readSkills(char, reader, mod)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, items.readCharItems(char, reader, mod, config)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, items.readCorpseItems(char, reader, mod, config)];
                case 6:
                    _a.sent();
                    if (!char.header.status.expansion) return [3 /*break*/, 9];
                    return [4 /*yield*/, items.readMercItems(char, reader, mod, config)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, items.readGolemItems(char, reader, mod, config)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [4 /*yield*/, attribute_enhancer_1.enhanceAttributes(char, mod, char.header.version, config)];
                case 10:
                    _a.sent();
                    return [2 /*return*/, char];
            }
        });
    });
}
exports.read = read;
function readItem(buffer, mod, version, userConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var reader, config, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reader = new bitreader_1.BitReader(buffer);
                    config = Object.assign(defaultConfig, userConfig);
                    return [4 /*yield*/, items.readItem(reader, mod, version, config)];
                case 1:
                    item = _a.sent();
                    return [4 /*yield*/, attribute_enhancer_1.enhanceItems([item], mod, version)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, item];
            }
        });
    });
}
exports.readItem = readItem;
function writer(buffer) {
    return new bitwriter_1.BitWriter();
}
exports.writer = writer;
function write(data, mod, version, userConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var config, writer, _a, _b, constants, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    config = Object.assign(defaultConfig, userConfig);
                    writer = new bitwriter_1.BitWriter();
                    data.header.version = version;
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, header_1.writeHeader(data)];
                case 1:
                    _b.apply(_a, [_s.sent()]);
                    constants = constants_1.getConstantData(mod, data.header.version);
                    _d = (_c = writer).WriteArray;
                    return [4 /*yield*/, header_1.writeHeaderData(data, constants)];
                case 2:
                    _d.apply(_c, [_s.sent()]);
                    _f = (_e = writer).WriteArray;
                    return [4 /*yield*/, attributes_1.writeAttributes(data, constants)];
                case 3:
                    _f.apply(_e, [_s.sent()]);
                    _h = (_g = writer).WriteArray;
                    return [4 /*yield*/, skills_1.writeSkills(data)];
                case 4:
                    _h.apply(_g, [_s.sent()]);
                    _k = (_j = writer).WriteArray;
                    return [4 /*yield*/, items.writeCharItems(data, mod, version, config)];
                case 5:
                    _k.apply(_j, [_s.sent()]);
                    _m = (_l = writer).WriteArray;
                    return [4 /*yield*/, items.writeCorpseItem(data, mod, version, config)];
                case 6:
                    _m.apply(_l, [_s.sent()]);
                    if (!data.header.status.expansion) return [3 /*break*/, 9];
                    _p = (_o = writer).WriteArray;
                    return [4 /*yield*/, items.writeMercItems(data, mod, version, config)];
                case 7:
                    _p.apply(_o, [_s.sent()]);
                    _r = (_q = writer).WriteArray;
                    return [4 /*yield*/, items.writeGolemItems(data, mod, version, config)];
                case 8:
                    _r.apply(_q, [_s.sent()]);
                    _s.label = 9;
                case 9: return [4 /*yield*/, header_1.fixHeader(writer)];
                case 10:
                    _s.sent();
                    return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.write = write;
function writeItem(item, mod, version, userConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var config, writer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = Object.assign(defaultConfig, userConfig);
                    writer = new bitwriter_1.BitWriter();
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, items.writeItem(item, mod, version, config)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeItem = writeItem;


/***/ }),

/***/ "./src/d2/header.ts":
/*!**************************!*\
  !*** ./src/d2/header.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixHeader = exports.writeHeaderData = exports.writeHeader = exports.readHeaderData = exports.readHeader = void 0;
var bitwriter_1 = __webpack_require__(/*! ../binary/bitwriter */ "./src/binary/bitwriter.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
function readHeader(char, reader) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            char.header = {};
            //0x0000
            char.header.identifier = reader.ReadUInt32().toString(16).padStart(8, "0");
            if (char.header.identifier != "aa55aa55") {
                throw new Error("D2S identifier 'aa55aa55' not found at position " + (reader.offset - 4 * 8));
            }
            //0x0004
            char.header.version = reader.ReadUInt32();
            return [2 /*return*/];
        });
    });
}
exports.readHeader = readHeader;
function readHeaderData(char, reader, mod) {
    return __awaiter(this, void 0, void 0, function () {
        var constants, v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    constants = constants_1.getConstantData(mod, char.header.version);
                    return [4 /*yield*/, _versionSpecificHeader(char.header.version)];
                case 1:
                    v = _a.sent();
                    if (v == null) {
                        throw new Error("Cannot parse version: " + char.header.version);
                    }
                    v.readHeader(char, reader, constants);
                    return [2 /*return*/];
            }
        });
    });
}
exports.readHeaderData = readHeaderData;
function writeHeader(char) {
    return __awaiter(this, void 0, void 0, function () {
        var writer;
        return __generator(this, function (_a) {
            writer = new bitwriter_1.BitWriter();
            writer.WriteUInt32(parseInt(char.header.identifier, 16)).WriteUInt32(char.header.version);
            return [2 /*return*/, writer.ToArray()];
        });
    });
}
exports.writeHeader = writeHeader;
function writeHeaderData(char, constants) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    return [4 /*yield*/, _versionSpecificHeader(char.header.version)];
                case 1:
                    v = _a.sent();
                    if (v == null) {
                        throw new Error("Cannot parse version: " + char.header.version);
                    }
                    v.writeHeader(char, writer, constants);
                    return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeHeaderData = writeHeaderData;
function fixHeader(writer) {
    return __awaiter(this, void 0, void 0, function () {
        var checksum, eof, i, byte;
        return __generator(this, function (_a) {
            checksum = 0;
            eof = writer.length / 8;
            writer.SeekByte(0x0008).WriteUInt32(eof);
            writer.SeekByte(0x000c).WriteUInt32(0);
            for (i = 0; i < eof; i++) {
                byte = writer.SeekByte(i).PeekBytes(1)[0];
                if (checksum & 0x80000000) {
                    byte += 1;
                }
                checksum = byte + checksum * 2;
                //hack make it a uint32
                checksum >>>= 0;
            }
            //checksum pos
            writer.SeekByte(0x000c).WriteUInt32(checksum);
            return [2 /*return*/];
        });
    });
}
exports.fixHeader = fixHeader;
/**
 * Save Version
 * 0x47, 0x0, 0x0, 0x0 = <1.06
 * 0x59, 0x0, 0x0, 0x0 = 1.08 = version
 * 0x5c, 0x0, 0x0, 0x0 = 1.09 = version
 * 0x60, 0x0, 0x0, 0x0 = 1.13c = version
 * 0x62, 0x0, 0x0, 0x0 = 1.2 = version
 * */
function _versionSpecificHeader(version) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = version;
                    switch (_a) {
                        case 0x60: return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(__webpack_require__(/*! ./versions/default_header */ "./src/d2/versions/default_header.ts")); })];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(__webpack_require__(/*! ./versions/default_header */ "./src/d2/versions/default_header.ts")); })];
                case 4: return [2 /*return*/, _b.sent()];
            }
        });
    });
}


/***/ }),

/***/ "./src/d2/index.ts":
/*!*************************!*\
  !*** ./src/d2/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./d2s */ "./src/d2/d2s.ts"), exports);
var header_1 = __webpack_require__(/*! ./header */ "./src/d2/header.ts");
Object.defineProperty(exports, "readHeader", { enumerable: true, get: function () { return header_1.readHeader; } });
Object.defineProperty(exports, "readHeaderData", { enumerable: true, get: function () { return header_1.readHeaderData; } });
Object.defineProperty(exports, "writeHeader", { enumerable: true, get: function () { return header_1.writeHeader; } });
Object.defineProperty(exports, "writeHeaderData", { enumerable: true, get: function () { return header_1.writeHeaderData; } });
Object.defineProperty(exports, "fixHeader", { enumerable: true, get: function () { return header_1.fixHeader; } });
var attributes_1 = __webpack_require__(/*! ./attributes */ "./src/d2/attributes.ts");
Object.defineProperty(exports, "readAttributes", { enumerable: true, get: function () { return attributes_1.readAttributes; } });
Object.defineProperty(exports, "writeAttributes", { enumerable: true, get: function () { return attributes_1.writeAttributes; } });
var skills_1 = __webpack_require__(/*! ./skills */ "./src/d2/skills.ts");
Object.defineProperty(exports, "readSkills", { enumerable: true, get: function () { return skills_1.readSkills; } });
Object.defineProperty(exports, "writeSkills", { enumerable: true, get: function () { return skills_1.writeSkills; } });
var attribute_enhancer_1 = __webpack_require__(/*! ./attribute_enhancer */ "./src/d2/attribute_enhancer.ts");
Object.defineProperty(exports, "enhanceAttributes", { enumerable: true, get: function () { return attribute_enhancer_1.enhanceAttributes; } });
Object.defineProperty(exports, "enhanceItems", { enumerable: true, get: function () { return attribute_enhancer_1.enhanceItems; } });
Object.defineProperty(exports, "enhancePlayerAttributes", { enumerable: true, get: function () { return attribute_enhancer_1.enhancePlayerAttributes; } });
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
Object.defineProperty(exports, "getConstantData", { enumerable: true, get: function () { return constants_1.getConstantData; } });
Object.defineProperty(exports, "setConstantData", { enumerable: true, get: function () { return constants_1.setConstantData; } });
var items_1 = __webpack_require__(/*! ./items */ "./src/d2/items.ts");
Object.defineProperty(exports, "ItemType", { enumerable: true, get: function () { return items_1.ItemType; } });
Object.defineProperty(exports, "Quality", { enumerable: true, get: function () { return items_1.Quality; } });
exports.types = __importStar(__webpack_require__(/*! ./types */ "./src/d2/types.ts"));


/***/ }),

/***/ "./src/d2/items.ts":
/*!*************************!*\
  !*** ./src/d2/items.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._writeMagicProperties = exports._readMagicProperties = exports.writeItem = exports.readItem = exports.writeItems = exports.readItems = exports.writeCorpseItem = exports.readCorpseItems = exports.writeGolemItems = exports.readGolemItems = exports.writeMercItems = exports.readMercItems = exports.writeCharItems = exports.readCharItems = exports.Quality = exports.ItemType = void 0;
var bitreader_1 = __webpack_require__(/*! ../binary/bitreader */ "./src/binary/bitreader.ts");
var bitwriter_1 = __webpack_require__(/*! ../binary/bitwriter */ "./src/binary/bitwriter.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Armor"] = 1] = "Armor";
    ItemType[ItemType["Shield"] = 2] = "Shield";
    ItemType[ItemType["Weapon"] = 3] = "Weapon";
    ItemType[ItemType["Other"] = 4] = "Other";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
var Quality;
(function (Quality) {
    Quality[Quality["Low"] = 1] = "Low";
    Quality[Quality["Normal"] = 2] = "Normal";
    Quality[Quality["Superior"] = 3] = "Superior";
    Quality[Quality["Magic"] = 4] = "Magic";
    Quality[Quality["Set"] = 5] = "Set";
    Quality[Quality["Rare"] = 6] = "Rare";
    Quality[Quality["Unique"] = 7] = "Unique";
    Quality[Quality["Crafted"] = 8] = "Crafted";
})(Quality = exports.Quality || (exports.Quality = {}));
// Right now I'm missing characters (case sensitive) E, F, I, J, L, M, Q, U, X.
// prettier-ignore
//huffman tree
var HUFFMAN = [
    /*0*/ [
        /*00*/ [
            /*000*/ [
                /*0000*/ [
                    /*00000*/ "w",
                    /*10000*/ "u"
                ],
                /*1000*/ [
                    /*01000*/ [
                        /*001000*/ "8",
                        /*101000*/ [
                            /*0101000*/ "y",
                            /*1101000*/ [
                                /*01101000*/ "5",
                                /*11101000*/ [
                                    /*011101000*/ "j",
                                    /*111101000*/ [
                                        /*ReMoDDeD adds - caps - begin*/
                                        /*0 111101000*/ [
                                            /*00 111101000*/ [
                                                /*000 111101000*/ [
                                                    /*0000 111101000*/ [
                                                        /*00000 111101000*/ [
                                                            /*000000 111101000*/ [
                                                                /*0000000 111101000*/ [],
                                                                /*1000000 111101000*/ []
                                                            ],
                                                            /*100000 111101000*/ [
                                                                /*0100000 111101000*/ "N",
                                                                /*1100000 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10000 111101000*/ [
                                                            /*010000 111101000*/ [
                                                                /*0010000 111101000*/ [],
                                                                /*1010000 111101000*/ []
                                                            ],
                                                            /*110000 111101000*/ [
                                                                /*0110000 111101000*/ [],
                                                                /*1110000 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1000 111101000*/ [
                                                        /*01000 111101000*/ [
                                                            /*001000 111101000*/ [
                                                                /*0001000 111101000*/ [],
                                                                /*1001000 111101000*/ []
                                                            ],
                                                            /*101000 111101000*/ [
                                                                /*0101000 111101000*/ [],
                                                                /*1101000 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11000 111101000*/ [
                                                            /*011000 111101000*/ [
                                                                /*0011000 111101000*/ [],
                                                                /*1011000 111101000*/ []
                                                            ],
                                                            /*111000 111101000*/ [
                                                                /*0111000 111101000*/ [],
                                                                /*1111000 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ],
                                                /*100 111101000*/ [
                                                    /*0100 111101000*/ [
                                                        /*00100 111101000*/ [
                                                            /*000100 111101000*/ [
                                                                /*0000100 111101000*/ [],
                                                                /*1000100 111101000*/ []
                                                            ],
                                                            /*100100 111101000*/ [
                                                                /*0100100 111101000*/ [],
                                                                /*1100100 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10100 111101000*/ [
                                                            /*010100 111101000*/ [
                                                                /*0010100 111101000*/ [],
                                                                /*1010100 111101000*/ []
                                                            ],
                                                            /*110100 111101000*/ [
                                                                /*0110100 111101000*/ [],
                                                                /*1110100 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1100 111101000*/ [
                                                        /*01100 111101000*/ [
                                                            /*011000 111101000*/ [
                                                                /*0011000 111101000*/ [],
                                                                /*1011000 111101000*/ []
                                                            ],
                                                            /*111000 111101000*/ [
                                                                /*0111000 111101000*/ [],
                                                                /*1111000 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11100 111101000*/ [
                                                            /*011100 111101000*/ [
                                                                /*0011100 111101000*/ [],
                                                                /*1011100 111101000*/ []
                                                            ],
                                                            /*111100 111101000*/ [
                                                                /*0111100 111101000*/ [],
                                                                /*1111100 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ],
                                            /*10 111101000*/ [
                                                /*010 111101000*/ [
                                                    /*0010 111101000*/ [
                                                        /*00010 111101000*/ [
                                                            /*000010 111101000*/ [
                                                                /*0000010 111101000*/ [],
                                                                /*1000010 111101000*/ []
                                                            ],
                                                            /*100010 111101000*/ [
                                                                /*0100010 111101000*/ [],
                                                                /*1100010 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10010 111101000*/ [
                                                            /*010010 111101000*/ [
                                                                /*0010010 111101000*/ [],
                                                                /*1010010 111101000*/ []
                                                            ],
                                                            /*110010 111101000*/ [
                                                                /*0110010 111101000*/ [],
                                                                /*1110010 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1010 111101000*/ [
                                                        /*01010 111101000*/ [
                                                            /*001010 111101000*/ [
                                                                /*0001010 111101000*/ [],
                                                                /*1001010 111101000*/ []
                                                            ],
                                                            /*101010 111101000*/ [
                                                                /*0101010 111101000*/ [],
                                                                /*1101010 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11010 111101000*/ [
                                                            /*011010 111101000*/ [
                                                                /*0011010 111101000*/ [],
                                                                /*1011010 111101000*/ []
                                                            ],
                                                            /*111010 111101000*/ [
                                                                /*0111010 111101000*/ [
                                                                    /*00111010 111101000*/ "A",
                                                                    /*10111010 111101000*/ []
                                                                ],
                                                                /*1111010 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ],
                                                /*110 111101000*/ [
                                                    /*0110 111101000*/ [
                                                        /*00110 111101000*/ [
                                                            /*000110 111101000*/ [
                                                                /*0000110 111101000*/ [],
                                                                /*1000110 111101000*/ []
                                                            ],
                                                            /*100110 111101000*/ [
                                                                /*0100110 111101000*/ [],
                                                                /*1100110 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10110 111101000*/ [
                                                            /*010110 111101000*/ [
                                                                /*0010110 111101000*/ [],
                                                                /*1010110 111101000*/ [
                                                                    /*01010110 111101000*/ "S",
                                                                    /*11010110 111101000*/ []
                                                                ]
                                                            ],
                                                            /*110110 111101000*/ [
                                                                /*0110110 111101000*/ [],
                                                                /*1110110 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1110 111101000*/ [
                                                        /*01110 111101000*/ [
                                                            /*001110 111101000*/ [
                                                                /*0001110 111101000*/ [],
                                                                /*1001110 111101000*/ []
                                                            ],
                                                            /*101110 111101000*/ [
                                                                /*0101110 111101000*/ [],
                                                                /*1101110 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11110 111101000*/ [
                                                            /*011110 111101000*/ [
                                                                /*0011110 111101000*/ [],
                                                                /*1011110 111101000*/ []
                                                            ],
                                                            /*111110 111101000*/ [
                                                                /*0111110 111101000*/ [],
                                                                /*1111110 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ],
                                        /*1 111101000*/ [
                                            /*01 111101000*/ [
                                                /*001 111101000*/ [
                                                    /*0001 111101000*/ [
                                                        /*00001 111101000*/ [
                                                            /*000001 111101000*/ [
                                                                /*0000001 111101000*/ [],
                                                                /*1000001 111101000*/ []
                                                            ],
                                                            /*100001 111101000*/ [
                                                                /*0100001 111101000*/ [
                                                                    /*00100001 111101000*/ "Z",
                                                                    /*10100001 111101000*/ []
                                                                ],
                                                                /*1100001 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10001 111101000*/ [
                                                            /*010001 111101000*/ [
                                                                /*0010001 111101000*/ [],
                                                                /*1010001 111101000*/ [
                                                                    /*01010001 111101000*/ "T",
                                                                    /*11010001 111101000*/ []
                                                                ]
                                                            ],
                                                            /*110001 111101000*/ [
                                                                /*0110001 111101000*/ [],
                                                                /*1110001 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1001 111101000*/ [
                                                        /*01001 111101000*/ [
                                                            /*001001 111101000*/ [
                                                                /*0001001 111101000*/ [
                                                                    /*00001001 111101000*/ [],
                                                                    /*10001001 111101000*/ "V"
                                                                ],
                                                                /*1001001 111101000*/ []
                                                            ],
                                                            /*101001 111101000*/ [
                                                                /*0101001 111101000*/ [],
                                                                /*1101001 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11001 111101000*/ [
                                                            /*011001 111101000*/ [
                                                                /*0011001 111101000*/ [],
                                                                /*1011001 111101000*/ []
                                                            ],
                                                            /*111001 111101000*/ [
                                                                /*0111001 111101000*/ [],
                                                                /*1111001 111101000*/ [
                                                                    undefined,
                                                                    "D"
                                                                ]
                                                            ]
                                                        ]
                                                    ]
                                                ],
                                                /*101 111101000*/ [
                                                    /*0101 111101000*/ [
                                                        /*00101 111101000*/ [
                                                            /*000101 111101000*/ [
                                                                /*0000101 111101000*/ [],
                                                                /*1000101 111101000*/ []
                                                            ],
                                                            /*100101 111101000*/ [
                                                                /*0100101 111101000*/ [
                                                                    /*00100101 111101000*/ "K",
                                                                    /*10100101 111101000*/ []
                                                                ],
                                                                /*1100101 111101000*/ [
                                                                    /*01100101 111101000*/ [],
                                                                    /*11100101 111101000*/ "P"
                                                                ]
                                                            ]
                                                        ],
                                                        /*10101 111101000*/ [
                                                            /*010101 111101000*/ [
                                                                /*0010101 111101000*/ [],
                                                                /*1010101 111101000*/ [
                                                                    /*01010101 111101000*/ [],
                                                                    /*11010101 111101000*/ "G"
                                                                ]
                                                            ],
                                                            /*110101 111101000*/ [
                                                                /*0110101 111101000*/ [],
                                                                /*1110101 111101000*/ []
                                                            ]
                                                        ]
                                                    ],
                                                    /*1101 111101000*/ [
                                                        /*01101 111101000*/ [
                                                            /*001101 111101000*/ [
                                                                /*0001101 111101000*/ [],
                                                                /*1001101 111101000*/ []
                                                            ],
                                                            /*101101 111101000*/ [
                                                                /*0101101 111101000*/ [],
                                                                /*1101101 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11101 111101000*/ [
                                                            /*011101 111101000*/ [
                                                                /*0011101 111101000*/ [
                                                                    /*0011101 111101000*/ [],
                                                                    /*1011101 111101000*/ "H"
                                                                ],
                                                                /*1011101 111101000*/ []
                                                            ],
                                                            /*111101 111101000*/ [
                                                                /*0111101 111101000*/ [],
                                                                /*1111101 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ],
                                            /*11 111101000*/ [
                                                /*011 111101000*/ [
                                                    /*0011 111101000*/ [
                                                        /*00011 111101000*/ [
                                                            /*000011 111101000*/ [
                                                                /*0000011 111101000*/ [],
                                                                /*1000011 111101000*/ []
                                                            ],
                                                            /*100011 111101000*/ [
                                                                /*0100011 111101000*/ [],
                                                                /*1100011 111101000*/ []
                                                            ]
                                                        ],
                                                        /*10011 111101000*/ [
                                                            /*010011 111101000*/ [
                                                                /*0010011 111101000*/ [],
                                                                /*1010011 111101000*/ []
                                                            ],
                                                            /*110011 111101000*/ [
                                                                /*0110011 111101000*/ [],
                                                                /*1110011 111101000*/ [
                                                                    /*01110011 111101000*/ "B",
                                                                    /*11110011 111101000*/ []
                                                                ]
                                                            ]
                                                        ]
                                                    ],
                                                    /*1011 111101000*/ [
                                                        /*01011 111101000*/ [
                                                            /*001011 111101000*/ [
                                                                /*0001011 111101000*/ [],
                                                                /*1001011 111101000*/ []
                                                            ],
                                                            /*101011 111101000*/ [
                                                                /*0101011 111101000*/ [],
                                                                /*1101011 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11011 111101000*/ [
                                                            /*011011 111101000*/ [
                                                                /*0011011 111101000*/ [
                                                                    /*00011011 111101000*/ [],
                                                                    /*10011011 111101000*/ "C"
                                                                ],
                                                                /*1011011 111101000*/ []
                                                            ],
                                                            /*111011 111101000*/ [
                                                                /*0111011 111101000*/ [],
                                                                /*1111011 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ],
                                                /*111 111101000*/ [
                                                    /*0111 111101000*/ [
                                                        /*00111 111101000*/ [
                                                            /*000111 111101000*/ [
                                                                /*0000111 111101000*/ [],
                                                                /*1000111 111101000*/ []
                                                            ],
                                                            /*100111 111101000*/ [
                                                                /*0100111 111101000*/ [],
                                                                /*1100111 111101000*/ [
                                                                    /*01100111 111101000*/ [],
                                                                    /*11100111 111101000*/ "R"
                                                                ]
                                                            ]
                                                        ],
                                                        /*10111 111101000*/ [
                                                            /*010111 111101000*/ [
                                                                /*0010111 111101000*/ [],
                                                                /*1010111 111101000*/ [
                                                                    /*01010111 111101000*/ [],
                                                                    /*11010111 111101000*/ "O"
                                                                ]
                                                            ],
                                                            /*110111 111101000*/ [
                                                                /*0110111 111101000*/ [],
                                                                /*1110111 111101000*/ [
                                                                    /*01110111 111101000*/ "W",
                                                                    /*11110111 111101000*/ []
                                                                ]
                                                            ]
                                                        ]
                                                    ],
                                                    /*1111 111101000*/ [
                                                        /*01111 111101000*/ [
                                                            /*001111 111101000*/ [
                                                                /*0001111 111101000*/ [],
                                                                /*1001111 111101000*/ []
                                                            ],
                                                            /*101111 111101000*/ [
                                                                /*0101111 111101000*/ [],
                                                                /*1101111 111101000*/ []
                                                            ]
                                                        ],
                                                        /*11111 111101000*/ [
                                                            /*011111 111101000*/ [
                                                                /*0011111 111101000*/ [],
                                                                /*1011111 111101000*/ []
                                                            ],
                                                            /*111111 111101000*/ [
                                                                /*0111111 111101000*/ [
                                                                    /*00111111 111101000*/ [],
                                                                    /*10111111 111101000*/ "Y"
                                                                ],
                                                                /*1111111 111101000*/ []
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                        /*ReMoDDeD adds - end*/
                                    ]
                                ]
                            ]
                        ]
                    ],
                    /*11000*/ "h"
                ]
            ],
            /*100*/ [
                /*0100*/ "s",
                /*1100*/ [
                    /*01100*/ [
                        /*001100*/ "2",
                        /*101100*/ "n"
                    ],
                    /*11100*/ "x"
                ]
            ]
        ],
        /*10*/ [
            /*010*/ [
                /*0010*/ [
                    /*00010*/ "c",
                    /*10010*/ [
                        /*010010*/ "k",
                        /*110010*/ "f"
                    ]
                ],
                /*1010*/ "b"
            ],
            /*110*/ [
                /*0110*/ [
                    /*00110*/ "t",
                    /*10110*/ "m"
                ],
                /*1110*/ [
                    /*01110*/ "9",
                    /*11110*/ "7"
                ]
            ]
        ]
    ],
    /*1*/ [
        /*01*/ " ",
        /*11*/ [
            /*011*/ [
                /*0011*/ [
                    /*00011*/ [
                        /*000011*/ "e",
                        /*100011*/ "d"
                    ],
                    /*10011*/ "p"
                ],
                /*1011*/ [
                    /*01011*/ "g",
                    /*11011*/ [
                        /*011011*/ [
                            /*0011011*/ [
                                /*00011011*/ "z",
                                /*10011011*/ "q"
                            ],
                            /*1011011*/ "3"
                        ],
                        /*111011*/ [
                            /*0111011*/ "v",
                            /*1111011*/ "6"
                        ]
                    ]
                ]
            ],
            /*111*/ [
                /*0111*/ [
                    /*00111*/ "r",
                    /*10111*/ "l"
                ],
                /*1111*/ [
                    /*01111*/ "a",
                    /*11111*/ [
                        /*011111*/ [
                            /*0011111*/ "1",
                            /*1011111*/ [
                                /*01011111*/ "4",
                                /*11011111*/ "0"
                            ]
                        ],
                        /*111111*/ [
                            /*0111111*/ "i",
                            /*1111111*/ "o"
                        ]
                    ]
                ]
            ]
        ]
    ]
];
// prettier-ignore
var HUFFMAN_LOOKUP = {
    "0": { "v": 223, "l": 8 },
    "1": { "v": 31, "l": 7 },
    "2": { "v": 12, "l": 6 },
    "3": { "v": 91, "l": 7 },
    "4": { "v": 95, "l": 8 },
    "5": { "v": 104, "l": 8 },
    "6": { "v": 123, "l": 7 },
    "7": { "v": 30, "l": 5 },
    "8": { "v": 8, "l": 6 },
    "9": { "v": 14, "l": 5 },
    " ": { "v": 1, "l": 2 },
    "a": { "v": 15, "l": 5 },
    "b": { "v": 10, "l": 4 },
    "c": { "v": 2, "l": 5 },
    "d": { "v": 35, "l": 6 },
    "e": { "v": 3, "l": 6 },
    "f": { "v": 50, "l": 6 },
    "g": { "v": 11, "l": 5 },
    "h": { "v": 24, "l": 5 },
    "i": { "v": 63, "l": 7 },
    "j": { "v": 232, "l": 9 },
    "k": { "v": 18, "l": 6 },
    "l": { "v": 23, "l": 5 },
    "m": { "v": 22, "l": 5 },
    "n": { "v": 44, "l": 6 },
    "o": { "v": 127, "l": 7 },
    "p": { "v": 19, "l": 5 },
    "q": { "v": 155, "l": 8 },
    "r": { "v": 7, "l": 5 },
    "s": { "v": 4, "l": 4 },
    "t": { "v": 6, "l": 5 },
    "u": { "v": 16, "l": 5 },
    "v": { "v": 59, "l": 7 },
    "w": { "v": 0, "l": 5 },
    "x": { "v": 28, "l": 5 },
    "y": { "v": 40, "l": 7 },
    "z": { "v": 27, "l": 8 },
    "A": { "v": 30184, "l": 17 },
    "B": { "v": 59368, "l": 17 },
    "C": { "v": 79848, "l": 17 },
    "D": { "v": 127976, "l": 17 },
    //"E": { "v": 0, "l": 0 }, /**/
    //"F": { "v": 0, "l": 0 }, /**/
    "G": { "v": 109544, "l": 17 },
    "H": { "v": 80872, "l": 17 },
    //"I": { "v": 0, "l": 0 }, /**/
    //"J": { "v": 0, "l": 0 }, /**/
    "K": { "v": 19432, "l": 17 },
    //"L": { "v": 0, "l": 0 }, /**/
    //"M": { "v": 0, "l": 0 }, /**/
    "N": { "v": 16872, "l": 16 },
    "O": { "v": 110568, "l": 17 },
    "P": { "v": 117736, "l": 17 },
    //"Q": { "v": 0, "l": 0 }, /**/
    "R": { "v": 118760, "l": 17 },
    "S": { "v": 44520, "l": 17 },
    "T": { "v": 41960, "l": 17 },
    //"U": { "v": 0, "l": 0 }, /**/
    "V": { "v": 70632, "l": 17 },
    "W": { "v": 61416, "l": 17 },
    //"X": { "v": 0, "l": 0 }, /**/
    "Y": { "v": 98280, "l": 17 },
    "Z": { "v": 17384, "l": 17 } /*00100001111101000*/
};
function readCharItems(char, reader, mod, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = char;
                    return [4 /*yield*/, readItems(reader, mod, char.header.version, config, char)];
                case 1:
                    _a.items = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.readCharItems = readCharItems;
function writeCharItems(char, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, writeItems(char.items, mod, version, config)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeCharItems = writeCharItems;
function readMercItems(char, reader, mod, config) {
    return __awaiter(this, void 0, void 0, function () {
        var header, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    char.merc_items = [];
                    header = reader.ReadString(2);
                    if (header !== "jf") {
                        // header is not present in first save after char is created
                        if ((char === null || char === void 0 ? void 0 : char.header.level) === 1) {
                            return [2 /*return*/];
                        }
                        throw new Error("Mercenary header 'jf' not found at position " + (reader.offset - 2 * 8));
                    }
                    if (!(char.header.merc_id && parseInt(char.header.merc_id, 16) !== 0)) return [3 /*break*/, 2];
                    _a = char;
                    return [4 /*yield*/, readItems(reader, mod, char.header.version, config, char)];
                case 1:
                    _a.merc_items = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.readMercItems = readMercItems;
function writeMercItems(char, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    writer.WriteString("jf", 2);
                    if (!(char.header.merc_id && parseInt(char.header.merc_id, 16) !== 0)) return [3 /*break*/, 2];
                    char.merc_items = char.merc_items || [];
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, writeItems(char.merc_items, mod, version, config)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 2;
                case 2: return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeMercItems = writeMercItems;
function readGolemItems(char, reader, mod, config) {
    return __awaiter(this, void 0, void 0, function () {
        var header, has_golem, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    header = reader.ReadString(2);
                    if (header !== "kf") {
                        // header is not present in first save after char is created
                        if ((char === null || char === void 0 ? void 0 : char.header.level) === 1) {
                            return [2 /*return*/];
                        }
                        throw new Error("Golem header 'kf' not found at position " + (reader.offset - 2 * 8));
                    }
                    has_golem = reader.ReadUInt8();
                    if (!(has_golem === 1)) return [3 /*break*/, 2];
                    _a = char;
                    return [4 /*yield*/, readItem(reader, mod, char.header.version, config)];
                case 1:
                    _a.golem_item = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.readGolemItems = readGolemItems;
function writeGolemItems(char, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    writer.WriteString("kf", 2);
                    if (!char.golem_item) return [3 /*break*/, 2];
                    writer.WriteUInt8(1);
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, writeItem(char.golem_item, mod, version, config)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    writer.WriteUInt8(0);
                    _c.label = 3;
                case 3: return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeGolemItems = writeGolemItems;
function readCorpseItems(char, reader, mod, config) {
    return __awaiter(this, void 0, void 0, function () {
        var header, i, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    char.corpse_items = [];
                    header = reader.ReadString(2);
                    if (header !== "JM") {
                        // header is not present in first save after char is created
                        if (char.header.level === 1) {
                            char.is_dead = 0;
                            return [2 /*return*/];
                        }
                        throw new Error("Corpse header 'JM' not found at position " + (reader.offset - 2 * 8));
                    }
                    char.is_dead = reader.ReadUInt16(); //0x0002 [corpse count]
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < char.is_dead)) return [3 /*break*/, 4];
                    reader.SkipBytes(12); //0x0004 [b4_entered_area, x_pos, y_pos]
                    _a = char;
                    _c = (_b = char.corpse_items).concat;
                    return [4 /*yield*/, readItems(reader, mod, char.header.version, config, char)];
                case 2:
                    _a.corpse_items = _c.apply(_b, [_d.sent()]);
                    _d.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.readCorpseItems = readCorpseItems;
function writeCorpseItem(char, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    writer.WriteString("JM", 2);
                    writer.WriteUInt16(char.is_dead);
                    if (!char.is_dead) return [3 /*break*/, 2];
                    writer.WriteArray(new Uint8Array(12));
                    char.corpse_items = char.corpse_items || [];
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, writeItems(char.corpse_items, mod, version, config)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 2;
                case 2: return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeCorpseItem = writeCorpseItem;
function readItems(reader, mod, version, config, char) {
    return __awaiter(this, void 0, void 0, function () {
        var items, header, count, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    items = [];
                    header = reader.ReadString(2);
                    if (header !== "JM") {
                        // header is not present in first save after char is created
                        if ((char === null || char === void 0 ? void 0 : char.header.level) === 1) {
                            return [2 /*return*/, []]; // TODO: return starter items based on class
                        }
                        throw new Error("Item list header 'JM' not found at position " + (reader.offset - 2 * 8));
                    }
                    count = reader.ReadUInt16();
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < count)) return [3 /*break*/, 4];
                    _b = (_a = items).push;
                    return [4 /*yield*/, readItem(reader, mod, version, config)];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, items];
            }
        });
    });
}
exports.readItems = readItems;
function writeItems(items, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    writer = new bitwriter_1.BitWriter();
                    writer.WriteString("JM", 2);
                    writer.WriteUInt16(items.length);
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < items.length)) return [3 /*break*/, 4];
                    _b = (_a = writer).WriteArray;
                    return [4 /*yield*/, writeItem(items[i], mod, version, config)];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeItems = writeItems;
function readItem(reader, mod, version, config) {
    return __awaiter(this, void 0, void 0, function () {
        var header, constants, item, i, prefix, arr, i, plist_flag, magic_attributes, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (version <= 0x60) {
                        header = reader.ReadString(2);
                        if (header !== "JM") {
                            throw new Error("Item header 'JM' not found at position " + (reader.offset - 2 * 8));
                        }
                    }
                    constants = constants_1.getConstantData(mod, version);
                    item = {};
                    _readSimpleBits(item, reader, version, constants, config);
                    if (!item.simple_item) {
                        item.id = reader.ReadUInt32(32);
                        item.level = reader.ReadUInt8(7);
                        item.quality = reader.ReadUInt8(4);
                        item.multiple_pictures = reader.ReadBit();
                        if (item.multiple_pictures) {
                            item.picture_id = reader.ReadUInt8(3);
                        }
                        item.class_specific = reader.ReadBit();
                        if (item.class_specific) {
                            item.auto_affix_id = reader.ReadUInt16(11);
                        }
                        switch (item.quality) {
                            case Quality.Low:
                                item.low_quality_id = reader.ReadUInt8(3);
                                break;
                            case Quality.Normal:
                                break;
                            case Quality.Superior:
                                item.file_index = reader.ReadUInt8(3);
                                break;
                            case Quality.Magic:
                                item.magic_prefix = reader.ReadUInt16(11);
                                item.magic_suffix = reader.ReadUInt16(11);
                                break;
                            case Quality.Set:
                                item.set_id = reader.ReadUInt16(12);
                                item.set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : null;
                                break;
                            case Quality.Unique:
                                item.unique_id = reader.ReadUInt16(12);
                                item.unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : null;
                                break;
                            case Quality.Rare:
                            case Quality.Crafted:
                                item.rare_name_id = reader.ReadUInt8(8);
                                if (item.rare_name_id)
                                    item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : null;
                                item.rare_name_id2 = reader.ReadUInt8(8);
                                if (item.rare_name_id2)
                                    item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : null;
                                item.magical_name_ids = [];
                                for (i = 0; i < 6; i++) {
                                    prefix = reader.ReadBit();
                                    if (prefix === 1) {
                                        item.magical_name_ids[i] = reader.ReadUInt16(11);
                                    }
                                    else {
                                        item.magical_name_ids[i] = null;
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        if (item.given_runeword) {
                            item.runeword_id = reader.ReadUInt16(12);
                            //fix delerium on d2gs??? why is this a thing?
                            if (item.runeword_id == 2718) {
                                item.runeword_id = 48;
                            }
                            if (constants.runewords[item.runeword_id]) {
                                item.runeword_name = constants.runewords[item.runeword_id].n;
                            }
                            reader.ReadUInt8(4);
                        }
                        if (item.personalized) {
                            arr = new Uint8Array(16);
                            for (i = 0; i < arr.length; i++) {
                                if (version > 0x61) {
                                    arr[i] = reader.ReadUInt8(8);
                                }
                                else {
                                    arr[i] = reader.ReadUInt8(7);
                                }
                                if (arr[i] === 0x00) {
                                    break;
                                }
                            }
                            item.personalized_name = new bitreader_1.BitReader(arr).ReadString(16).trim().replace(/\0/g, "");
                        }
                        //tomes
                        if (item.type === "tbk" || item.type == "ibk") {
                            reader.ReadUInt8(5);
                        }
                        //realm data
                        item.timestamp = reader.ReadUInt8(1);
                        if (item.type_id === ItemType.Armor) {
                            item.defense_rating = reader.ReadUInt16(constants.magical_properties[31].sB) - constants.magical_properties[31].sA;
                        }
                        if (item.type_id === ItemType.Armor || item.type_id === ItemType.Weapon) {
                            item.max_durability = reader.ReadUInt16(constants.magical_properties[73].sB) - constants.magical_properties[73].sA;
                            if (item.max_durability > 0) {
                                item.current_durability = reader.ReadUInt16(constants.magical_properties[72].sB) - constants.magical_properties[72].sA;
                            }
                        }
                        if (constants.stackables[item.type]) {
                            item.quantity = reader.ReadUInt16(9);
                        }
                        if (item.socketed === 1) {
                            item.total_nr_of_sockets = reader.ReadUInt8(4);
                        }
                        plist_flag = 0;
                        if (item.quality === Quality.Set) {
                            plist_flag = reader.ReadUInt8(5);
                            item.set_list_count = 0;
                            item._unknown_data.plist_flag = plist_flag;
                        }
                        magic_attributes = _readMagicProperties(reader, constants);
                        item.magic_attributes = magic_attributes;
                        while (plist_flag > 0) {
                            if (plist_flag & 1) {
                                item.set_list_count += 1;
                                magic_attributes = _readMagicProperties(reader, constants);
                                if (item.set_attributes) {
                                    item.set_attributes.push(magic_attributes);
                                }
                                else {
                                    item.set_attributes = [magic_attributes];
                                }
                            }
                            plist_flag >>>= 1;
                        }
                        if (item.given_runeword === 1) {
                            magic_attributes = _readMagicProperties(reader, constants);
                            if (magic_attributes && magic_attributes.length > 0) {
                                item.runeword_attributes = magic_attributes;
                            }
                        }
                    }
                    reader.Align();
                    if (!(item.nr_of_items_in_sockets > 0 && item.simple_item === 0)) return [3 /*break*/, 4];
                    item.socketed_items = [];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < item.nr_of_items_in_sockets)) return [3 /*break*/, 4];
                    _b = (_a = item.socketed_items).push;
                    return [4 /*yield*/, readItem(reader, mod, version, config)];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: 
                //console.log(JSON.stringify(item));
                return [2 /*return*/, item];
            }
        });
    });
}
exports.readItem = readItem;
function writeItem(item, mod, version, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var constants, writer, i, magical_name_id, runeword_id, name_1, i, set_attribute_count, plist_flag, i, i, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    constants = constants_1.getConstantData(mod, version);
                    if (item._unknown_data === undefined) {
                        item._unknown_data = {};
                    }
                    if (item.categories === undefined) {
                        item.categories = (_a = _GetItemTXT(item, constants)) === null || _a === void 0 ? void 0 : _a.c;
                    }
                    writer = new bitwriter_1.BitWriter();
                    if (version <= 0x60) {
                        writer.WriteString("JM", 2);
                    }
                    _writeSimpleBits(writer, mod, version, item);
                    if (!item.simple_item) {
                        writer.WriteUInt32(item.id, 32);
                        writer.WriteUInt8(item.level, 7);
                        writer.WriteUInt8(item.quality, 4);
                        writer.WriteUInt8(item.multiple_pictures, 1);
                        if (item.multiple_pictures) {
                            writer.WriteUInt8(item.picture_id, 3);
                        }
                        writer.WriteUInt8(item.class_specific, 1);
                        if (item.class_specific === 1) {
                            writer.WriteUInt16(item.auto_affix_id || 0, 11);
                        }
                        switch (item.quality) {
                            case Quality.Low:
                                writer.WriteUInt8(item.low_quality_id, 3);
                                break;
                            case Quality.Normal:
                                break;
                            case Quality.Superior:
                                writer.WriteUInt8(item.file_index || 0, 3);
                                break;
                            case Quality.Magic:
                                writer.WriteUInt16(item.magic_prefix, 11);
                                writer.WriteUInt16(item.magic_suffix, 11);
                                break;
                            case Quality.Set:
                                writer.WriteUInt16(item.set_id, 12);
                                break;
                            case Quality.Unique:
                                writer.WriteUInt16(item.unique_id, 12);
                                break;
                            case Quality.Rare:
                            case Quality.Crafted:
                                writer.WriteUInt8(item.rare_name_id !== undefined ? item.rare_name_id : _lookupRareId(item.rare_name, constants), 8);
                                writer.WriteUInt8(item.rare_name_id2 !== undefined ? item.rare_name_id2 : _lookupRareId(item.rare_name2, constants), 8);
                                for (i = 0; i < 6; i++) {
                                    magical_name_id = item.magical_name_ids !== undefined ? item.magical_name_ids[i] : undefined;
                                    if (magical_name_id) {
                                        writer.WriteBit(1);
                                        writer.WriteUInt16(magical_name_id, 11);
                                    }
                                    else {
                                        writer.WriteBit(0);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        if (item.given_runeword) {
                            runeword_id = item.runeword_id;
                            if (runeword_id == 2718) {
                                runeword_id = 48;
                            }
                            writer.WriteUInt16(runeword_id, 12);
                            writer.WriteUInt8(5, 4); //always 5?
                        }
                        if (item.personalized) {
                            name_1 = item.personalized_name.substring(0, 16);
                            for (i = 0; i < name_1.length; i++) {
                                if (version > 0x61) {
                                    writer.WriteUInt8(name_1.charCodeAt(i), 8);
                                }
                                else {
                                    writer.WriteUInt8(name_1.charCodeAt(i) & 0x7f, 7);
                                }
                            }
                            writer.WriteUInt8(0x00, version > 0x61 ? 8 : 7);
                        }
                        if (item.type === "tbk") {
                            writer.WriteUInt8(0, 5);
                        }
                        else if (item.type === "ibk") {
                            writer.WriteUInt8(1, 5);
                        }
                        writer.WriteUInt8(item.timestamp, 1);
                        if (item.type_id === ItemType.Armor || item.type_id === ItemType.Shield) {
                            writer.WriteUInt16(item.defense_rating + constants.magical_properties[31].sA, constants.magical_properties[31].sB);
                        }
                        if (item.type_id === ItemType.Armor || item.type_id === ItemType.Shield || item.type_id === ItemType.Weapon) {
                            writer.WriteUInt16(item.max_durability || 0, constants.magical_properties[73].sB);
                            if (item.max_durability > 0) {
                                writer.WriteUInt16(item.current_durability, constants.magical_properties[72].sB);
                            }
                        }
                        if (constants.stackables[item.type]) {
                            writer.WriteUInt16(item.quantity, 9);
                        }
                        if (item.socketed === 1) {
                            writer.WriteUInt8(item.total_nr_of_sockets, 4);
                        }
                        if (item.quality === Quality.Set) {
                            set_attribute_count = item.set_attributes != null ? item.set_attributes.length : 0;
                            plist_flag = (1 << set_attribute_count) - 1;
                            writer.WriteUInt8(item._unknown_data.plist_flag || plist_flag, 5);
                        }
                        _writeMagicProperties(writer, item.magic_attributes, constants);
                        if (item.set_attributes && item.set_attributes.length > 0) {
                            for (i = 0; i < item.set_attributes.length; i++) {
                                _writeMagicProperties(writer, item.set_attributes[i], constants);
                            }
                        }
                        if (item.given_runeword === 1) {
                            _writeMagicProperties(writer, item.runeword_attributes, constants);
                        }
                    }
                    writer.Align();
                    if (!(item.nr_of_items_in_sockets > 0 && item.simple_item === 0)) return [3 /*break*/, 4];
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < item.nr_of_items_in_sockets)) return [3 /*break*/, 4];
                    _c = (_b = writer).WriteArray;
                    return [4 /*yield*/, writeItem(item.socketed_items[i], mod, version, config)];
                case 2:
                    _c.apply(_b, [_d.sent()]);
                    _d.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, writer.ToArray()];
            }
        });
    });
}
exports.writeItem = writeItem;
function _readSimpleBits(item, reader, version, constants, config) {
    var _a;
    //init so we do not have npe's
    item._unknown_data = {};
    //1.10-1.14d
    //[flags:32][version:10][mode:3]([invloc:4][x:4][y:4][page:3])([itemcode:32])([sockets:3])
    //1.15
    //[flags:32][version:3][mode:3]([invloc:4][x:4][y:4][page:3])([itemcode:variable])([sockets:3])
    item._unknown_data.b0_3 = reader.ReadBitArray(4);
    item.identified = reader.ReadBit();
    item._unknown_data.b5_10 = reader.ReadBitArray(6);
    item.socketed = reader.ReadBit();
    item._unknown_data.b12 = reader.ReadBitArray(1);
    item.new = reader.ReadBit();
    item._unknown_data.b14_15 = reader.ReadBitArray(2);
    item.is_ear = reader.ReadBit();
    item.starter_item = reader.ReadBit();
    item._unknown_data.b18_20 = reader.ReadBitArray(3);
    item.simple_item = reader.ReadBit();
    item.ethereal = reader.ReadBit();
    item._unknown_data.b23 = reader.ReadBitArray(1);
    item.personalized = reader.ReadBit();
    item._unknown_data.b25 = reader.ReadBitArray(1);
    item.given_runeword = reader.ReadBit();
    item._unknown_data.b27_31 = reader.ReadBitArray(5);
    if (version <= 0x60) {
        item.version = reader.ReadUInt16(10).toString(10);
    }
    else if (version >= 0x61) {
        item.version = reader.ReadUInt16(3).toString(2);
    }
    item.location_id = reader.ReadUInt8(3);
    item.equipped_id = reader.ReadUInt8(4);
    item.position_x = reader.ReadUInt8(4);
    item.position_y = reader.ReadUInt8(4);
    item.alt_position_id = reader.ReadUInt8(3);
    if (item.is_ear) {
        var clazz = reader.ReadUInt8(3);
        var level = reader.ReadUInt8(7);
        var arr = new Uint8Array(15);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = reader.ReadUInt8(7);
            if (arr[i] === 0x00) {
                break;
            }
        }
        var name_2 = new bitreader_1.BitReader(arr).ReadString(15).trim().replace(/\0/g, "");
        item.ear_attributes = {
            class: clazz,
            level: level,
            name: name_2,
        };
    }
    else {
        if (version <= 0x60) {
            item.type = reader.ReadString(4);
        }
        else if (version >= 0x61) {
            item.type = "";
            //props to d07riv
            //https://github.com/d07RiV/d07riv.github.io/blob/master/d2r.html#L11-L20
            for (var i = 0; i < 4; i++) {
                var node = HUFFMAN;
                var bits_1 = "";
                do {
                    var bit = reader.ReadBit();
                    bits_1 += bit;
                    node = node[bit];
                    if (node === undefined) {
                        console.log("Huffman value starting by " + bits_1.split("").reverse().join("") + "... is undefined.");
                    }
                } while (Array.isArray(node));
                item.type += node;
            }
        }
        item.type = item.type.trim().replace(/\0/g, "");
        var details = _GetItemTXT(item, constants);
        item.categories = details === null || details === void 0 ? void 0 : details.c;
        if (item === null || item === void 0 ? void 0 : item.categories.includes("Any Armor")) {
            item.type_id = ItemType.Armor;
        }
        else if (item === null || item === void 0 ? void 0 : item.categories.includes("Weapon")) {
            item.type_id = ItemType.Weapon;
            details = constants.weapon_items[item.type];
        }
        else {
            item.type_id = ItemType.Other;
        }
        var bits = item.simple_item ? 1 : 3;
        if ((_a = item.categories) === null || _a === void 0 ? void 0 : _a.includes("Quest")) {
            item.quest_difficulty = reader.ReadUInt16(constants.magical_properties[356].sB) - constants.magical_properties[356].sA;
            bits = 1;
        }
        item.nr_of_items_in_sockets = reader.ReadUInt8(bits);
    }
}
function _lookupRareId(name, constants) {
    //some inconsistencies with txt data and nokka. so have to hack it with startsWith
    return constants.rare_names.findIndex(function (k) { return k && k.n && (k.n.toLowerCase().startsWith(name.toLowerCase()) || name.toLowerCase().startsWith(k.n.toLowerCase())); });
}
function _writeSimpleBits(writer, mod, version, item) {
    var _a;
    var constants = constants_1.getConstantData(mod, version);
    writer.WriteBits(item._unknown_data.b0_3 || new Uint8Array(4), 4);
    writer.WriteBit(item.identified);
    writer.WriteBits(item._unknown_data.b5_10 || new Uint8Array(6), 6);
    writer.WriteBit(item.socketed);
    writer.WriteBits(item._unknown_data.b12 || new Uint8Array(1), 1);
    writer.WriteBit(item.new);
    writer.WriteBits(item._unknown_data.b14_15 || new Uint8Array(2), 2);
    writer.WriteBit(item.is_ear);
    writer.WriteBit(item.starter_item);
    writer.WriteBits(item._unknown_data.b18_20 || new Uint8Array(3), 3);
    writer.WriteBit(item.simple_item);
    writer.WriteBit(item.ethereal);
    writer.WriteBits(item._unknown_data.b23 || new Uint8Array([1]), 1); //always 1? IFLAG_JUSTSAVED
    writer.WriteBit(item.personalized);
    writer.WriteBits(item._unknown_data.b25 || new Uint8Array(1), 1); //IFLAG_LOWQUALITY
    writer.WriteBit(item.given_runeword);
    writer.WriteBits(item._unknown_data.b27_31 || new Uint8Array(5), 5);
    var itemVersion = item.version != null ? item.version : "101";
    if (version <= 0x60) {
        // 0 = pre-1.08; 1 = 1.08/1.09 normal; 2 = 1.10 normal; 100 = 1.08/1.09 expansion; 101 = 1.10 expansion
        writer.WriteUInt16(parseInt(itemVersion, 10), 10);
    }
    else if (version >= 0x61) {
        writer.WriteUInt16(parseInt(itemVersion, 2), 3);
    }
    writer.WriteUInt8(item.location_id, 3);
    writer.WriteUInt8(item.equipped_id, 4);
    writer.WriteUInt8(item.position_x, 4);
    writer.WriteUInt8(item.position_y, 4);
    writer.WriteUInt8(item.alt_position_id, 3);
    if (item.is_ear) {
        writer.WriteUInt8(item.ear_attributes.class, 3);
        writer.WriteUInt8(item.ear_attributes.level, 7);
        var name_3 = item.ear_attributes.name.substring(0, 15);
        for (var i = 0; i < name_3.length; i++) {
            writer.WriteUInt8(name_3.charCodeAt(i) & 0x7f, 7);
        }
        writer.WriteUInt8(0x00, 7);
    }
    else {
        var t = item.type.padEnd(4, " ");
        if (version <= 0x60) {
            writer.WriteString(t, 4);
        }
        else {
            for (var _i = 0, t_1 = t; _i < t_1.length; _i++) {
                var c = t_1[_i];
                var n = HUFFMAN_LOOKUP[c];
                writer.WriteUInt32(n.v, n.l); // Change from Uint16 to Uint32 because in ReMoDDeD caps letters are on 17bits.
            }
        }
        var bits = item.simple_item ? 1 : 3;
        if ((_a = item.categories) === null || _a === void 0 ? void 0 : _a.includes("Quest")) {
            var difficulty = item.quest_difficulty || 0;
            writer.WriteUInt16(difficulty + constants.magical_properties[356].sA, constants.magical_properties[356].sB);
            bits = 1;
        }
        writer.WriteUInt8(item.nr_of_items_in_sockets, bits);
    }
}
function _readMagicProperties(reader, constants) {
    var id = reader.ReadUInt16(9);
    var magic_attributes = [];
    while (id != 0x1ff) {
        var values = [];
        if (!constants.magical_properties[id]) {
            throw new Error("Invalid magic property Id: " + id + " at position " + (reader.offset - 9));
        }
        var num_of_properties = constants.magical_properties[id].np || 1;
        for (var i = 0; i < num_of_properties; i++) {
            var prop = constants.magical_properties[id + i];
            if (prop == null) {
                throw new Error("Cannot find Magical Property for id: " + id + " at position " + reader.offset);
            }
            if (prop.sP) {
                var param = reader.ReadUInt32(prop.sP);
                switch (prop.dF) {
                    case 14: //+skill to skilltab
                        values.push(param & 0x7);
                        param = (param >> 3) & 0x1fff;
                        break;
                    default:
                        break;
                }
                //encode
                switch (prop.e) {
                    case 1:
                        //throw new Error(`Unimplemented encoding: ${prop.encode}`);
                        break;
                    case 2: //chance to cast
                    case 3: //charges
                        values.push(param & 0x3f); //skill level
                        param = (param >> 6) & 0x3ff; //skll id
                        break;
                    default:
                        break;
                }
                values.push(param);
            }
            if (!prop.sB) {
                throw new Error("Save Bits is undefined for stat: " + id + ":" + prop.s + " at position " + reader.offset);
            }
            var v = reader.ReadUInt32(prop.sB);
            if (prop.sA) {
                v -= prop.sA;
            }
            switch (prop.e) {
                case 3:
                    values.push(v & 0xff); // current charges
                    values.push((v >> 8) & 0xff); //max charges
                    break;
                default:
                    values.push(v);
                    break;
            }
        }
        magic_attributes.push({
            id: id,
            values: values,
            name: constants.magical_properties[id].s,
        });
        id = reader.ReadUInt16(9);
    }
    return magic_attributes;
}
exports._readMagicProperties = _readMagicProperties;
function _writeMagicProperties(writer, properties, constants) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            var valueIdx = 0;
            writer.WriteUInt16(property.id, 9);
            var num_of_properties = constants.magical_properties[property.id].np || 1;
            for (var j = 0; j < num_of_properties; j++) {
                var prop = constants.magical_properties[property.id + j];
                if (prop == null) {
                    throw new Error("Cannot find Magical Property for id: " + property.id);
                }
                if (prop.sP) {
                    var param = property.values[valueIdx++];
                    switch (prop.dF) {
                        case 14: //+skill to skilltab
                            param |= (property.values[valueIdx++] & 0x1fff) << 3;
                            break;
                        default:
                            break;
                    }
                    //encode
                    switch (prop.e) {
                        case 1:
                            //throw new Error(`Unimplemented encoding: ${prop.encode}`);
                            break;
                        case 2: //chance to cast
                        case 3: //charges
                            param |= (property.values[valueIdx++] & 0x3ff) << 6;
                            break;
                        default:
                            break;
                    }
                    writer.WriteUInt32(param, prop.sP);
                }
                var v = property.values[valueIdx++];
                if (prop.sA) {
                    v += prop.sA;
                }
                switch (prop.e) {
                    case 3:
                        v |= (property.values[valueIdx++] & 0xff) << 8;
                        break;
                    default:
                        break;
                }
                if (!prop.sB) {
                    throw new Error("Save Bits is undefined for stat: " + property.id + ":" + prop.s);
                }
                writer.WriteUInt32(v, prop.sB);
            }
        }
    }
    writer.WriteUInt16(0x1ff, 9);
}
exports._writeMagicProperties = _writeMagicProperties;
function _GetItemTXT(item, constants) {
    if (constants.armor_items[item.type]) {
        return constants.armor_items[item.type];
    }
    else if (constants.weapon_items[item.type]) {
        return constants.weapon_items[item.type];
    }
    else if (constants.other_items[item.type]) {
        return constants.other_items[item.type];
    }
}


/***/ }),

/***/ "./src/d2/skills.ts":
/*!**************************!*\
  !*** ./src/d2/skills.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSkills = exports.readSkills = void 0;
var bitwriter_1 = __webpack_require__(/*! ../binary/bitwriter */ "./src/binary/bitwriter.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/d2/constants.ts");
function readSkills(char, reader, mod) {
    var constants = constants_1.getConstantData(mod, char.header.version);
    char.skills = [];
    var offset = SkillOffset[char.header.class];
    var header = reader.ReadString(2); //0x0000 [skills header = 0x69, 0x66 "if"]
    if (header !== "if") {
        // header is not present in first save after char is created
        if (char.header.level === 1) {
            return; // TODO: return starter skills based on class
        }
        throw new Error("Skills header 'if' not found at position " + (reader.offset - 2 * 8));
    }
    for (var i = 0; i < 30; i++) {
        var id = offset + i;
        char.skills.push({
            id: id,
            points: reader.ReadUInt8(),
            name: constants.skills[id].s,
        });
    }
}
exports.readSkills = readSkills;
function writeSkills(char) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, i;
        return __generator(this, function (_a) {
            writer = new bitwriter_1.BitWriter();
            writer.WriteString("if", 2); //0x0000 [skills header = 0x69, 0x66 "if"]
            //probably array length checking/sorting of skills by id...
            for (i = 0; i < 30; i++) {
                writer.WriteUInt8(char.skills[i].points);
            }
            return [2 /*return*/, writer.ToArray()];
        });
    });
}
exports.writeSkills = writeSkills;
var SkillOffset = {
    Amazon: 6,
    Sorceress: 36,
    Necromancer: 66,
    Paladin: 96,
    Barbarian: 126,
    Druid: 221,
    Assassin: 251,
};


/***/ }),

/***/ "./src/d2/types.ts":
/*!*************************!*\
  !*** ./src/d2/types.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EItemQuality = exports.EStashType = void 0;
var EStashType;
(function (EStashType) {
    EStashType[EStashType["shared"] = 0] = "shared";
    EStashType[EStashType["private"] = 1] = "private";
})(EStashType = exports.EStashType || (exports.EStashType = {}));
var EItemQuality;
(function (EItemQuality) {
    EItemQuality[EItemQuality["normal"] = 0] = "normal";
    EItemQuality[EItemQuality["exceptional"] = 1] = "exceptional";
    EItemQuality[EItemQuality["elite"] = 2] = "elite";
})(EItemQuality = exports.EItemQuality || (exports.EItemQuality = {}));


/***/ }),

/***/ "./src/d2/versions/default_header.ts":
/*!*******************************************!*\
  !*** ./src/d2/versions/default_header.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.writeHeader = exports.readHeader = void 0;
var bitreader_1 = __webpack_require__(/*! ../../binary/bitreader */ "./src/binary/bitreader.ts");
var bitwriter_1 = __webpack_require__(/*! ../../binary/bitwriter */ "./src/binary/bitwriter.ts");
var difficulties = ["normal", "nm", "hell"];
function readHeader(char, reader, constants) {
    var _a, _b, _c, _d;
    char.header.filesize = reader.ReadUInt32(); //0x0008
    char.header.checksum = reader.ReadUInt32().toString(16).padStart(8, "0"); //0x000c
    reader.SkipBytes(4); //0x0010
    if (char.header.version > 0x61) {
        reader.SeekByte(267);
    }
    char.header.name = reader.ReadString(16).replace(/\0/g, ""); //0x0014
    if (char.header.version > 0x61) {
        reader.SeekByte(36);
    }
    char.header.status = _readStatus(reader.ReadUInt8()); //0x0024
    char.header.progression = reader.ReadUInt8(); //0x0025
    char.header.active_arms = reader.ReadUInt16(); //0x0026 [unk = 0x0, 0x0]
    char.header.class = constants.classes[reader.ReadUInt8()].n; //0x0028
    reader.SkipBytes(2); //0x0029 [unk = 0x10, 0x1E]
    char.header.level = reader.ReadUInt8(); //0x002b
    char.header.created = reader.ReadUInt32(); //0x002c
    char.header.last_played = reader.ReadUInt32(); //0x0030
    reader.SkipBytes(4); //0x0034 [unk = 0xff, 0xff, 0xff, 0xff]
    char.header.assigned_skills = _readAssignedSkills(reader.ReadArray(64), constants); //0x0038
    char.header.left_skill = (_a = constants.skills[reader.ReadUInt32()]) === null || _a === void 0 ? void 0 : _a.s; //0x0078
    char.header.right_skill = (_b = constants.skills[reader.ReadUInt32()]) === null || _b === void 0 ? void 0 : _b.s; //0x007c
    char.header.left_swap_skill = (_c = constants.skills[reader.ReadUInt32()]) === null || _c === void 0 ? void 0 : _c.s; //0x0080
    char.header.right_swap_skill = (_d = constants.skills[reader.ReadUInt32()]) === null || _d === void 0 ? void 0 : _d.s; //0x0084
    char.header.menu_appearance = _readCharMenuAppearance(reader.ReadArray(32), constants); //0x0088 [char menu appearance]
    char.header.difficulty = _readDifficulty(reader.ReadArray(3)); //0x00a8
    char.header.map_id = reader.ReadUInt32(); //0x00ab
    reader.SkipBytes(2); //0x00af [unk = 0x0, 0x0]
    char.header.dead_merc = reader.ReadUInt16(); //0x00b1
    char.header.merc_id = reader.ReadUInt32().toString(16); //0x00b3
    char.header.merc_name_id = reader.ReadUInt16(); //0x00b7
    char.header.merc_type = reader.ReadUInt16(); //0x00b9
    char.header.merc_experience = reader.ReadUInt32(); //0x00bb
    reader.SkipBytes(144); //0x00bf [unk]
    reader.SkipBytes(4); //0x014f [quests header identifier = 0x57, 0x6f, 0x6f, 0x21 "Woo!"]
    reader.SkipBytes(4); //0x0153 [version = 0x6, 0x0, 0x0, 0x0]
    reader.SkipBytes(2); //0x0153 [quests header length = 0x2a, 0x1]
    char.header.quests_normal = _readQuests(reader.ReadArray(96)); //0x0159
    char.header.quests_nm = _readQuests(reader.ReadArray(96)); //0x01b9
    char.header.quests_hell = _readQuests(reader.ReadArray(96)); //0x0219
    reader.SkipBytes(2); //0x0279 [waypoint header identifier = 0x57, 0x53 "WS"]
    reader.SkipBytes(4); //0x027b [waypoint header version = 0x1, 0x0, 0x0, 0x0]
    reader.SkipBytes(2); //0x027f [waypoint header length = 0x50, 0x0]
    char.header.waypoints = _readWaypointData(reader.ReadArray(0x48)); //0x0281
    reader.SkipBytes(2); //0x02c9 [npc header identifier  = 0x01, 0x77 ".w"]
    reader.SkipBytes(2); //0x02ca [npc header length = 0x34]
    char.header.npcs = _readNPCData(reader.ReadArray(0x30)); //0x02cc
}
exports.readHeader = readHeader;
function writeHeader(char, writer, constants) {
    writer
        .WriteUInt32(0x0) //0x0008 (filesize. needs to be writen after all data)
        .WriteUInt32(0x0); //0x000c (checksum. needs to be calculated after all data writer)
    if (char.header.version > 0x61) {
        writer.WriteArray(new Uint8Array(Array(20).fill(0))); // 0x0010
    }
    else {
        writer
            .WriteArray(new Uint8Array([0x00, 0x00, 0x00, 0x00])) //0x0010
            .WriteString(char.header.name, 16); //0x0014
    }
    writer
        .WriteArray(_writeStatus(char.header.status)) //0x0024
        .WriteUInt8(char.header.progression) //0x0025
        .WriteUInt16(char.header.active_arms) //0x0026
        .WriteUInt8(_classId(char.header.class, constants)) //0x0028
        .WriteArray(new Uint8Array([0x10, 0x1e])) //0x0029
        .WriteUInt8(char.header.level) //0x002b
        .WriteArray(new Uint8Array([0x00, 0x00, 0x00, 0x00])) //0x002c
        .WriteUInt32(char.header.last_played) //0x0030
        .WriteArray(new Uint8Array([0xff, 0xff, 0xff, 0xff])) //0x0034
        .WriteArray(_writeAssignedSkills(char.header.assigned_skills, constants)) //0x0038
        .WriteUInt32(_skillId(char.header.left_skill, constants)) //0x0078
        .WriteUInt32(_skillId(char.header.right_skill, constants)) //0x007c
        .WriteUInt32(_skillId(char.header.left_swap_skill, constants)) //0x0080
        .WriteUInt32(_skillId(char.header.right_swap_skill, constants)) //0x0084
        .WriteArray(_writeCharMenuAppearance(char.header.menu_appearance, constants)) //0x0088 [char menu appearance]
        .WriteArray(_writeDifficulty(char.header.difficulty)) //0x00a8
        .WriteUInt32(char.header.map_id) //0x00ab
        .WriteArray(new Uint8Array([0x00, 0x00])) //0x00af [unk = 0x0, 0x0]
        .WriteUInt16(char.header.dead_merc) //0x00b1
        .WriteUInt32(parseInt(char.header.merc_id, 16)) //0x00b3
        .WriteUInt16(char.header.merc_name_id) //0x00b7
        .WriteUInt16(char.header.merc_type) //0x00b9
        .WriteUInt32(char.header.merc_experience); //0x00bb
    if (char.header.version > 0x61) {
        writer
            .WriteArray(new Uint8Array(76)) //0x00bf [unk]
            .WriteString(char.header.name, 16) //0x010b
            .WriteArray(new Uint8Array(52)); //0x011b [unk]
    }
    else {
        writer
            .WriteArray(new Uint8Array(140)) //0x00bf [unk]
            .WriteUInt32(0x1); //0x014b [unk = 0x1, 0x0, 0x0, 0x0]
    }
    writer
        .WriteString("Woo!", 4) //0x014f [quests = 0x57, 0x6f, 0x6f, 0x21 "Woo!"]
        .WriteArray(new Uint8Array([0x06, 0x00, 0x00, 0x00, 0x2a, 0x01])) //0x0153 [unk = 0x6, 0x0, 0x0, 0x0, 0x2a, 0x1]
        .WriteArray(_writeQuests(char.header.quests_normal)) //0x0159
        .WriteArray(_writeQuests(char.header.quests_nm)) //0x01b9
        .WriteArray(_writeQuests(char.header.quests_hell)) //0x0219
        .WriteString("WS", 2) //0x0279 [waypoint data = 0x57, 0x53 "WS"]
        .WriteArray(new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x50, 0x00])) //0x027b [unk = 0x1, 0x0, 0x0, 0x0, 0x50, 0x0]
        .WriteArray(_writeWaypointData(char.header.waypoints)) //0x0281
        .WriteArray(new Uint8Array([0x01, 0x77])) //0x02c9 [npc header = 0x01, 0x77 ".w"]
        .WriteUInt16(0x34) //0x02ca [npc struct length]
        .WriteArray(_writeNPCData(char.header.npcs)); //0x02cc [npc introduction data... unk]
}
exports.writeHeader = writeHeader;
function _classId(name, constants) {
    if (!name)
        return -1;
    return constants.classes.findIndex(function (c) { return c && c.n == name; });
}
function _skillId(name, constants) {
    //default to "attack" if empty string or can't find spellname.
    if (name === "")
        return 0;
    if (!name)
        return -1;
    var idx = constants.skills.findIndex(function (s) { return s && s.s == name; });
    return idx >= 0 ? idx : 0;
}
function _readStatus(byte) {
    var status = {};
    status.hardcore = ((byte >>> 2) & 1) === 1;
    status.died = ((byte >>> 3) & 1) === 1;
    status.expansion = ((byte >>> 5) & 1) === 1;
    status.ladder = ((byte >>> 6) & 1) === 1;
    return status;
}
function _writeStatus(status) {
    var arr = new Uint8Array(1);
    arr[0] |= status.hardcore ? 1 << 2 : 0;
    arr[0] |= status.died ? 1 << 3 : 0;
    arr[0] |= status.expansion ? 1 << 5 : 0;
    arr[0] |= status.ladder ? 1 << 6 : 0;
    return arr;
}
function _readCharMenuAppearance(bytes, constants) {
    var appearance = {};
    var reader = new bitreader_1.BitReader(bytes);
    var graphics = reader.ReadArray(16);
    var tints = reader.ReadArray(16);
    appearance.head = { graphic: graphics[0], tint: tints[0] };
    appearance.torso = { graphic: graphics[1], tint: tints[1] };
    appearance.legs = { graphic: graphics[2], tint: tints[2] };
    appearance.right_arm = { graphic: graphics[3], tint: tints[3] };
    appearance.left_arm = { graphic: graphics[4], tint: tints[4] };
    appearance.right_hand = { graphic: graphics[5], tint: tints[5] };
    appearance.left_hand = { graphic: graphics[6], tint: tints[6] };
    appearance.shield = { graphic: graphics[7], tint: tints[7] };
    appearance.special1 = { graphic: graphics[8], tint: tints[8] };
    appearance.special2 = { graphic: graphics[9], tint: tints[9] };
    appearance.special3 = { graphic: graphics[10], tint: tints[10] };
    appearance.special4 = { graphic: graphics[11], tint: tints[11] };
    appearance.special5 = { graphic: graphics[12], tint: tints[12] };
    appearance.special6 = { graphic: graphics[13], tint: tints[13] };
    appearance.special7 = { graphic: graphics[14], tint: tints[14] };
    appearance.special8 = { graphic: graphics[15], tint: tints[15] };
    return appearance;
}
function _writeCharMenuAppearance(appearance, constants) {
    var writer = new bitwriter_1.BitWriter(32);
    writer.length = 32 * 8;
    var graphics = [];
    graphics.push(appearance && appearance.head ? appearance.head.graphic : 0);
    graphics.push(appearance && appearance.torso ? appearance.torso.graphic : 0);
    graphics.push(appearance && appearance.legs ? appearance.legs.graphic : 0);
    graphics.push(appearance && appearance.right_arm ? appearance.right_arm.graphic : 0);
    graphics.push(appearance && appearance.left_arm ? appearance.left_arm.graphic : 0);
    graphics.push(appearance && appearance.right_hand ? appearance.right_hand.graphic : 0);
    graphics.push(appearance && appearance.left_hand ? appearance.left_hand.graphic : 0);
    graphics.push(appearance && appearance.shield ? appearance.shield.graphic : 0);
    graphics.push(appearance && appearance.special1 ? appearance.special1.graphic : 0);
    graphics.push(appearance && appearance.special2 ? appearance.special2.graphic : 0);
    graphics.push(appearance && appearance.special3 ? appearance.special3.graphic : 0);
    graphics.push(appearance && appearance.special4 ? appearance.special4.graphic : 0);
    graphics.push(appearance && appearance.special5 ? appearance.special5.graphic : 0);
    graphics.push(appearance && appearance.special6 ? appearance.special6.graphic : 0);
    graphics.push(appearance && appearance.special7 ? appearance.special7.graphic : 0);
    graphics.push(appearance && appearance.special8 ? appearance.special8.graphic : 0);
    for (var _i = 0, graphics_1 = graphics; _i < graphics_1.length; _i++) {
        var g = graphics_1[_i];
        writer.WriteUInt8(g);
    }
    var tints = [];
    tints.push(appearance && appearance.head ? appearance.head.tint : 0);
    tints.push(appearance && appearance.torso ? appearance.torso.tint : 0);
    tints.push(appearance && appearance.legs ? appearance.legs.tint : 0);
    tints.push(appearance && appearance.right_arm ? appearance.right_arm.tint : 0);
    tints.push(appearance && appearance.left_arm ? appearance.left_arm.tint : 0);
    tints.push(appearance && appearance.right_hand ? appearance.right_hand.tint : 0);
    tints.push(appearance && appearance.left_hand ? appearance.left_hand.tint : 0);
    tints.push(appearance && appearance.shield ? appearance.shield.tint : 0);
    tints.push(appearance && appearance.special1 ? appearance.special1.tint : 0);
    tints.push(appearance && appearance.special2 ? appearance.special2.tint : 0);
    tints.push(appearance && appearance.special3 ? appearance.special3.tint : 0);
    tints.push(appearance && appearance.special4 ? appearance.special4.tint : 0);
    tints.push(appearance && appearance.special5 ? appearance.special5.tint : 0);
    tints.push(appearance && appearance.special6 ? appearance.special6.tint : 0);
    tints.push(appearance && appearance.special7 ? appearance.special7.tint : 0);
    tints.push(appearance && appearance.special8 ? appearance.special8.tint : 0);
    for (var _a = 0, tints_1 = tints; _a < tints_1.length; _a++) {
        var t = tints_1[_a];
        writer.WriteUInt8(t);
    }
    return writer.ToArray();
}
function _readAssignedSkills(bytes, constants) {
    var skills = [];
    var reader = new bitreader_1.BitReader(bytes);
    for (var i = 0; i < 16; i++) {
        var skillId = reader.ReadUInt32();
        var skill = constants.skills[skillId];
        if (skill) {
            skills.push(skill.s);
        }
    }
    return skills;
}
function _writeAssignedSkills(skills, constants) {
    var writer = new bitwriter_1.BitWriter(64);
    writer.length = 64 * 8;
    skills = skills || [];
    for (var i = 0; i < 16; i++) {
        var skillId = _skillId(skills[i], constants);
        if (skillId > 0) {
            writer.WriteUInt32(skillId);
        }
        else {
            writer.WriteUInt32(0xffff);
        }
    }
    return writer.ToArray();
}
function _readDifficulty(bytes) {
    var difficulty = {};
    difficulty.Normal = bytes[0];
    difficulty.Nightmare = bytes[1];
    difficulty.Hell = bytes[2];
    return difficulty;
}
function _writeDifficulty(difficulty) {
    var writer = new bitwriter_1.BitWriter(3);
    writer.length = 3 * 8;
    writer.WriteUInt8(difficulty.Normal);
    writer.WriteUInt8(difficulty.Nightmare);
    writer.WriteUInt8(difficulty.Hell);
    return writer.ToArray();
}
function _readQuests(bytes) {
    var quests = {};
    var reader = new bitreader_1.BitReader(bytes);
    quests.act_i = {};
    quests.act_i.introduced = reader.ReadUInt16() === 0x1; //0x0000
    quests.act_i.den_of_evil = _readQuest(reader.ReadArray(2)); //0x0002
    quests.act_i.sisters_burial_grounds = _readQuest(reader.ReadArray(2));
    quests.act_i.tools_of_the_trade = _readQuest(reader.ReadArray(2));
    quests.act_i.the_search_for_cain = _readQuest(reader.ReadArray(2));
    quests.act_i.the_forgotten_tower = _readQuest(reader.ReadArray(2));
    quests.act_i.sisters_to_the_slaughter = _readQuest(reader.ReadArray(2));
    quests.act_i.completed = reader.ReadUInt16() === 0x1;
    quests.act_ii = {};
    quests.act_ii.introduced = reader.ReadUInt16() === 0x1; //0x0010 [if jerhyn introduction = 0x01]
    quests.act_ii.radaments_lair = _readQuest(reader.ReadArray(2)); //0x0012
    quests.act_ii.the_horadric_staff = _readQuest(reader.ReadArray(2));
    quests.act_ii.tainted_sun = _readQuest(reader.ReadArray(2));
    quests.act_ii.arcane_sanctuary = _readQuest(reader.ReadArray(2));
    quests.act_ii.the_summoner = _readQuest(reader.ReadArray(2));
    quests.act_ii.the_seven_tombs = _readQuest(reader.ReadArray(2));
    quests.act_ii.completed = reader.ReadUInt16() === 0x1; //0x001e
    quests.act_iii = {};
    quests.act_iii.introduced = reader.ReadUInt16() === 0x1; //0x0020 [if hratli introduction = 0x01]
    quests.act_iii.lam_esens_tome = _readQuest(reader.ReadArray(2)); //0x0022
    quests.act_iii.khalims_will = _readQuest(reader.ReadArray(2));
    quests.act_iii.blade_of_the_old_religion = _readQuest(reader.ReadArray(2));
    quests.act_iii.the_golden_bird = _readQuest(reader.ReadArray(2));
    quests.act_iii.the_blackened_temple = _readQuest(reader.ReadArray(2));
    quests.act_iii.the_guardian = _readQuest(reader.ReadArray(2));
    quests.act_iii.completed = reader.ReadUInt16() === 0x1; //0x002e
    quests.act_iv = {};
    quests.act_iv.introduced = reader.ReadUInt16() === 0x1; //0x0030 [if activ introduction = 0x01]
    quests.act_iv.the_fallen_angel = _readQuest(reader.ReadArray(2)); //0x0032
    quests.act_iv.terrors_end = _readQuest(reader.ReadArray(2));
    quests.act_iv.hellforge = _readQuest(reader.ReadArray(2));
    quests.act_iv.completed = reader.ReadUInt16() === 0x1; //0x0038
    reader.SkipBytes(10); //0x003a
    quests.act_v = {};
    quests.act_v.introduced = reader.ReadUInt16() === 0x1;
    quests.act_v.siege_on_harrogath = _readQuest(reader.ReadArray(2)); //0x0046
    quests.act_v.rescue_on_mount_arreat = _readQuest(reader.ReadArray(2));
    quests.act_v.prison_of_ice = _readQuest(reader.ReadArray(2));
    quests.act_v.betrayal_of_harrogath = _readQuest(reader.ReadArray(2));
    quests.act_v.rite_of_passage = _readQuest(reader.ReadArray(2));
    quests.act_v.eve_of_destruction = _readQuest(reader.ReadArray(2));
    quests.act_v.completed = reader.ReadUInt16() === 0x1;
    reader.SkipBytes(12);
    return quests; //sizeof [0x0060]
}
function _writeQuests(quests) {
    var writer = new bitwriter_1.BitWriter(96);
    writer.length = 96 * 8;
    var difficultyCompleted = +quests.act_v.completed || +quests.act_v.eve_of_destruction.b0_is_completed;
    return writer
        .WriteUInt16(+quests.act_i.introduced)
        .WriteArray(_writeQuest(quests.act_i.den_of_evil))
        .WriteArray(_writeQuest(quests.act_i.sisters_burial_grounds))
        .WriteArray(_writeQuest(quests.act_i.tools_of_the_trade))
        .WriteArray(_writeQuest(quests.act_i.the_search_for_cain))
        .WriteArray(_writeQuest(quests.act_i.the_forgotten_tower))
        .WriteArray(_writeQuest(quests.act_i.sisters_to_the_slaughter))
        .WriteUInt16(+quests.act_i.completed || +quests.act_i.sisters_to_the_slaughter.b0_is_completed)
        .WriteUInt16(+quests.act_ii.introduced || +quests.act_i.sisters_to_the_slaughter.b0_is_completed)
        .WriteArray(_writeQuest(quests.act_ii.radaments_lair))
        .WriteArray(_writeQuest(quests.act_ii.the_horadric_staff))
        .WriteArray(_writeQuest(quests.act_ii.tainted_sun))
        .WriteArray(_writeQuest(quests.act_ii.arcane_sanctuary))
        .WriteArray(_writeQuest(quests.act_ii.the_summoner))
        .WriteArray(_writeQuest(quests.act_ii.the_seven_tombs))
        .WriteUInt16(+quests.act_ii.completed || +quests.act_ii.the_seven_tombs.b0_is_completed)
        .WriteUInt16(+quests.act_iii.introduced || +quests.act_ii.the_seven_tombs.b0_is_completed)
        .WriteArray(_writeQuest(quests.act_iii.lam_esens_tome))
        .WriteArray(_writeQuest(quests.act_iii.khalims_will))
        .WriteArray(_writeQuest(quests.act_iii.blade_of_the_old_religion))
        .WriteArray(_writeQuest(quests.act_iii.the_golden_bird))
        .WriteArray(_writeQuest(quests.act_iii.the_blackened_temple))
        .WriteArray(_writeQuest(quests.act_iii.the_guardian))
        .WriteUInt16(+quests.act_iii.completed || +quests.act_iii.the_guardian.b0_is_completed)
        .WriteUInt16(+quests.act_iv.introduced || +quests.act_iii.the_guardian.b0_is_completed)
        .WriteArray(_writeQuest(quests.act_iv.the_fallen_angel))
        .WriteArray(_writeQuest(quests.act_iv.terrors_end))
        .WriteArray(_writeQuest(quests.act_iv.hellforge))
        .WriteUInt16(+quests.act_iv.completed || +quests.act_iv.terrors_end.b0_is_completed)
        .WriteArray(new Uint8Array(6))
        .WriteUInt16(+quests.act_v.introduced || +quests.act_iv.terrors_end.b0_is_completed)
        .WriteArray(new Uint8Array(4))
        .WriteArray(_writeQuest(quests.act_v.siege_on_harrogath))
        .WriteArray(_writeQuest(quests.act_v.rescue_on_mount_arreat))
        .WriteArray(_writeQuest(quests.act_v.prison_of_ice))
        .WriteArray(_writeQuest(quests.act_v.betrayal_of_harrogath))
        .WriteArray(_writeQuest(quests.act_v.rite_of_passage))
        .WriteArray(_writeQuest(quests.act_v.eve_of_destruction))
        .WriteUInt8(difficultyCompleted)
        .WriteUInt8(difficultyCompleted ? 0x80 : 0x0) //is this right?
        .WriteArray(new Uint8Array(12))
        .ToArray();
}
function _readQuest(bytes) {
    var quest = {};
    var reader = new bitreader_1.BitReader(bytes);
    quest.b0_is_completed = reader.ReadBit() === 1;
    quest.b1_is_requirement_completed = reader.ReadBit() === 1;
    quest.b2_is_received = reader.ReadBit() === 1;
    if (reader.ReadBit() === 1)
        quest.b3_left_town = true;
    if (reader.ReadBit() === 1)
        quest.b4_entered_area = true;
    if (reader.ReadBit() === 1)
        quest.b5_custom1 = true;
    if (reader.ReadBit() === 1)
        quest.b6_custom2 = true;
    if (reader.ReadBit() === 1)
        quest.b7_custom3 = true;
    if (reader.ReadBit() === 1)
        quest.b8_custom4 = true;
    if (reader.ReadBit() === 1)
        quest.b9_custom5 = true;
    if (reader.ReadBit() === 1)
        quest.b10_custom6 = true;
    if (reader.ReadBit() === 1)
        quest.b11_custom7 = true;
    quest.b12_closed = reader.ReadBit() === 1;
    quest.b13_done_recently = reader.ReadBit() === 1;
    if (reader.ReadBit() === 1)
        quest.b14_completed_now = true;
    if (reader.ReadBit() === 1)
        quest.b15_completed_before = true;
    return quest;
}
function _writeQuest(quest) {
    var writer = new bitwriter_1.BitWriter(2);
    writer.length = 2 * 8;
    writer.WriteBit(+quest.b0_is_completed);
    writer.WriteBit(+quest.b1_is_requirement_completed);
    writer.WriteBit(+quest.b2_is_received);
    writer.WriteBit(+quest.b3_left_town);
    writer.WriteBit(+quest.b4_entered_area);
    writer.WriteBit(+quest.b5_custom1);
    writer.WriteBit(+quest.b6_custom2);
    writer.WriteBit(+quest.b7_custom3);
    writer.WriteBit(+quest.b8_custom4);
    writer.WriteBit(+quest.b9_custom5);
    writer.WriteBit(+quest.b10_custom6);
    writer.WriteBit(+quest.b11_custom7);
    writer.WriteBit(+quest.b12_closed);
    writer.WriteBit(+quest.b13_done_recently);
    writer.WriteBit(+quest.b14_completed_now);
    writer.WriteBit(+quest.b15_completed_before);
    return writer.ToArray();
}
function _readWaypointData(bytes) {
    var waypoints = {};
    var reader = new bitreader_1.BitReader(bytes);
    for (var i = 0; i < difficulties.length; i++) {
        waypoints[difficulties[i]] = _readWaypoints(reader.ReadArray(24));
    }
    return waypoints;
}
function _readWaypoints(bytes) {
    var waypoints = {};
    var reader = new bitreader_1.BitReader(bytes);
    reader.SkipBytes(2); //unk = 0x2, 0x
    waypoints.act_i = {};
    waypoints.act_i.rogue_encampement = reader.ReadBit() === 1;
    waypoints.act_i.cold_plains = reader.ReadBit() === 1;
    waypoints.act_i.stony_field = reader.ReadBit() === 1;
    waypoints.act_i.dark_woods = reader.ReadBit() === 1;
    waypoints.act_i.black_marsh = reader.ReadBit() === 1;
    waypoints.act_i.outer_cloister = reader.ReadBit() === 1;
    waypoints.act_i.jail_lvl_1 = reader.ReadBit() === 1;
    waypoints.act_i.inner_cloister = reader.ReadBit() === 1;
    waypoints.act_i.catacombs_lvl_2 = reader.ReadBit() === 1;
    waypoints.act_ii = {};
    waypoints.act_ii.lut_gholein = reader.ReadBit() === 1;
    waypoints.act_ii.sewers_lvl_2 = reader.ReadBit() === 1;
    waypoints.act_ii.dry_hills = reader.ReadBit() === 1;
    waypoints.act_ii.halls_of_the_dead_lvl_2 = reader.ReadBit() === 1;
    waypoints.act_ii.far_oasis = reader.ReadBit() === 1;
    waypoints.act_ii.lost_city = reader.ReadBit() === 1;
    waypoints.act_ii.palace_cellar_lvl_1 = reader.ReadBit() === 1;
    waypoints.act_ii.arcane_sanctuary = reader.ReadBit() === 1;
    waypoints.act_ii.canyon_of_the_magi = reader.ReadBit() === 1;
    waypoints.act_iii = {};
    waypoints.act_iii.kurast_docks = reader.ReadBit() === 1;
    waypoints.act_iii.spider_forest = reader.ReadBit() === 1;
    waypoints.act_iii.great_marsh = reader.ReadBit() === 1;
    waypoints.act_iii.flayer_jungle = reader.ReadBit() === 1;
    waypoints.act_iii.lower_kurast = reader.ReadBit() === 1;
    waypoints.act_iii.kurast_bazaar = reader.ReadBit() === 1;
    waypoints.act_iii.upper_kurast = reader.ReadBit() === 1;
    waypoints.act_iii.travincal = reader.ReadBit() === 1;
    waypoints.act_iii.durance_of_hate_lvl_2 = reader.ReadBit() === 1;
    waypoints.act_iv = {};
    waypoints.act_iv.the_pandemonium_fortress = reader.ReadBit() === 1;
    waypoints.act_iv.city_of_the_damned = reader.ReadBit() === 1;
    waypoints.act_iv.river_of_flame = reader.ReadBit() === 1;
    waypoints.act_v = {};
    waypoints.act_v.harrogath = reader.ReadBit() === 1;
    waypoints.act_v.frigid_highlands = reader.ReadBit() === 1;
    waypoints.act_v.arreat_plateau = reader.ReadBit() === 1;
    waypoints.act_v.crystalline_passage = reader.ReadBit() === 1;
    waypoints.act_v.halls_of_pain = reader.ReadBit() === 1;
    waypoints.act_v.glacial_trail = reader.ReadBit() === 1;
    waypoints.act_v.frozen_tundra = reader.ReadBit() === 1;
    waypoints.act_v.the_ancients_way = reader.ReadBit() === 1;
    waypoints.act_v.worldstone_keep_lvl_2 = reader.ReadBit() === 1;
    reader.Align().SkipBytes(17);
    return waypoints;
}
function _writeWaypointData(waypoints) {
    var writer = new bitwriter_1.BitWriter(72);
    writer.length = 72 * 8;
    for (var i = 0; i < difficulties.length; i++) {
        var w = waypoints != null ? waypoints[difficulties[i]] : null;
        writer.WriteArray(_writeWaypoints(w));
    }
    return writer.ToArray();
}
function _writeWaypoints(waypoints) {
    var writer = new bitwriter_1.BitWriter(24);
    writer.length = 24 * 8;
    writer.WriteArray(new Uint8Array([0x02, 0x01]));
    if (waypoints) {
        if (waypoints.act_i) {
            writer.WriteBit(+waypoints.act_i.rogue_encampement);
            writer.WriteBit(+waypoints.act_i.cold_plains);
            writer.WriteBit(+waypoints.act_i.stony_field);
            writer.WriteBit(+waypoints.act_i.dark_woods);
            writer.WriteBit(+waypoints.act_i.black_marsh);
            writer.WriteBit(+waypoints.act_i.outer_cloister);
            writer.WriteBit(+waypoints.act_i.jail_lvl_1);
            writer.WriteBit(+waypoints.act_i.inner_cloister);
            writer.WriteBit(+waypoints.act_i.catacombs_lvl_2);
        }
        if (waypoints.act_ii) {
            writer.WriteBit(+waypoints.act_ii.lut_gholein);
            writer.WriteBit(+waypoints.act_ii.sewers_lvl_2);
            writer.WriteBit(+waypoints.act_ii.dry_hills);
            writer.WriteBit(+waypoints.act_ii.halls_of_the_dead_lvl_2);
            writer.WriteBit(+waypoints.act_ii.far_oasis);
            writer.WriteBit(+waypoints.act_ii.lost_city);
            writer.WriteBit(+waypoints.act_ii.palace_cellar_lvl_1);
            writer.WriteBit(+waypoints.act_ii.arcane_sanctuary);
            writer.WriteBit(+waypoints.act_ii.canyon_of_the_magi);
        }
        if (waypoints.act_iii) {
            writer.WriteBit(+waypoints.act_iii.kurast_docks);
            writer.WriteBit(+waypoints.act_iii.spider_forest);
            writer.WriteBit(+waypoints.act_iii.great_marsh);
            writer.WriteBit(+waypoints.act_iii.flayer_jungle);
            writer.WriteBit(+waypoints.act_iii.lower_kurast);
            writer.WriteBit(+waypoints.act_iii.kurast_bazaar);
            writer.WriteBit(+waypoints.act_iii.upper_kurast);
            writer.WriteBit(+waypoints.act_iii.travincal);
            writer.WriteBit(+waypoints.act_iii.durance_of_hate_lvl_2);
        }
        if (waypoints.act_iv) {
            writer.WriteBit(+waypoints.act_iv.the_pandemonium_fortress);
            writer.WriteBit(+waypoints.act_iv.city_of_the_damned);
            writer.WriteBit(+waypoints.act_iv.river_of_flame);
        }
        if (waypoints.act_v) {
            writer.WriteBit(+waypoints.act_v.harrogath);
            writer.WriteBit(+waypoints.act_v.frigid_highlands);
            writer.WriteBit(+waypoints.act_v.arreat_plateau);
            writer.WriteBit(+waypoints.act_v.crystalline_passage);
            writer.WriteBit(+waypoints.act_v.halls_of_pain);
            writer.WriteBit(+waypoints.act_v.glacial_trail);
            writer.WriteBit(+waypoints.act_v.frozen_tundra);
            writer.WriteBit(+waypoints.act_v.the_ancients_way);
            writer.WriteBit(+waypoints.act_v.worldstone_keep_lvl_2);
        }
    }
    else {
        //all wps
        //writer.WriteArray(new Uint8Array(5));
        writer.WriteArray(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x7f]));
        //_writeBits(writer, 0x3fffffffff, start, 0, 38);
    }
    writer.Align().WriteArray(new Uint8Array(17));
    return writer.ToArray();
}
function _readNPCData(bytes) {
    var npcs = { normal: {}, nm: {}, hell: {} };
    var reader = new bitreader_1.BitReader(bytes);
    for (var j = 0; j < 3; j++) {
        npcs[difficulties[j]] = {
            warriv_act_ii: { intro: false, congrats: false },
            charsi: { intro: false, congrats: false },
            warriv_act_i: { intro: false, congrats: false },
            kashya: { intro: false, congrats: false },
            akara: { intro: false, congrats: false },
            gheed: { intro: false, congrats: false },
            greiz: { intro: false, congrats: false },
            jerhyn: { intro: false, congrats: false },
            meshif_act_ii: { intro: false, congrats: false },
            geglash: { intro: false, congrats: false },
            lysnader: { intro: false, congrats: false },
            fara: { intro: false, congrats: false },
            drogan: { intro: false, congrats: false },
            alkor: { intro: false, congrats: false },
            hratli: { intro: false, congrats: false },
            ashera: { intro: false, congrats: false },
            cain_act_iii: { intro: false, congrats: false },
            elzix: { intro: false, congrats: false },
            malah: { intro: false, congrats: false },
            anya: { intro: false, congrats: false },
            natalya: { intro: false, congrats: false },
            meshif_act_iii: { intro: false, congrats: false },
            ormus: { intro: false, congrats: false },
            cain_act_v: { intro: false, congrats: false },
            qualkehk: { intro: false, congrats: false },
            nihlathak: { intro: false, congrats: false },
        };
    }
    //introductions
    for (var i = 0; i < 3; i++) {
        var j = i * 5;
        var npc = npcs[difficulties[i]];
        npc.warriv_act_ii.intro = reader.bits[0 + j * 8] === 1;
        npc.charsi.intro = reader.bits[2 + j * 8] === 1;
        npc.warriv_act_i.intro = reader.bits[3 + j * 8] === 1;
        npc.kashya.intro = reader.bits[4 + j * 8] === 1;
        npc.akara.intro = reader.bits[5 + j * 8] === 1;
        npc.gheed.intro = reader.bits[6 + j * 8] === 1;
        npc.greiz.intro = reader.bits[8 + j * 8] === 1;
        npc.jerhyn.intro = reader.bits[9 + j * 8] === 1;
        npc.meshif_act_ii.intro = reader.bits[10 + j * 8] === 1;
        npc.geglash.intro = reader.bits[11 + j * 8] === 1;
        npc.lysnader.intro = reader.bits[12 + j * 8] === 1;
        npc.fara.intro = reader.bits[13 + j * 8] === 1;
        npc.drogan.intro = reader.bits[14 + j * 8] === 1;
        npc.alkor.intro = reader.bits[16 + j * 8] === 1;
        npc.hratli.intro = reader.bits[17 + j * 8] === 1;
        npc.ashera.intro = reader.bits[18 + j * 8] === 1;
        npc.cain_act_iii.intro = reader.bits[21 + j * 8] === 1;
        npc.elzix.intro = reader.bits[23 + j * 8] === 1;
        npc.malah.intro = reader.bits[24 + j * 8] === 1;
        npc.anya.intro = reader.bits[25 + j * 8] === 1;
        npc.natalya.intro = reader.bits[27 + j * 8] === 1;
        npc.meshif_act_iii.intro = reader.bits[28 + j * 8] === 1;
        npc.ormus.intro = reader.bits[31 + j * 8] === 1;
        npc.cain_act_v.intro = reader.bits[37 + j * 8] === 1;
        npc.qualkehk.intro = reader.bits[38 + j * 8] === 1;
        npc.nihlathak.intro = reader.bits[39 + j * 8] === 1;
    }
    //congrats
    for (var i = 0; i < 3; i++) {
        var j = i * 5;
        var npc = npcs[difficulties[i]];
        npc.warriv_act_ii.congrats = reader.bits[192 + (0 + j * 8)] === 1;
        npc.charsi.congrats = reader.bits[192 + (2 + j * 8)] === 1;
        npc.warriv_act_i.congrats = reader.bits[192 + (3 + j * 8)] === 1;
        npc.kashya.congrats = reader.bits[192 + (4 + j * 8)] === 1;
        npc.akara.congrats = reader.bits[192 + (5 + j * 8)] === 1;
        npc.gheed.congrats = reader.bits[192 + (6 + j * 8)] === 1;
        npc.greiz.congrats = reader.bits[192 + (8 + j * 8)] === 1;
        npc.jerhyn.congrats = reader.bits[192 + (9 + j * 8)] === 1;
        npc.meshif_act_ii.congrats = reader.bits[192 + (10 + j * 8)] === 1;
        npc.geglash.congrats = reader.bits[192 + (11 + j * 8)] === 1;
        npc.lysnader.congrats = reader.bits[192 + (12 + j * 8)] === 1;
        npc.fara.congrats = reader.bits[192 + (13 + j * 8)] === 1;
        npc.drogan.congrats = reader.bits[192 + (14 + j * 8)] === 1;
        npc.alkor.congrats = reader.bits[192 + (16 + j * 8)] === 1;
        npc.hratli.congrats = reader.bits[192 + (17 + j * 8)] === 1;
        npc.ashera.congrats = reader.bits[192 + (18 + j * 8)] === 1;
        npc.cain_act_iii.congrats = reader.bits[192 + (21 + j * 8)] === 1;
        npc.elzix.congrats = reader.bits[192 + (23 + j * 8)] === 1;
        npc.malah.congrats = reader.bits[192 + (24 + j * 8)] === 1;
        npc.anya.congrats = reader.bits[192 + (25 + j * 8)] === 1;
        npc.natalya.congrats = reader.bits[192 + (27 + j * 8)] === 1;
        npc.meshif_act_iii.congrats = reader.bits[192 + (28 + j * 8)] === 1;
        npc.ormus.congrats = reader.bits[192 + (31 + j * 8)] === 1;
        npc.cain_act_v.congrats = reader.bits[192 + (37 + j * 8)] === 1;
        npc.qualkehk.congrats = reader.bits[192 + (38 + j * 8)] === 1;
        npc.nihlathak.congrats = reader.bits[192 + (39 + j * 8)] === 1;
    }
    return npcs;
}
function _writeNPCData(npcs) {
    var writer = new bitwriter_1.BitWriter(0x30);
    writer.length = 0x30 * 8;
    if (npcs) {
        for (var j = 0; j < 3; j++) {
            var npc = npcs[difficulties[j]];
            writer.SeekByte(j * 5);
            writer.WriteBit(+npc.warriv_act_ii.intro);
            writer.WriteBit(0);
            writer.WriteBit(+npc.charsi.intro);
            writer.WriteBit(+npc.warriv_act_i.intro);
            writer.WriteBit(+npc.kashya.intro);
            writer.WriteBit(+npc.akara.intro);
            writer.WriteBit(+npc.gheed.intro);
            writer.WriteBit(0);
            writer.WriteBit(+npc.greiz.intro);
            writer.WriteBit(+npc.jerhyn.intro);
            writer.WriteBit(+npc.meshif_act_ii.intro);
            writer.WriteBit(+npc.geglash.intro);
            writer.WriteBit(+npc.lysnader.intro);
            writer.WriteBit(+npc.fara.intro);
            writer.WriteBit(+npc.drogan.intro);
            writer.WriteBit(0);
            writer.WriteBit(+npc.alkor.intro);
            writer.WriteBit(+npc.hratli.intro);
            writer.WriteBit(+npc.ashera.intro);
            writer.WriteBits(new Uint8Array(2).fill(0), 2);
            writer.WriteBit(+npc.cain_act_iii.intro);
            writer.WriteBit(0);
            writer.WriteBit(+npc.elzix.intro);
            writer.WriteBit(+npc.malah.intro);
            writer.WriteBit(+npc.anya.intro);
            writer.WriteBit(0);
            writer.WriteBit(+npc.natalya.intro);
            writer.WriteBit(+npc.meshif_act_iii.intro);
            writer.WriteBits(new Uint8Array(2).fill(0), 2);
            writer.WriteBit(+npc.ormus.intro);
            writer.WriteBits(new Uint8Array(5).fill(0), 5);
            writer.WriteBit(+npc.cain_act_v.intro);
            writer.WriteBit(+npc.qualkehk.intro);
            writer.WriteBit(+npc.nihlathak.intro);
        }
        for (var j = 0; j < 3; j++) {
            writer.SeekByte(24 + j * 5);
            var npc = npcs[difficulties[j]];
            writer.WriteBit(+npc.warriv_act_ii.congrats);
            writer.WriteBit(0);
            writer.WriteBit(+npc.charsi.congrats);
            writer.WriteBit(+npc.warriv_act_i.congrats);
            writer.WriteBit(+npc.kashya.congrats);
            writer.WriteBit(+npc.akara.congrats);
            writer.WriteBit(+npc.gheed.congrats);
            writer.WriteBit(0);
            writer.WriteBit(+npc.greiz.congrats);
            writer.WriteBit(+npc.jerhyn.congrats);
            writer.WriteBit(+npc.meshif_act_ii.congrats);
            writer.WriteBit(+npc.geglash.congrats);
            writer.WriteBit(+npc.lysnader.congrats);
            writer.WriteBit(+npc.fara.congrats);
            writer.WriteBit(+npc.drogan.congrats);
            writer.WriteBit(0);
            writer.WriteBit(+npc.alkor.congrats);
            writer.WriteBit(+npc.hratli.congrats);
            writer.WriteBit(+npc.ashera.congrats);
            writer.WriteBits(new Uint8Array(2).fill(0), 2);
            writer.WriteBit(+npc.cain_act_iii.congrats);
            writer.WriteBit(0);
            writer.WriteBit(+npc.elzix.congrats);
            writer.WriteBit(+npc.malah.congrats);
            writer.WriteBit(+npc.anya.congrats);
            writer.WriteBit(0);
            writer.WriteBit(+npc.natalya.congrats);
            writer.WriteBit(+npc.meshif_act_iii.congrats);
            writer.WriteBits(new Uint8Array(2).fill(0), 2);
            writer.WriteBit(+npc.ormus.congrats);
            writer.WriteBits(new Uint8Array(5).fill(0), 5);
            writer.WriteBit(+npc.cain_act_v.congrats);
            writer.WriteBit(+npc.qualkehk.congrats);
            writer.WriteBit(+npc.nihlathak.congrats);
        }
    }
    return writer.ToArray();
}


/***/ })

/******/ });
//# sourceMappingURL=d2s.bundle.js.map