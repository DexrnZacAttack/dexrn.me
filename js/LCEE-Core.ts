/*
Copyright 2024 Dexrn ZacAttack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { renderMSSCMP, renderSave } from "./LCEE-GUI.js";
import {
  readSave,
  decompressVitaRLE,
  index,
  readMSSCMP
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
      await renderMSSCMP(await readMSSCMP(data, littleEndian), name);
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
      let saveFiles: index[] = [];
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

      await renderSave(saveFiles, sgName);
    } catch (e) {
      console.error(e);
    }
}
