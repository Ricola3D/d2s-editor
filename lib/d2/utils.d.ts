import { Index, IItem, IConstantData, IMagicPropertyDef } from './types';
export declare const nameRegex: RegExp;
export declare function swapObjectKeyValue<TKeys extends Index, TValues extends Index>(obj: {
    [key in TKeys]: TValues;
}): { [key in TValues]: TKeys; };
export declare function b64StringToArrayBuffer(base64string: string): ArrayBuffer;
export declare function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string;
export declare function arrayBufferToHexString(arrayBuffer: ArrayBuffer): string;
export declare function hexStringToArrayBuffer(hexStr: string): ArrayBuffer;
export declare function getItemTypeDef(item: IItem, constants: Partial<IConstantData>): any;
export declare function getValueBitSize(itemStatDef: IMagicPropertyDef, valIdx: number): number;
export declare function getMaxValue(statId: number, valIdx: number, magical_properties: IMagicPropertyDef[]): number;
export declare function getMinValue(statId: number, valIdx: number, magical_properties: IMagicPropertyDef[]): number;
export declare function isClass(statId: number, valueIdx: number, magical_properties: IMagicPropertyDef[]): boolean;
export declare function isClassSkillTab(statId: number, valueIdx: number, magical_properties: IMagicPropertyDef[]): boolean;
export declare function isSkill(statId: number, valueIdx: number, magical_properties: IMagicPropertyDef[]): boolean;
export declare function getValueTooltip(statId: number, valueIdx: number, magical_properties: IMagicPropertyDef[]): boolean | "" | "Skill Tab" | "Class" | "Bonus Level" | "Skill Level" | "Skill" | "Current charges" | "Max charges" | "Chances to Cast" | "Min (xLength/256)" | "Min" | "Max" | "Length in frames (25frames = 1s)";
export declare function numValues(statId: number, magical_properties: IMagicPropertyDef[]): number;
export declare function shift(number: number, shift: number): number;
