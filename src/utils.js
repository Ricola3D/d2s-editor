const NodeCache = require('node-cache')

const imageCache = new NodeCache({ checkperiod: 0, useClones: false })

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
}

const colormaps = {
    1: 'd2/game_data/remodded/version_99/global/items/Palette/grey.dat',
    2: 'd2/game_data/remodded/version_99/global/items/Palette/grey2.dat',
    5: 'd2/game_data/remodded/version_99/global/items/Palette/greybrown.dat',
    6: 'd2/game_data/remodded/version_99/global/items/Palette/invgrey.dat',
    7: 'd2/game_data/remodded/version_99/global/items/Palette/invgrey2.dat',
    8: 'd2/game_data/remodded/version_99/global/items/Palette/invgreybrown.dat',
}

// "r-g-b" string -> paletteIdx
const paletteIdxToColorMap = {}

function getPaletteIdxForColor(color) {
    let lookupKey = `${color.r}-${color.g}-${color.b}`,
        bestIdx = -1,
        bestScore = -1
    // Result is saved in a map to minimize computation time
    if (paletteIdxToColorMap[lookupKey] != undefined) {
        bestIdx = paletteIdxToColorMap[lookupKey]
    } else {
        // New lookup
        window.palettes['ACT1'].every((paletteColor, idx) => {
            let score =
                Math.pow(color.r - paletteColor[0], 2) +
                Math.pow(color.g - paletteColor[1], 2) +
                Math.pow(color.b - paletteColor[2], 2)
            if (bestScore < 0 || score < bestScore) {
                bestIdx = idx
                bestScore = score
            }
            return score
        })
        paletteIdxToColorMap[lookupKey] = bestIdx
    }
    return bestIdx
}

function paletteIdxToItemColor(item, paletteIdx) {
    if (item.transform_color && item.inv_transform) {
        let transformIdx = colors[item.transform_color]
        if (transformIdx >= 0 && window.palettes[item.inv_transform]) {
            paletteIdx =
                window.palettes[item.inv_transform][transformIdx][paletteIdx]
        }
    }
    const rgb = window.palettes['ACT1'][paletteIdx] // Array, 0: r, 1:g, 2:b
    return {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    }
}

function rgb565(c) {
    let r = (c & 0xf800) >> 8
    let g = (c & 0x07e0) >> 3
    let b = (c & 0x001f) << 3
    r |= r >> 5
    g |= g >> 6
    b |= b >> 5
    return { r, g, b }
}

async function getFileWithCache(path) {
    let bytes = null
    if (imageCache.has(path)) {
        bytes = imageCache.get(path)
    } else {
        let response
        try {
            response = await fetch(path, { signal: AbortSignal.timeout(1500) })
        } catch (e) {
            return null
        }
        // Response OK or Unchanged
        if (response.status !== 200 && response.status !== 304) {
            return null
        }

        const responseContentType = response.headers.get('Content-Type') // string of format "type ; encoding"
        if (responseContentType) {
            const mimeType = responseContentType.split(';')[0]
            if (mimeType != '' && mimeType != 'application/octet-stream') {
                return null
            }
        }

        let arrayBuffer
        try {
            arrayBuffer = await response.arrayBuffer()
        } catch (e) {
            return null
        }
        bytes = new Uint8Array(arrayBuffer)

        // Save in cache
        imageCache.set(path, bytes, 10000)
    }

    return bytes
}

function b64PNGFromSprite(item, sprite) {
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
    let idx = 4
    const version = sprite[idx] | (sprite[idx + 1] << 8)
    idx = 8
    const width =
        sprite[idx] |
        (sprite[idx + 1] << 8) |
        (sprite[idx + 2] << 16) |
        (sprite[idx + 2] << 24)
    idx = 12
    const height =
        sprite[idx] |
        (sprite[idx + 1] << 8) |
        (sprite[idx + 2] << 16) |
        (sprite[idx + 2] << 24)

    if (width == 0 || height == 0) {
        return null
    }

    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imgData = context.createImageData(width, height)
    canvas.height = height
    canvas.width = width

    if (version == 31) {
        // regular RGBA
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                idx = 0x28 + y * 4 * width + x * 4
                let color = {
                    r: sprite[idx],
                    g: sprite[idx + 1],
                    b: sprite[idx + 2],
                    a: sprite[idx + 3],
                }

                // Apply transform color if necessary
                let paletteIdx = getPaletteIdxForColor(color)
                Object.assign(color, paletteIdxToItemColor(item, paletteIdx))

                const offset = (y * width + x) * 4
                imgData.data[offset] = color.r
                imgData.data[offset + 1] = color.g
                imgData.data[offset + 2] = color.b
                imgData.data[offset + 3] = color.a
            }
        }
    } else if (version == 61) {
        // DXT5
        // The image is split in 4x4 blocs
        // Each block has alpha & color channels definitions, then pixels encoded
        // never tested due to lack of file
        let idx = 0x28,
            bcw = Math.ceil(width / 4),
            bch = Math.ceil(height / 4)
        //let clen_last = (width + 3) % 4 + 1;
        let alphas = [],
            colors = []
        for (let t = 0; t < bch; t++) {
            for (let s = 0; s < bcw; s++, idx += 16) {
                // 16 bytes per block

                // 2 bytes - Alpha chanels definition
                {
                    alphas[0] = sprite[idx + 0]
                    alphas[1] = sprite[idx + 1]
                    if (alphas[0] > alphas[1]) {
                        alphas[2] = Math.trunc((alphas[0] * 6 + alphas[1]) / 7)
                        alphas[3] = Math.trunc(
                            (alphas[0] * 5 + alphas[1] * 2) / 7
                        )
                        alphas[4] = Math.trunc(
                            (alphas[0] * 4 + alphas[1] * 3) / 7
                        )
                        alphas[5] = Math.trunc(
                            (alphas[0] * 3 + alphas[1] * 4) / 7
                        )
                        alphas[6] = Math.trunc(
                            (alphas[0] * 2 + alphas[1] * 5) / 7
                        )
                        alphas[7] = Math.trunc((alphas[0] + alphas[1] * 6) / 7)
                    } else {
                        alphas[2] = Math.trunc((alphas[0] * 4 + alphas[1]) / 5)
                        alphas[3] = Math.trunc(
                            (alphas[0] * 3 + alphas[1] * 2) / 5
                        )
                        alphas[4] = Math.trunc(
                            (alphas[0] * 2 + alphas[1] * 3) / 5
                        )
                        alphas[5] = Math.trunc((alphas[0] + alphas[1] * 4) / 5)
                        alphas[7] = 255
                    }
                }

                // 4 bytes - Color chanels definition
                {
                    const q0 = sprite[idx + 2] | (sprite[idx + 3] << 8),
                        q1 = sprite[idx + 4] | (sprite[idx + 5] << 8)
                    colors[0] = rgb565(q0)
                    colors[1] = rgb565(q1)
                    const { r0, g0, b0 } = colors[0]
                    const { r1, g1, b1 } = colors[1]
                    if (q0 > q1) {
                        colors[2] = {
                            r: Math.trunc((r0 * 2 + r1) / 3),
                            g: Math.trunc((g0 * 2 + g1) / 3),
                            b: Math.trunc((b0 * 2 + b1) / 3),
                        }
                        colors[3] = {
                            r: Math.trunc((r0 + r1 * 2) / 3),
                            g: Math.trunc((g0 + g1 * 2) / 3),
                            b: Math.trunc((b0 + b1 * 2) / 3),
                        }
                    } else {
                        colors[2] = {
                            r: Math.trunc((r0 + r1) / 2),
                            g: Math.trunc((g0 + g1) / 2),
                            b: Math.trunc((b0 + b1) / 2),
                        }
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
                    (sprite[idx + 11] << 40)
                let dc =
                    sprite[idx + 12] |
                    (sprite[idx + 13] << 8) |
                    (sprite[idx + 14] << 16) |
                    (sprite[idx + 15] << 24)
                for (let i = 0; i < 16; i++, da >>= 3, dc >>= 2) {
                    // Per pixel: 3bits alpha chanel, 2bits color
                    let color = {
                        a: alphas[da & 7],
                        ...colors[dc & 3],
                    }

                    // Apply transform color if necessary
                    const paletteIdx = getPaletteIdxForColor(color)
                    Object.assign(
                        color,
                        paletteIdxToItemColor(item, paletteIdx)
                    )

                    const x = 4 * bcw + (i % 4)
                    const y = 4 * bch + Math.floor(i / 4)

                    if (x < width && y < height) {
                        // Beware of last column & row overflow
                        const offset = (y * width + x) * 4
                        imgData.data[offset] = color.r
                        imgData.data[offset + 1] = color.g
                        imgData.data[offset + 2] = color.b
                        imgData.data[offset + 3] = a
                    }
                }
            }
        }
    }

    // put data to context at (0, 0)
    context.putImageData(imgData, 0, 0)

    const scaleFactor = 32 / 49 // We use 32x32 in the hero editor
    let finalCanvas = document.createElement('canvas'),
        finalContext = finalCanvas.getContext('2d')
    finalCanvas.height = Math.floor(scaleFactor * height)
    finalCanvas.width = Math.floor(scaleFactor * width)
    finalContext.scale(scaleFactor, scaleFactor)
    finalContext.drawImage(context.canvas, 0, 0)

    // output image
    //var img = new Image();
    //let src = canvas.toDataURL('image/png');
    let src = finalCanvas.toDataURL('image/webp', 0.5)
    finalCanvas.remove()
    canvas.remove()

    return src
}

function b64PNGFromDC6(item, dc6) {
    // DC6 format:
    // - https://d2mods.info/forum/viewtopic.php?t=724#p148076
    // - https://gist.github.com/MarkKoz/874052801d7eddd1bb4a9b69cd1e9ac8
    // DC6 image size is 28x28 per inventory case
    let idx = 32
    const width =
        dc6[idx] |
        (dc6[idx + 1] << 8) |
        (dc6[idx + 2] << 16) |
        (dc6[idx + 2] << 24)
    idx = 36
    const height =
        dc6[idx] |
        (dc6[idx + 1] << 8) |
        (dc6[idx + 2] << 16) |
        (dc6[idx + 2] << 24)
    idx = 56
    const length =
        dc6[idx] |
        (dc6[idx + 1] << 8) |
        (dc6[idx + 2] << 16) |
        (dc6[idx + 2] << 24)

    let x = 0,
        y = height - 1
    const indexed = []
    if (width == 0 || height == 0) {
        return null
    }
    for (let i = 0; i < height; i += 1) {
        indexed[i] = Array(width).fill(255)
    }
    for (let i = 0; i < length; ) {
        let b = dc6[60 + i++]
        if (b === 0x80) {
            //eol
            ;(x = 0), y--
        } else if (b & 0x80) {
            x += b & 0x7f //transparent repeat for N bytes
        } else {
            //read N bytes
            for (let j = 0; j < b; j++) {
                indexed[y][x++] = dc6[60 + i++]
            }
        }
    }
    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imgData = context.createImageData(width, height)
    canvas.height = height
    canvas.width = width
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            let paletteIdx = indexed[y][x]
            if (paletteIdx === 255) {
                // Transparent, imgData is 0s.
                continue
            }
            const color = paletteIdxToItemColor(item, paletteIdx)
            const offset = (y * width + x) * 4
            imgData.data[offset] = color.r
            imgData.data[offset + 1] = color.g
            imgData.data[offset + 2] = color.b
            imgData.data[offset + 3] = 255
        }
    }

    // put data to context at (0, 0)
    context.putImageData(imgData, 0, 0)

    const scaleFactor = 32 / 28 // We use 32x32 in the hero editor
    let finalCanvas = document.createElement('canvas'),
        finalContext = finalCanvas.getContext('2d')
    finalCanvas.height = Math.floor(scaleFactor * height)
    finalCanvas.width = Math.floor(scaleFactor * width)
    finalContext.scale(scaleFactor, scaleFactor)
    finalContext.drawImage(context.canvas, 0, 0)

    // output image
    //var img = new Image();
    //let src = canvas.toDataURL('image/png');
    let src = finalCanvas.toDataURL('image/webp', 0.5)
    finalCanvas.remove()
    canvas.remove()

    return src
}

export default {
    colors: colors,
    colormaps: colormaps,
    b64StringToArrayBuffer(base64) {
        var bin = window.atob(base64)
        var len = bin.length
        var bytes = new Uint8Array(len)
        for (var i = 0; i < len; i++) {
            bytes[i] = bin.charCodeAt(i)
        }
        return bytes.buffer
    },
    arrayBufferToBase64String(buffer) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    },
    arrayBufferToHexString(buffer) {
        return [...new Uint8Array(buffer)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('')
    },
    hexStringToArrayBuffer(string) {
        var typedArray = new Uint8Array(
            string.match(/[\da-f]{2}/gi).map(function (h) {
                return parseInt(h, 16)
            })
        )
        return typedArray.buffer
    },
    getItemDetails(item) {
        const constants =
            window[`${window.work_mod}_constants_${window.work_version}`]
        return (
            constants.armor_items[item.type] ||
            constants.weapon_items[item.type] ||
            constants.other_items[item.type]
        )
    },
    async getInventoryImageSrc(item) {
        if (item.hd_inv_file) {
            const spriteFilePath = `d2/game_data/${window.work_mod}/version_${window.work_version}/hd/global/ui/items/${item.hd_inv_file}.lowend.sprite` // lowend is enough and lighter
            const sprite = await getFileWithCache(spriteFilePath)
            if (sprite) {
                return b64PNGFromSprite(item, sprite)
            }
        }

        if (item.inv_file && item.inv_file != 'D2R_Jank') {
            const dc6FilePath = `d2/game_data/${window.work_mod}/version_${window.work_version}/global/items/${item.inv_file}.dc6`
            const dc6 = await getFileWithCache(dc6FilePath)
            if (dc6) {
                return b64PNGFromDC6(item, dc6)
            }
        }

        return null
    },
    shift(number, shift) {
        return number * Math.pow(2, shift)
    },
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            }
        )
    },
    removeMaxDurabilityFromRunwords(item) {
        if (item.runeword_name) {
            this.removeAttribute(item.magic_attributes, 75)
            this.removeAttribute(item.combined_magic_attributes, 75)
            this.removeAttribute(item.displayed_combined_magic_attributes, 75)
        }
    },
    removeAttribute(array, attribute) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == attribute) array.splice(i, 1)
        }
    },
}
