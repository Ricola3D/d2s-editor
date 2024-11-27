/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import canvas from 'canvas'
import { JSDOM } from 'jsdom'

import utils from '../src/utils.mjs'

function fillPalettes() {
  const relativeDir = './public'
  const a1PalettePath = path.join(relativeDir, utils.a1PalettePath)
  let a1PaletteBuffer = fs.readFileSync(a1PalettePath)
  const colorMapBuffers = {}
  for (const [index, relativePath] of Object.entries(utils.colormapPaths)) {
    const colorMapPath = path.join(relativeDir, relativePath)
    colorMapBuffers[index] = fs.readFileSync(colorMapPath)
  }
  utils.fillPalettes(a1PaletteBuffer, colorMapBuffers)
}

function generateItemsWebImage(mod, version) {
  const modDataDir = `./public/d2/game_data/${mod}/version_${version}`
  const sdInputDir = `${modDataDir}/global/items`
  const hdInputDir = `${modDataDir}/hd/global/ui/items`

  if (fs.existsSync(sdInputDir)) {
    fs.readdir(sdInputDir, { recursive: true }, function (err, files) {
      if (err) {
        console.error(`Could not list the directory ${sdInputDir}`, err)
        process.exit(1)
      }

      files.forEach(function (file) {
        if (file.endsWith('.dc6')) {
          const ouputPath = path.join(sdInputDir, file.replace('.dc6', '.png'))

          // Do not regenerate existing png
          if (!fs.existsSync(ouputPath)) {
            const inputPath = path.join(sdInputDir, file)
            const dc6 = fs.readFileSync(inputPath)
            try {
              // BEWARE: some DC6 are malformed, even SixDice crashes when opening them
              const canvas = utils.CanvasFromDC6(null, dc6)
              if (canvas) {
                const context = canvas.getContext('2d')
                const imgData = context.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height
                )

                var imgPng = new PNG({
                  width: imgData.width,
                  height: imgData.height,
                })
                imgPng.data = Buffer.from(imgData.data)
                // imgPng.pack().pipe(fs.createWriteStream(ouputPath)) // Will create an "Error: EMFILE: too many open files"
                const buffer = PNG.sync.write(imgPng)
                fs.writeFileSync(ouputPath, buffer)
                console.log(`Generated file ${file}`)
              }
            } catch (err) {
              console.warn(`Skipped file ${file} which is corrupted` /*, err*/)
            }
          }
        }
      })
    })
  }

  fs.readdir(hdInputDir, { recursive: true }, function (err, files) {
    if (err) {
      console.error(`Could not list the directory ${hdInputDir}`, err)
      process.exit(1)
    }

    files.forEach(function (file) {
      if (file.endsWith('.sprite')) {
        const ouputPath = path.join(hdInputDir, file.replace('.sprite', '.png'))

        // Do not regenerate existing png
        if (!fs.existsSync(ouputPath)) {
          const inputPath = path.join(hdInputDir, file)
          const sprite = fs.readFileSync(inputPath)
          const canvas = utils.CanvasFromSprite(null, sprite)
          if (canvas) {
            const context = canvas.getContext('2d')
            const imgData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            )

            var imgPng = new PNG({
              width: imgData.width,
              height: imgData.height,
            })
            imgPng.data = Buffer.from(imgData.data)
            // imgPng.pack().pipe(fs.createWriteStream(ouputPath)) // Will create an "Error: EMFILE: too many open files"
            const buffer = PNG.sync.write(imgPng)
            fs.writeFileSync(ouputPath, buffer)
            console.log(`Generated file ${file}`)
          }
        }
      }
    })
  })
}

// eslint-disable-next-line prettier/prettier
const minHtml = 
  `<!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Untitled</title>
  </head>
  <body>
  </body>
  </html>`

const dom = new JSDOM(minHtml)

global.window = dom.window
global.document = dom.window.document

fillPalettes()

generateItemsWebImage('vanilla', 96)
generateItemsWebImage('vanilla', 98)
generateItemsWebImage('vanilla', 99)
generateItemsWebImage('remodded', 98)
generateItemsWebImage('remodded', 99)
