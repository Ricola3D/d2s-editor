"use strict";
//todo define types for these
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGemPosition = exports.EQuality = exports.ETypeId = exports.EEquippedId = exports.ELocationId = exports.EAltPositionId = exports.EItemQuality = exports.EStashType = exports.EGemSocketType = void 0;
var EGemSocketType;
(function (EGemSocketType) {
    EGemSocketType[EGemSocketType["WeaponGloves"] = 0] = "WeaponGloves";
    EGemSocketType[EGemSocketType["ArmorBootsHelmBelt"] = 1] = "ArmorBootsHelmBelt";
    EGemSocketType[EGemSocketType["ShieldJewelry"] = 2] = "ShieldJewelry";
})(EGemSocketType || (exports.EGemSocketType = EGemSocketType = {}));
var EStashType;
(function (EStashType) {
    EStashType[EStashType["shared"] = 0] = "shared";
    EStashType[EStashType["private"] = 1] = "private";
})(EStashType || (exports.EStashType = EStashType = {}));
var EItemQuality;
(function (EItemQuality) {
    EItemQuality[EItemQuality["normal"] = 0] = "normal";
    EItemQuality[EItemQuality["exceptional"] = 1] = "exceptional";
    EItemQuality[EItemQuality["elite"] = 2] = "elite";
})(EItemQuality || (exports.EItemQuality = EItemQuality = {}));
var EAltPositionId;
(function (EAltPositionId) {
    EAltPositionId[EAltPositionId["Inventory"] = 1] = "Inventory";
    EAltPositionId[EAltPositionId["Cube"] = 4] = "Cube";
    EAltPositionId[EAltPositionId["Stash"] = 5] = "Stash";
})(EAltPositionId || (exports.EAltPositionId = EAltPositionId = {}));
var ELocationId;
(function (ELocationId) {
    ELocationId[ELocationId["Stored"] = 0] = "Stored";
    ELocationId[ELocationId["Equipped"] = 1] = "Equipped";
    ELocationId[ELocationId["Belt"] = 2] = "Belt";
    ELocationId[ELocationId["Cursor"] = 4] = "Cursor";
    ELocationId[ELocationId["Socketed"] = 6] = "Socketed";
})(ELocationId || (exports.ELocationId = ELocationId = {}));
var EEquippedId;
(function (EEquippedId) {
    EEquippedId[EEquippedId["Stored"] = 0] = "Stored";
    EEquippedId[EEquippedId["Helm"] = 1] = "Helm";
    EEquippedId[EEquippedId["Amulet"] = 2] = "Amulet";
    EEquippedId[EEquippedId["Armor"] = 3] = "Armor";
    EEquippedId[EEquippedId["RightHand"] = 4] = "RightHand";
    EEquippedId[EEquippedId["LeftHand"] = 5] = "LeftHand";
    EEquippedId[EEquippedId["RightRing"] = 6] = "RightRing";
    EEquippedId[EEquippedId["LeftRing"] = 7] = "LeftRing";
    EEquippedId[EEquippedId["Belt"] = 8] = "Belt";
    EEquippedId[EEquippedId["Boots"] = 9] = "Boots";
    EEquippedId[EEquippedId["Gloves"] = 10] = "Gloves";
    EEquippedId[EEquippedId["RightHandSwitch"] = 11] = "RightHandSwitch";
    EEquippedId[EEquippedId["LeftHandSwitch"] = 12] = "LeftHandSwitch";
    EEquippedId[EEquippedId["Unknown1"] = 13] = "Unknown1";
    EEquippedId[EEquippedId["Unknown2"] = 14] = "Unknown2";
})(EEquippedId || (exports.EEquippedId = EEquippedId = {}));
var ETypeId;
(function (ETypeId) {
    ETypeId[ETypeId["Armor"] = 1] = "Armor";
    ETypeId[ETypeId["Shield"] = 2] = "Shield";
    ETypeId[ETypeId["Weapon"] = 3] = "Weapon";
    ETypeId[ETypeId["Other"] = 4] = "Other";
})(ETypeId || (exports.ETypeId = ETypeId = {}));
var EQuality;
(function (EQuality) {
    EQuality[EQuality["Low"] = 1] = "Low";
    EQuality[EQuality["Normal"] = 2] = "Normal";
    EQuality[EQuality["Superior"] = 3] = "Superior";
    EQuality[EQuality["Magic"] = 4] = "Magic";
    EQuality[EQuality["Set"] = 5] = "Set";
    EQuality[EQuality["Rare"] = 6] = "Rare";
    EQuality[EQuality["Unique"] = 7] = "Unique";
    EQuality[EQuality["Crafted"] = 8] = "Crafted";
    EQuality[EQuality["DemonTempered"] = 9] = "DemonTempered";
})(EQuality || (exports.EQuality = EQuality = {}));
var EGemPosition;
(function (EGemPosition) {
    EGemPosition["Weapon"] = "weapon";
    EGemPosition["Helm"] = "helm";
    EGemPosition["Shield"] = "shield";
})(EGemPosition || (exports.EGemPosition = EGemPosition = {}));
