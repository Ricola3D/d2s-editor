import * as types from './types';
export declare function read(buffer: Uint8Array, mod: string): Promise<types.IStash>;
export declare function write(data: types.IStash, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array>;
