const NodeCache = require( "node-cache" );

const imageCache = new NodeCache( { checkperiod: 0, useClones: false } );

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

const colormaps = {
  1: 'd2/game_data/remodded/version_99/global/items/Palette/grey.dat',
  2: 'd2/game_data/remodded/version_99/global/items/Palette/grey2.dat',
  5: 'd2/game_data/remodded/version_99/global/items/Palette/greybrown.dat',
  6: 'd2/game_data/remodded/version_99/global/items/Palette/invgrey.dat',
  7: 'd2/game_data/remodded/version_99/global/items/Palette/invgrey2.dat',
  8: 'd2/game_data/remodded/version_99/global/items/Palette/invgreybrown.dat',
};

export default {
  colors: colors,
  colormaps: colormaps,
  b64StringToArrayBuffer(base64) {
    var bin = window.atob(base64);
    var len = bin.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes.buffer;
  },
  arrayBufferToBase64String(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
  },
  arrayBufferToHexString(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  },
  hexStringToArrayBuffer(string) {
    var typedArray = new Uint8Array(string.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }));
    return typedArray.buffer;
  },
  async b64PNGFromDC6(item) {
    let path = `d2/game_data/${window.work_mod}/version_${window.work_version}/global/items/${item.inv_file}.dc6`
    let dc6
    if (imageCache.has(path)){
      dc6 = imageCache.get(path)
    } else {
      let response;
      try {
        response = await fetch(path, { signal: AbortSignal.timeout(1500) });
      } catch (e) {
        return null;
      }
      if (response.status !== 200) {
        return null;
      }
      let arrayBuffer
      try {
        arrayBuffer = await response.arrayBuffer()
      } catch (e) {
        return null;
      }
      dc6 = new Uint8Array(arrayBuffer);

      // Save in cache
      imageCache.set( path, dc6, 10000 )
    }

    // Transform to a colorized picture
    let idx = 32;
    const width = dc6[idx] | dc6[idx + 1] << 8 | dc6[idx + 2] << 16 | dc6[idx + 2] << 24;
    idx = 36;
    const height = dc6[idx] | dc6[idx + 1] << 8 | dc6[idx + 2] << 16 | dc6[idx + 2] << 24;
    idx = 56;
    const length = dc6[idx] | dc6[idx + 1] << 8 | dc6[idx + 2] << 16 | dc6[idx + 2] << 24;
    let x = 0, y = height - 1;
    const indexed = [];
    if (width == 0 || height == 0) {
      return null;
    }
    for (let i = 0; i < height; i += 1) {
      indexed[i] = Array(width).fill(255);
    }
    for (let i = 0; i < length;) {
      let b = dc6[60 + i++];
      if (b === 0x80) { //eol
        x = 0, y--;
      } else if (b & 0x80) {
        x += b & 0x7F; //transparent repeat for N bytes
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
        let paletteIdx = indexed[y][x];
        const offset = (y * width + x) * 4;
        if (paletteIdx === 255) { //transparent
          continue;
        }
        if (item.transform_color && item.inv_transform) {
          let transformIdx = colors[item.transform_color];
          if (transformIdx >= 0 && window.palettes[item.inv_transform]) {
            paletteIdx = window.palettes[item.inv_transform][transformIdx][paletteIdx];
          }
        }
        const rgb = window.palettes["ACT1"][paletteIdx];
        imgData.data[offset] = rgb[0];
        imgData.data[offset + 1] = rgb[1];
        imgData.data[offset + 2] = rgb[2];
        imgData.data[offset + 3] = 255;
      }
    }
    
    // put data to context at (0, 0)
    context.putImageData(imgData, 0, 0);
    // output image
    //var img = new Image();
    let src = canvas.toDataURL('image/png');
    canvas.remove();

    return src;
  },
  shift(number, shift) {
    return number * Math.pow(2, shift);
  },
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
  }
}