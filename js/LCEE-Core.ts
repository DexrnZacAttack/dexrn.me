/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import {Container, renderBasicContainer} from "./LCEE-GUI.js";
import {
  CompressionTypes,
  compressSave,
  decompressVitaRLE,
  readARC,
  readMSSCMP,
  readSave,
  Savegame,
  SaveIndex,
  writeSave
} from "liblce";

import type JSZip from "jszip";

const compModeBtn: HTMLButtonElement = document.querySelector("#CompModeBtn")!;
const endianButton: HTMLButtonElement = document.querySelector("#EndianButton")!;

let littleEndian: boolean;

let vita: boolean = false;

export enum compressionModes {
  commonBig,
  commonLittle,
  vita
}

export enum endianButtonSelect {
  autoDetect,
  big,
  little
}

export function switchCompressionMode(mode: compressionModes): void {
  switch (mode) {
    case compressionModes.commonBig:
      compModeBtn.innerText = "Save type: Wii U, PS3, Xbox 360 (Decompressed)";
      littleEndian = false;
      vita = false;
      break;
    case compressionModes.commonLittle:
      compModeBtn.innerText = "Save type: Switch, PS4, Xbox One";
      littleEndian = true;
      vita = false;
      break;
    case compressionModes.vita:
      compModeBtn.innerText = "Save type: Vita";
      littleEndian = true;
      vita = true;
      break;
  }
}

// todo: ALL OF THIS MSSCMP STUFF IS SO SO SO JANKY AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

export function switchMsscmpEndian(endian: endianButtonSelect): void {
  switch (endian) {
    case endianButtonSelect.autoDetect:
      endianButton.innerText = "Auto Detect";
      littleEndian = undefined!;
      break;
    case endianButtonSelect.big:
      endianButton.innerText = "Big Endian";
      littleEndian = false;
      break;
    case endianButtonSelect.little:
      endianButton.innerText = "Little Endian";
      littleEndian = true;
      break;
  }
}

export async function downloadZip(zip: JSZip, name: string): Promise<void> {
  try {
    const file: Blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${name}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error(error);
  }
}

export async function readARCFile(data: File, name: string): Promise<void> {
  try {
    const arc = await readARC(data);
    const container: Container[] = await Promise.all(
      arc.fileIndex.map(async (file) => {
        return {
          name: file.name,
          data: new Uint8Array(await file.data.arrayBuffer()),
        };
      })
    );

    await renderBasicContainer(container, name, document.getElementById("arcFiles") as HTMLDivElement, document.getElementById("arcCenter") as HTMLDivElement);
  } catch (e) {
    console.log(e);
  }
}

export async function readMSSCMPFile(data: File, name: string): Promise<void> {
  const fileMagicReader = new Uint8Array(await data.arrayBuffer());
  const fileMagic = new TextDecoder("utf-8").decode(
    fileMagicReader.slice(0, 4)
  );
  let endiannessAllowedMagic = ["BANK", "KNAB"];
  switch (littleEndian) {
    case true:
      endiannessAllowedMagic = ["KNAB"];
      break;
    case false:
      endiannessAllowedMagic = ["BANK"];
      break;
    case undefined:
      break;
  }

  if (endiannessAllowedMagic.includes(fileMagic)) {
    try {
      const msscmp = await readMSSCMP(data, littleEndian);
      const container: Container[] = await Promise.all(
        msscmp.map(async (file) => {
          return {
            name: file.fileName + ".binka",
            data: new Uint8Array(await file.file.arrayBuffer()),
          };
        })
      );

      await renderBasicContainer(container, name, document.getElementById("msscmpFiles") as HTMLDivElement, document.getElementById("msscmpCenter") as HTMLDivElement);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.error(`Invalid magic, expected any of [${endiannessAllowedMagic}], got "${fileMagic}" instead.`);
    (document.querySelector("#msscmpLog")! as HTMLDivElement).innerText = `Invalid magic, expected any of [${endiannessAllowedMagic}], got "${fileMagic}" (0x${Array.prototype.map.call(fileMagic, c => ('0' + c.charCodeAt(0).toString(16)).slice(-2)).join('')}) instead.`;
  }
}

export async function readSaveFile(data: File, sgName: string): Promise<void> {
    try {
      const fileArray = new Uint8Array(await data.arrayBuffer());
      let saveFiles: SaveIndex[] = [];
      let save: Savegame;

      if (!littleEndian) {
        if (
          new TextDecoder()
            .decode(fileArray)
            .substring(0, 3)
            .replace(/\x00/g, "") == "CON"
        ) {
          console.log("This is an Xbox 360 package!!!");
        }
      }
      if (data) {
        if (!vita) {
          save = await readSave(data, littleEndian);
          saveFiles = save.fileIndex;
        } else {
          save = (
            await readSave(
              new File(
                [new Blob([decompressVitaRLE(fileArray.slice(8))])],
                data.name
              ),
              littleEndian
            )
          );
          saveFiles = save.fileIndex;
        }
      } else {
        console.error("No data received...");
      }

      const container: Container[] = await Promise.all(
        saveFiles.map(async (file) => {
          return {
            name: file.name,
            data: new Uint8Array(await file.data.arrayBuffer()),
          };
        })
      );

      document.querySelector("#lceSaveFileDownloadModifiedButton")!.addEventListener("click", async () => {
        // dexrn comes back to 2098348092834 year old project and wonders what the fuck he was doing
        // am here to make save file creator for now then polish it Never:tm:
        // jk entire site rewrite in progress tho (slowly)

        // WHY DO I HAVE TO RECREATE THE SAVE FILE
        const thing = await compressSave(new Uint8Array(await (await writeSave(saveFiles.map(something => something.data), littleEndian)).arrayBuffer()), CompressionTypes.zlib, littleEndian);
        // dumb way to do it but it just needs to work
        thing[4] = thing[0]!;
        thing[5] = thing[1]!;
        thing[6] = thing[2]!;
        thing[7] = thing[3]!;

        thing[0] = 0;
        thing[1] = 0;
        thing[2] = 0;
        thing[3] = 0;

        const file: Blob = new File([thing.buffer], "savegame.dat");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = `savegame.dat`;
        link.click();
        URL.revokeObjectURL(link.href);
      })

      document.querySelector("#lceSaveAddFileButton")!.addEventListener("click", async () => {
        (document.querySelector("#fileInput") as HTMLInputElement)!.addEventListener("change", async () => {
          const file = (document.querySelector("#fileInput") as HTMLInputElement)!.files![0]!;
          if (file) {
            const reader = new FileReader();
            reader.onload = function () {

            };
            reader.readAsArrayBuffer(file);
            console.log(file.name);

            var shit = saveFiles.map(something => something.data);
            shit.push(file);

            save = await readSave(await writeSave(shit, littleEndian), littleEndian);
            saveFiles = save.fileIndex;
          }
        })
      });

      await renderBasicContainer(container, save!, sgName, document.getElementById("files") as HTMLDivElement, document.getElementById("saveCenter") as HTMLDivElement);
    } catch (e) {
      console.error(e);
    }
}
