/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
// import canvas from 'canvas';
import { JSDOM } from 'jsdom';

import utils from '../src/utils.mjs';

const palettes = {};

function fillPalettes(mod, version) {
  const relativeDir = './public';
  const a1PalettePath = path.join(relativeDir, utils.getA1PalettePath(mod, version));
  let a1PaletteBuffer = fs.readFileSync(a1PalettePath);
  const colorMapBuffers = {};
  const colormapPaths = utils.getColormapPaths(mod, version);
  for (const [index, relativePath] of Object.entries(colormapPaths)) {
    const colorMapPath = path.join(relativeDir, relativePath);
    colorMapBuffers[index] = fs.readFileSync(colorMapPath);
  }
  utils.fillPalettes(palettes, a1PaletteBuffer, colorMapBuffers);
}

function generateItemsWebImage(mod, version) {
  fillPalettes(mod, version);
  const modDataDir = `./public/d2/game_data/${mod}/version_${version}`;
  const sdInputDir = `${modDataDir}/global/items`;
  const hdInputDir = `${modDataDir}/hd/global/ui/items`;
  // let alreadyGeneratedCount = 0;
  // let newGeneratedCount = 0;
  // let errorCount = 0;

  if (fs.existsSync(sdInputDir)) {
    fs.readdir(sdInputDir, { recursive: true }, function (err, files) {
      if (err) {
        console.error(`Could not list the directory ${sdInputDir}`, err);
        process.exit(1);
      }

      files.forEach(function (file) {
        const fileName = file.split('.').slice(0, -1).join('.');
        const extension = file.split('.').pop();
        if (extension.toUpperCase() == 'DC6') {
          const ouputPath = path.join(sdInputDir, `${fileName}.png`);

          // Do not regenerate existing png
          if (!fs.existsSync(ouputPath)) {
            const inputPath = path.join(sdInputDir, file);
            const dc6 = fs.readFileSync(inputPath);
            try {
              // BEWARE: some DC6 are malformed, even SixDice crashes when opening them
              const canvas = utils.CanvasFromDC6(null, dc6, palettes);
              if (canvas) {
                const context = canvas.getContext('2d');
                const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

                var imgPng = new PNG({
                  width: imgData.width,
                  height: imgData.height,
                });
                imgPng.data = Buffer.from(imgData.data);
                // imgPng.pack().pipe(fs.createWriteStream(ouputPath)) // Will create an "Error: EMFILE: too many open files"
                const buffer = PNG.sync.write(imgPng);
                fs.writeFileSync(ouputPath, buffer);
                console.log(`Generated file ${file}`);
                // newGeneratedCount++;
              }
            } catch (err) {
              console.warn(`Skipped file ${file} which is corrupted` /*, err*/);
            }
          } else {
            // console.log(`File ${file} already exists`)
            // alreadyGeneratedCount++;
          }
        } else {
          // console.log(`Extension ${extension}`)
        }
      });
    });
  }

  fs.readdir(hdInputDir, { recursive: true }, function (err, files) {
    if (err) {
      console.error(`Could not list the directory ${hdInputDir}`, err);
      process.exit(1);
    }

    files.forEach(function (file) {
      const fileName = file.split('.').slice(0, -1).join('.');
      const extension = file.split('.').pop();
      if (extension.toUpperCase() == 'SPRITE') {
        const ouputPath = path.join(hdInputDir, `${fileName}.png`);

        // Do not regenerate existing png
        if (!fs.existsSync(ouputPath)) {
          const inputPath = path.join(hdInputDir, file);
          const sprite = fs.readFileSync(inputPath);
          const canvas = utils.CanvasFromSprite(null, sprite, palettes);
          if (canvas) {
            const context = canvas.getContext('2d');
            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

            var imgPng = new PNG({
              width: imgData.width,
              height: imgData.height,
            });
            imgPng.data = Buffer.from(imgData.data);
            // imgPng.pack().pipe(fs.createWriteStream(ouputPath)) // Will create an "Error: EMFILE: too many open files"
            const buffer = PNG.sync.write(imgPng);
            fs.writeFileSync(ouputPath, buffer);
            console.log(`Generated file ${file}`);
          }
        } else {
          // console.log(`File ${file} already exists`)
          // alreadyGeneratedCount++;
        }
      } else {
        // console.log(`Extension ${extension}`)
      }
    });
  });
}

// eslint-disable-next-line prettier/prettier
const minHtml = `<!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Untitled</title>
  </head>
  <body>
  </body>
  </html>`;

const dom = new JSDOM(minHtml);

global.window = dom.window;
global.document = dom.window.document;

generateItemsWebImage('vanilla', 96);
generateItemsWebImage('vanilla', 97);
generateItemsWebImage('vanilla', 98);
generateItemsWebImage('vanilla', 99);
generateItemsWebImage('remodded', 98);
generateItemsWebImage('remodded', 99);
