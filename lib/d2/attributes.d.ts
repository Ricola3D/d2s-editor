import * as types from './types';
import { BitReader } from '../binary/bitreader';
export declare function readAttributes(char: types.ID2S, reader: BitReader, mod: string): void;
export declare function writeAttributes(char: types.ID2S, constants: types.IConstantData): Promise<Uint8Array>;
