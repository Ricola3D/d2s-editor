"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitWriter = void 0;
class BitWriter {
    littleEndian = true;
    bits;
    offset = 0;
    length = 0;
    constructor(capacity = 8192) {
        this.bits = new Uint8Array(capacity);
    }
    WriteBit(value) {
        if (this.offset >= this.bits.length) {
            const resized = new Uint8Array(this.bits.length + 8192);
            resized.set(this.bits, 0);
            this.bits = resized;
        }
        this.bits[this.offset++] = value;
        if (this.offset > this.length)
            this.length++;
        return this;
    }
    WriteBits(bits, numberOfBits) {
        for (let i = 0; i < numberOfBits; i++) {
            this.WriteBit(bits[i]);
        }
        return this;
    }
    WriteBytes(bytes, numberOfBits = bytes.length * 8) {
        const toWrite = new Uint8Array(numberOfBits);
        bytes.reduce((acc, c) => {
            const b = c
                .toString(2)
                .padStart(8, '0')
                .split('')
                .reverse()
                .map((e) => parseInt(e, 2));
            b.forEach((bit) => (toWrite[acc++] = bit));
            return acc;
        }, 0);
        return this.WriteBits(toWrite, numberOfBits);
    }
    WriteArray(bytes, numberOfBits = bytes.length * 8) {
        return this.WriteBytes(bytes, numberOfBits);
    }
    WriteByte(value, numberOfBits = 8) {
        const buffer = new Uint8Array(1);
        new DataView(buffer.buffer).setUint8(0, value);
        return this.WriteBytes(buffer, numberOfBits);
    }
    WriteUInt8(value, numberOfBits = 8) {
        return this.WriteByte(value, numberOfBits);
    }
    WriteUInt16(value, numberOfBits = 8 * 2) {
        const buffer = new Uint8Array(2);
        new DataView(buffer.buffer).setUint16(0, value, this.littleEndian);
        return this.WriteBytes(buffer, numberOfBits);
    }
    WriteUInt32(value, numberOfBits = 8 * 4) {
        const buffer = new Uint8Array(4);
        new DataView(buffer.buffer).setUint32(0, value, this.littleEndian);
        return this.WriteBytes(buffer, numberOfBits);
    }
    WriteString(value, numberOfBytes) {
        const buffer = new TextEncoder().encode(value);
        return this.WriteBytes(buffer, numberOfBytes * 8);
    }
    SeekBit(offset) {
        this.offset = offset;
        if (this.offset > this.length) {
            this.length = this.offset;
        }
        return this;
    }
    SeekByte(offset) {
        return this.SeekBit(offset * 8);
    }
    PeekBytes(count) {
        const buffer = new Uint8Array(count);
        let byteIndex = 0;
        let bitIndex = 0;
        for (let i = 0; i < count * 8; ++i) {
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
    }
    Align() {
        this.offset = (this.offset + 7) & ~7;
        if (this.offset > this.length) {
            this.length = this.offset;
        }
        return this;
    }
    ToArray() {
        const buffer = new Uint8Array((this.length - 1) / 8 + 1);
        let byteIndex = 0;
        let bitIndex = 0;
        for (let i = 0; i < this.length; ++i) {
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
    }
}
exports.BitWriter = BitWriter;
