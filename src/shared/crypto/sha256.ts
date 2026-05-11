const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rightRotate(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

function readWord(words: Uint32Array, index: number): number {
  return words[index] ?? 0;
}

class Sha256 {
  private readonly state = new Uint32Array([
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19,
  ]);

  private buffer = new Uint8Array(64);
  private bufferLength = 0;
  private bytesHashed = 0;
  private finished = false;

  update(chunk: Uint8Array): this {
    if (this.finished) {
      throw new Error("Hash already finalized");
    }

    let offset = 0;
    this.bytesHashed += chunk.length;

    while (offset < chunk.length) {
      const space = 64 - this.bufferLength;
      const inputPart = chunk.subarray(offset, offset + space);
      this.buffer.set(inputPart, this.bufferLength);
      this.bufferLength += inputPart.length;
      offset += inputPart.length;

      if (this.bufferLength === 64) {
        this.processBlock(this.buffer);
        this.bufferLength = 0;
      }
    }

    return this;
  }

  digestHex(): string {
    if (!this.finished) {
      this.finish();
    }

    return Array.from(this.state, (value) => value.toString(16).padStart(8, "0")).join("");
  }

  private finish(): void {
    this.finished = true;

    const bitLength = this.bytesHashed * 8;
    this.buffer[this.bufferLength++] = 0x80;

    if (this.bufferLength > 56) {
      this.buffer.fill(0, this.bufferLength, 64);
      this.processBlock(this.buffer);
      this.bufferLength = 0;
    }

    this.buffer.fill(0, this.bufferLength, 56);
    const view = new DataView(this.buffer.buffer);
    view.setUint32(56, Math.floor(bitLength / 0x100000000), false);
    view.setUint32(60, bitLength >>> 0, false);
    this.processBlock(this.buffer);
  }

  private processBlock(chunk: Uint8Array): void {
    const words = new Uint32Array(64);
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);

    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(index * 4, false);
    }

    for (let index = 16; index < 64; index += 1) {
      const word15 = readWord(words, index - 15);
      const word2 = readWord(words, index - 2);
      const word16 = readWord(words, index - 16);
      const word7 = readWord(words, index - 7);
      const s0 = rightRotate(word15, 7) ^ rightRotate(word15, 18) ^ (word15 >>> 3);
      const s1 = rightRotate(word2, 17) ^ rightRotate(word2, 19) ^ (word2 >>> 10);

      words[index] = (((word16 + s0) | 0) + ((word7 + s1) | 0)) >>> 0;
    }

    let a = readWord(this.state, 0);
    let b = readWord(this.state, 1);
    let c = readWord(this.state, 2);
    let d = readWord(this.state, 3);
    let e = readWord(this.state, 4);
    let f = readWord(this.state, 5);
    let g = readWord(this.state, 6);
    let h = readWord(this.state, 7);

    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (((((h + sigma1) | 0) + ((choice + readWord(K, index)) | 0)) | 0) + readWord(words, index)) >>> 0;
      const sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sigma0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    this.state[0] = (readWord(this.state, 0) + a) >>> 0;
    this.state[1] = (readWord(this.state, 1) + b) >>> 0;
    this.state[2] = (readWord(this.state, 2) + c) >>> 0;
    this.state[3] = (readWord(this.state, 3) + d) >>> 0;
    this.state[4] = (readWord(this.state, 4) + e) >>> 0;
    this.state[5] = (readWord(this.state, 5) + f) >>> 0;
    this.state[6] = (readWord(this.state, 6) + g) >>> 0;
    this.state[7] = (readWord(this.state, 7) + h) >>> 0;
  }
}

export async function sha256HexFromFile(file: Blob): Promise<string> {
  const hash = new Sha256();
  const reader = file.stream().getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        hash.update(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return hash.digestHex();
}
