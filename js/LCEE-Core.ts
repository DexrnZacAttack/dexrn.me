/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import { renderBasicContainer, Container } from "./LCEE-GUI.js";
import {
  readSave,
  decompressVitaRLE,
  SaveIndex,
  readMSSCMP,
  readARC
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
};

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
          saveFiles = (await readSave(data, littleEndian)).fileIndex;
        } else {
          saveFiles = (
            await readSave(
              new File(
                [new Blob([decompressVitaRLE(fileArray.slice(8))])],
                data.name
              ),
              littleEndian
            )
          ).fileIndex;
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
      
      await renderBasicContainer(container, sgName, document.getElementById("files") as HTMLDivElement, document.getElementById("saveCenter") as HTMLDivElement);
    } catch (e) {
      console.error(e);
    }
}
