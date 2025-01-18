"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitReader = void 0;
class BitReader {
    littleEndian = true;
    bits;
    offset = 0;
    constructor(arrBuffer) {
        const typedArray = new Uint8Array(arrBuffer);
        this.bits = new Uint8Array(typedArray.length * 8);
        typedArray.reduce((acc, c) => {
            const b = c
                .toString(2)
                .padStart(8, '0')
                .split('')
                .reverse()
                .map((e) => parseInt(e, 2));
            b.forEach((bit) => (this.bits[acc++] = bit));
            return acc;
        }, 0);
    }
    ReadBit() {
        return this.bits[this.offset++];
    }
    ReadBitArray(count) {
        const bits = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            bits[i] = this.bits[this.offset++];
        }
        return bits;
    }
    ReadBits(bytes, count) {
        let byteIndex = 0;
        let bitIndex = 0;
        for (let i = 0; i < count; i++) {
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
    }
    ReadBytes(bytes) {
        return this.ReadBits(new Uint8Array(bytes), bytes * 8);
    }
    ReadArray(bytes) {
        return this.ReadBytes(bytes);
    }
    ReadByte(bits = 8) {
        const dataview = new DataView(this.ReadBits(new Uint8Array(1), bits).buffer);
        return dataview.getUint8(0);
    }
    ReadUInt8(bits = 8) {
        return this.ReadByte(bits);
    }
    ReadUInt16(bits = 8 * 2) {
        const dataview = new DataView(this.ReadBits(new Uint8Array(2), bits).buffer);
        return dataview.getUint16(0, this.littleEndian);
    }
    ReadUInt32(bits = 8 * 4) {
        const dataview = new DataView(this.ReadBits(new Uint8Array(4), bits).buffer);
        return dataview.getUint32(0, this.littleEndian);
    }
    ReadString(bytes) {
        const buffer = this.ReadBytes(bytes).buffer;
        return new TextDecoder().decode(buffer);
    }
    ReadNullTerminatedString() {
        const start = this.offset;
        while (this.ReadByte()) { }
        const end = this.offset - 8;
        const buffer = this.SeekBit(start).ReadBytes((end - start) / 8);
        this.SeekBit(end + 8);
        return new TextDecoder().decode(buffer);
    }
    SkipBits(number) {
        this.offset += number;
        return this;
    }
    SkipBytes(number) {
        return this.SkipBits(number * 8);
    }
    SeekBit(offset) {
        this.offset = offset;
        return this;
    }
    SeekByte(offset) {
        return this.SeekBit(offset * 8);
    }
    Align() {
        this.offset = (this.offset + 7) & ~7;
        return this;
    }
}
exports.BitReader = BitReader;
