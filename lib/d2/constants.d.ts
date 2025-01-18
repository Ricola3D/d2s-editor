import * as types from './types';
declare function getConstantData(mod: string, version: number): types.IConstantData;
declare function setConstantData(mod: string, version: number, data: types.IConstantData): void;
export { getConstantData, setConstantData };
