import NodeCache from 'node-cache';
// import { Lru } from 'toad-cache';

const utilsCache = new NodeCache({
  stdTTL: 3600, // 1h
  checkperiod: 300, // 5min
  useClones: false,
});
// const utilsCache2 = new Lru(500, 3600000) // max: 500 items, TTL=3600000ms=1h

const colors = {
  whit: 0,
  lgry: 1,
  dgry: 2,
  blac: 3,
  lblu: 4,
  dblu: 5,
  cblu: 6,
  lred: 7,
  dred: 8,
  cred: 9,
  lgrn: 10,
  dgrn: 11,
  cgrn: 12,
  lyel: 13,
  dyel: 14,
  lgld: 15,
  dgld: 16,
  lpur: 17,
  dpur: 18,
  oran: 19,
  bwht: 20,
};

function fillPalettes(palettes, a1PaletteBuffer, colorMapBuffers) {
  for (const property in palettes) {
    delete palettes[property];
  }
  palettes['ACT1'] = [];

  for (let i = 0; i < 256; i += 1) {
    palettes['ACT1'].push([a1PaletteBuffer[i * 3 + 2], a1PaletteBuffer[i * 3 + 1], a1PaletteBuffer[i * 3]]);
  }
  for (const [index, colorMapBuffer] of Object.entries(colorMapBuffers)) {
    palettes[index] = [];
    for (let i = 0; i < Object.keys(colors).length; i += 1) {
      palettes[index].push(colorMapBuffer.slice(0 + i * 256, 256 + i * 256));
    }
  }
}

// "r-g-b" string -> paletteIdx
const paletteIdxToColorMap = {};

function resolveColorIdx(palettes, rgbColor) {
  let lookupKey = `${rgbColor[0]}-${rgbColor[1]}-${rgbColor[2]}`,
    bestIdx = -1,
    bestScore = -1;
  // Result is saved in a map to minimize computation time
  if (paletteIdxToColorMap[lookupKey] != undefined) {
    bestIdx = paletteIdxToColorMap[lookupKey];
  } else {
    // New lookup
    palettes['ACT1'].every((paletteColor, idx) => {
      let score =
        Math.pow(rgbColor[0] - paletteColor[0], 2) +
        Math.pow(rgbColor[1] - paletteColor[1], 2) +
        Math.pow(rgbColor[2] - paletteColor[2], 2);
      if (bestScore < 0 || score < bestScore) {
        bestIdx = idx;
        bestScore = score;
      }
      return score;
    });
    paletteIdxToColorMap[lookupKey] = bestIdx;
  }
  return bestIdx;
}

function getRgbColor(palettes, colorIdx, transformColor, inventoryTransform) {
  let finalColorIdx = colorIdx;
  if (transformColor && inventoryTransform) {
    let transformIdx = colors[transformColor];
    if (transformIdx >= 0 && palettes[inventoryTransform]) {
      const transform = palettes[inventoryTransform][transformIdx];
      finalColorIdx = transform[colorIdx];
    }
  }
  return palettes['ACT1'][finalColorIdx];
}

function rgb565(c) {
  let r = (c & 0xf800) >> 8;
  let g = (c & 0x07e0) >> 3;
  let b = (c & 0x001f) << 3;
  r |= r >> 5;
  g |= g >> 6;
  b |= b >> 5;
  return [r, g, b];
}

async function getFileWithCache(path) {
  const lookupKey = JSON.stringify({ path });
  let bytes = null;
  // if (false) {
  if (utilsCache.has(lookupKey)) {
    // if ((bytes = utilsCache2.get(lookupKey))) {
    bytes = utilsCache.get(lookupKey);
  } else {
    let response;
    try {
      // const start = Date.now();
      // console.log(`At ${start}s, start fetching file: "${path}"`)
      response = await fetch(path, { signal: AbortSignal.timeout(10000) });
      // const elapsed = Date.now() - start;
      // console.log(`${elapsed}ms to fetch file: "${path}"`)
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn(`Timeout on fetching file: "${path}"`);
      } else {
        console.error(`cannot get file: "${path}"`);
      }
      return null;
    }
    // Response OK or Unchanged
    if (response.status !== 200 && response.status !== 304) {
      // console.error(`HTTP Response ${response.status}: "${path}"`);
      return null;
    }

    const responseContentType = response.headers.get('Content-Type'); // string of format "type ; encoding"
    if (responseContentType) {
      const mimeType = responseContentType.split(';')[0];
      if (mimeType != '' && mimeType != 'application/octet-stream') {
        // console.error(`Response mime-type "${responseContentType}": "${path}"`);
        return null;
      }
    }

    let arrayBuffer;
    try {
      arrayBuffer = await response.arrayBuffer();
    } catch (e) {
      return null;
    }
    bytes = new Uint8Array(arrayBuffer);

    // Save in cache
    utilsCache.set(lookupKey, bytes);
    // utilsCache2.set(lookupKey, bytes);
  }

  return bytes;
}

function CanvasFromSprite(item, sprite, palettes) {
  // Sprite image size is 98x98 per inventory case, lowend is 49x49 per inventory case

  // DXT Header
  // 0x00", header   # File header - always SpA1
  // 0x04", uintle16 # version maybe ? 31 is different than 61 (61 do not want to be parsed here)
  // 0x06", uintle16 # real frame width
  // 0x08", uintle32 # overall width
  // 0x0C", uintle32 # overall height
  // 0x10", uintle32 # 0
  // 0x14", uintle32 # number of frames
  // 0x18", uintle32 # 0
  // 0x1C", uintle32 # 0
  // 0x20", uintle32 # streamsize
  // 0x24", uintle32 # most of time 4
  let idx = 4;
  const version = sprite[idx] | (sprite[idx + 1] << 8);
  idx = 8;
  const width = sprite[idx] | (sprite[idx + 1] << 8) | (sprite[idx + 2] << 16) | (sprite[idx + 2] << 24);
  idx = 12;
  const height = sprite[idx] | (sprite[idx + 1] << 8) | (sprite[idx + 2] << 16) | (sprite[idx + 2] << 24);

  if (width == 0 || height == 0) {
    return null;
  }

  let canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    imgData = context.createImageData(width, height);
  canvas.height = height;
  canvas.width = width;

  if (version == 31) {
    // regular RGBA
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        idx = 0x28 + y * 4 * width + x * 4;
        let rgbColor = [sprite[idx], sprite[idx + 1], sprite[idx + 2]]; // rgb
        const alpha = sprite[idx + 3];

        // D2 works with a present number of colors defined in the default palette
        const colorIdx = resolveColorIdx(palettes, rgbColor);

        // Apply transform color if necessary
        rgbColor = getRgbColor(palettes, colorIdx, item ? item.transform_color : null, item ? item.inv_transform : null);

        const offset = (y * width + x) * 4;
        imgData.data[offset] = rgbColor[0]; // r
        imgData.data[offset + 1] = rgbColor[1]; // g
        imgData.data[offset + 2] = rgbColor[2]; // b
        imgData.data[offset + 3] = alpha; // a
      }
    }
  } else if (version == 61) {
    // DXT5
    // The image is split in 4x4 blocs
    // Each block has alpha & color channels definitions, then pixels encoded
    // never tested due to lack of file
    let idx = 0x28,
      bcw = Math.ceil(width / 4),
      bch = Math.ceil(height / 4);
    //let clen_last = (width + 3) % 4 + 1;
    let alphas = [],
      rgbColors = [];
    for (let t = 0; t < bch; t++) {
      for (let s = 0; s < bcw; s++, idx += 16) {
        // 16 bytes per block

        // 2 bytes - Alpha chanels definition
        {
          alphas[0] = sprite[idx + 0];
          alphas[1] = sprite[idx + 1];
          if (alphas[0] > alphas[1]) {
            alphas[2] = Math.trunc((alphas[0] * 6 + alphas[1]) / 7);
            alphas[3] = Math.trunc((alphas[0] * 5 + alphas[1] * 2) / 7);
            alphas[4] = Math.trunc((alphas[0] * 4 + alphas[1] * 3) / 7);
            alphas[5] = Math.trunc((alphas[0] * 3 + alphas[1] * 4) / 7);
            alphas[6] = Math.trunc((alphas[0] * 2 + alphas[1] * 5) / 7);
            alphas[7] = Math.trunc((alphas[0] + alphas[1] * 6) / 7);
          } else {
            alphas[2] = Math.trunc((alphas[0] * 4 + alphas[1]) / 5);
            alphas[3] = Math.trunc((alphas[0] * 3 + alphas[1] * 2) / 5);
            alphas[4] = Math.trunc((alphas[0] * 2 + alphas[1] * 3) / 5);
            alphas[5] = Math.trunc((alphas[0] + alphas[1] * 4) / 5);
            alphas[7] = 255;
          }
        }

        // 4 bytes - Color chanels definition
        {
          const q0 = sprite[idx + 2] | (sprite[idx + 3] << 8),
            q1 = sprite[idx + 4] | (sprite[idx + 5] << 8);
          rgbColors[0] = rgb565(q0);
          rgbColors[1] = rgb565(q1);
          const { r0, g0, b0 } = rgbColors[0];
          const { r1, g1, b1 } = rgbColors[1];
          if (q0 > q1) {
            rgbColors[2] = [Math.trunc((r0 * 2 + r1) / 3), Math.trunc((g0 * 2 + g1) / 3), Math.trunc((b0 * 2 + b1) / 3)];
            rgbColors[3] = [Math.trunc((r0 + r1 * 2) / 3), Math.trunc((g0 + g1 * 2) / 3), Math.trunc((b0 + b1 * 2) / 3)];
          } else {
            rgbColors[2] = [Math.trunc((r0 + r1) / 2), Math.trunc((g0 + g1) / 2), Math.trunc((b0 + b1) / 2)];
          }
        }

        // 10 bytes - Values
        // 48bits alpha's, 32bits color's
        let da =
          sprite[idx + 6] |
          (sprite[idx + 7] << 8) |
          (sprite[idx + 8] << 16) |
          (sprite[idx + 9] << 24) |
          (sprite[idx + 10] << 32) |
          (sprite[idx + 11] << 40);
        let dc = sprite[idx + 12] | (sprite[idx + 13] << 8) | (sprite[idx + 14] << 16) | (sprite[idx + 15] << 24);
        for (let i = 0; i < 16; i++, da >>= 3, dc >>= 2) {
          // Per pixel: 3bits alpha chanel, 2bits color
          let rgbColor = rgbColors[dc & 3];
          const alpha = alphas[da & 7];

          // D2 works with a present number of colors defined in the default palette
          const colorIdx = resolveColorIdx(palettes, rgbColor);

          // Apply transform color if necessary
          rgbColor = getRgbColor(palettes, colorIdx, item ? item.transform_color : null, item ? item.inv_transform : null);

          const x = 4 * bcw + (i % 4);
          const y = 4 * bch + Math.floor(i / 4);

          if (x < width && y < height) {
            // Beware of last column & row overflow
            const offset = (y * width + x) * 4;
            imgData.data[offset] = rgbColor[0];
            imgData.data[offset + 1] = rgbColor[1];
            imgData.data[offset + 2] = rgbColor[2];
            imgData.data[offset + 3] = alpha;
          }
        }
      }
    }
  }

  // put data to context at (0, 0)
  context.putImageData(imgData, 0, 0);

  const scaleFactor = 32 / 49; // We use 32x32 in the hero editor
  let finalCanvas = document.createElement('canvas'),
    finalContext = finalCanvas.getContext('2d');
  finalCanvas.height = Math.floor(scaleFactor * height);
  finalCanvas.width = Math.floor(scaleFactor * width);
  finalContext.scale(scaleFactor, scaleFactor);
  finalContext.drawImage(context.canvas, 0, 0);
  canvas.remove();

  return finalCanvas;
}

function b64PNGFromSprite(item, sprite, palettes) {
  const finalCanvas = CanvasFromSprite(item, sprite, palettes);

  if (!finalCanvas) return null;

  // output image
  //var img = new Image();
  //let src = canvas.toDataURL('image/png');
  let src = finalCanvas.toDataURL('image/webp', 0.5);
  finalCanvas.remove();

  return src;
}

function CanvasFromDC6(item, dc6, palettes) {
  // DC6 format:
  // - https://d2mods.info/forum/viewtopic.php?t=724#p148076
  // - https://gist.github.com/MarkKoz/874052801d7eddd1bb4a9b69cd1e9ac8
  // DC6 image size is 28x28 per inventory case
  let idx = 32;
  const width = dc6[idx] | (dc6[idx + 1] << 8) | (dc6[idx + 2] << 16) | (dc6[idx + 2] << 24);
  idx = 36;
  const height = dc6[idx] | (dc6[idx + 1] << 8) | (dc6[idx + 2] << 16) | (dc6[idx + 2] << 24);
  idx = 56;
  const length = dc6[idx] | (dc6[idx + 1] << 8) | (dc6[idx + 2] << 16) | (dc6[idx + 2] << 24);

  let x = 0,
    y = height - 1;
  const indexed = [];
  if (width == 0 || height == 0) {
    return null;
  }
  for (let i = 0; i < height; i += 1) {
    indexed[i] = Array(width).fill(255);
  }
  for (let i = 0; i < length; ) {
    let b = dc6[60 + i++];
    if (b === 0x80) {
      //eol
      (x = 0), y--;
    } else if (b & 0x80) {
      x += b & 0x7f; //transparent repeat for N bytes
    } else {
      //read N bytes
      for (let j = 0; j < b; j++) {
        indexed[y][x++] = dc6[60 + i++];
      }
    }
  }
  let canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    imgData = context.createImageData(width, height);
  canvas.height = height;
  canvas.width = width;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let colorIdx = indexed[y][x];
      if (colorIdx === 255) {
        // Transparent, imgData is 0s.
        continue;
      }
      const rgbColor = getRgbColor(palettes, colorIdx, item ? item.transform_color : null, item ? item.inv_transform : null);

      const offset = (y * width + x) * 4;
      imgData.data[offset] = rgbColor[0];
      imgData.data[offset + 1] = rgbColor[1];
      imgData.data[offset + 2] = rgbColor[2];
      imgData.data[offset + 3] = 255;
    }
  }

  // put data to context at (0, 0)
  context.putImageData(imgData, 0, 0);

  const scaleFactor = 32 / 28; // We use 32x32 in the hero editor
  let finalCanvas = document.createElement('canvas'),
    finalContext = finalCanvas.getContext('2d');
  finalCanvas.height = Math.floor(scaleFactor * height);
  finalCanvas.width = Math.floor(scaleFactor * width);
  finalContext.scale(scaleFactor, scaleFactor);
  finalContext.drawImage(context.canvas, 0, 0);

  canvas.remove();

  return finalCanvas;
}

function b64PNGFromDC6(item, dc6, palettes) {
  const finalCanvas = CanvasFromDC6(item, dc6, palettes);

  // output image
  //var img = new Image();
  //let src = canvas.toDataURL('image/png');
  let src = finalCanvas.toDataURL('image/webp', 0.5);
  finalCanvas.remove();

  return src;
}

export default {
  colors: colors,
  getA1PalettePath(mod, version) {
    return `d2/game_data/${mod}/version_${version}/global/palette/ACT1/pal.dat`;
  },
  getColormapPaths(mod, version) {
    return {
      1: `d2/game_data/${mod}/version_${version}/global/items/Palette/grey.dat`,
      2: `d2/game_data/${mod}/version_${version}/global/items/Palette/grey2.dat`,
      5: `d2/game_data/${mod}/version_${version}/global/items/Palette/greybrown.dat`,
      6: `d2/game_data/${mod}/version_${version}/global/items/Palette/invgrey.dat`,
      7: `d2/game_data/${mod}/version_${version}/global/items/Palette/invgrey2.dat`,
      8: `d2/game_data/${mod}/version_${version}/global/items/Palette/invgreybrown.dat`,
    };
  },
  fillPalettes,
  CanvasFromSprite,
  CanvasFromDC6,
  async getInventoryImage(item, mod, version, palettes) {
    if (item.hd_inv_file) {
      const hdImageLookupKey = JSON.stringify({
        tc: item.transform_color || null,
        it: item.inv_transform || null,
        hdi: item.hd_inv_file,
      });

      if (!item.transform_color || !item.inv_transform) {
        // Just return the URL
        return `d2/game_data/${mod}/version_${version}/hd/global/ui/items/${item.hd_inv_file}.lowend.png`; // lowend is enough and lighter
      } else {
        // Color-transformation: get b64 image from cache, generate it if not found
        if (utilsCache.has(hdImageLookupKey)) {
          // Re-use already built HD image data URL
          return utilsCache.get(hdImageLookupKey);
        } else {
          // Try building the HD image dataURL
          const spriteFilePath = `d2/game_data/${mod}/version_${version}/hd/global/ui/items/${item.hd_inv_file}.lowend.sprite`; // lowend is enough and lighter
          const sprite = await getFileWithCache(spriteFilePath);
          if (sprite) {
            // const start = Date.now()
            const imageDataUrl = b64PNGFromSprite(item, sprite, palettes);
            // const elapsed = Date.now() - start
            // console.log(`Needed ${elapsed}ms to generate PNG: "${spriteFilePath}"`)
            utilsCache.set(hdImageLookupKey, imageDataUrl); // Save the HD image dataURL in cache
            return imageDataUrl;
          }
        }
      }
    }

    if (item.inv_file && item.inv_file != 'D2R_Jank') {
      const sdImageLookupKey = JSON.stringify({
        tc: item.transform_color || null,
        it: item.inv_transform || null,
        i: item.inv_file,
      });

      if (!item.transform_color || !item.inv_color) {
        // Just return the URL
        return `d2/game_data/${mod}/version_${version}/global/items/${item.inv_file}.png`; // lowend is enough and lighter
      } else {
        // Color-transformation: get b64 image from cache, generate it if not found
        if (utilsCache.has(sdImageLookupKey)) {
          // Re-use already built SD image data URL
          return utilsCache.get(sdImageLookupKey);
        } else {
          // Try building the SD image dataURL
          const dc6FilePath = `d2/game_data/${mod}/version_${version}/global/items/${item.inv_file}.dc6`;
          const dc6 = await getFileWithCache(dc6FilePath);
          if (dc6) {
            // const start = Date.now()
            const imageDataUrl = b64PNGFromDC6(item, dc6);
            // const elapsed = Date.now() - start
            // console.log(`Needed ${elapsed}ms to generate PNG: "${dc6FilePath}"`)
            utilsCache.set(sdImageLookupKey, imageDataUrl); // Save the SD image dataURL in cache
            return imageDataUrl;
          }
        }
      }
    }

    return null;
  },
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  removeMaxDurabilityFromRunwords(item) {
    if (item.runeword_name) {
      this.removeAttribute(item.magic_attributes, 75);
      this.removeAttribute(item.combined_magic_attributes, 75);
      this.removeAttribute(item.displayed_combined_magic_attributes, 75);
    }
  },
  removeAttribute(array, attribute) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id == attribute) array.splice(i, 1);
    }
  },
  utilsCache,
};
