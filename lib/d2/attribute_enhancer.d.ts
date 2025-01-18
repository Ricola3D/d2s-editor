import * as types from './types';
export declare function enhanceAttributes(char: types.ID2S, mod: string, version: number, config?: types.IConfig): void;
export declare function enhancePlayerAttributes(char: types.ID2S, mod: string, version: number, config?: types.IConfig): void;
export declare function enhanceItems(items: types.IItem[], mod: string, version: number, attributes?: types.IAttributes, config?: types.IConfig, parent?: types.IItem): void;
export declare function enhanceItem(item: types.IItem, mod: string, version: number, attributes?: types.IAttributes, config?: types.IConfig, parent?: types.IItem): void;
