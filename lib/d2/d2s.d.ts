import * as types from './types';
import { BitReader } from '../binary/bitreader';
declare function reader(buffer: Uint8Array): BitReader;
declare function read(buffer: Uint8Array, mod: string, userConfig?: types.IConfig): Promise<types.ID2S>;
declare function readItem(buffer: ArrayBuffer, mod: string, version: number, userConfig?: types.IConfig): Promise<types.IItem>;
declare function write(data: types.ID2S, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array>;
declare function writeItem(item: types.IItem, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array>;
export { reader, read, write, readItem, writeItem };
