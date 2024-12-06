/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fade.js"; // this sets a 'DOMContentLoaded' handler
import "../js/LCEE-Core.js"; // component setup
import "../js/modules/common.js"; // common setup

import { stringify } from "nbtify";
import { compressionModes, endianButtonSelect, readARCFile, readMSSCMPFile, switchCompressionMode, switchMsscmpEndian } from '../js/LCEE-Core.js';
import { loadBG, showError } from '../js/background.js';
import { setVer } from '../js/ver.js';
import { readSaveFile } from "../js/LCEE-Core.js";

import type { NBTData } from "nbtify";
import { doubleImportTest, getAllElements, GetType } from "../js/modules/common.js";

doubleImportTest(new URL(import.meta.url).href);

let currentCard = "";

if (compressionModes == undefined) {
  showError("compressionModes is undefined! If you are in a dev env, you need to restart Vite.");
}

let selectedCompressionMode = compressionModes.commonBig;
function selectCompressionMode(): void {
  if (selectedCompressionMode >= compressionModes.vita) {
    selectedCompressionMode = compressionModes.commonBig;
  } else {
    selectedCompressionMode++;
  }
  switchCompressionMode(selectedCompressionMode);
}

let selectedEndian = endianButtonSelect.autoDetect;
function selectEndianness(): void {
  if (selectedEndian >= endianButtonSelect.little) {
    selectedEndian = endianButtonSelect.autoDetect;
  } else {
    selectedEndian++;
  }
  switchMsscmpEndian(selectedEndian);
}

function showSelectCard() {
  const allVisibleElements = getAllElements(GetType.visible);
    // hide all visible elements
  allVisibleElements.forEach(element => {
      if (!["bg"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()) && ["backSubCard", "lceSaveCard", "msscmpCard", "creditsCard", "arcCard"].includes(element.id))
          element.style.display = "none";
  });
  (document.querySelector("#back") as HTMLDivElement).style.display = "flex";
  (document.querySelector("#typeSelectCard") as HTMLDivElement).style.display = "flex";
}

document.querySelector('#CompModeBtn')!.addEventListener('click', selectCompressionMode);
document.querySelector('#EndianButton')!.addEventListener('click', selectEndianness);
document.querySelector('#backNBTBtn')!.addEventListener('click', hideNBTCard);
document.querySelector('#backSubCard')!.addEventListener('click', showSelectCard);
loadBG(true);
setVer("le");


function selectSG() {
  const allVisibleElements = getAllElements(GetType.visible);
    // hide all visible elements
  allVisibleElements.forEach(element => {
    if (!["bg"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()) && ["typeSelectCard", "back"].includes(element.id))
          element.style.display = "none";
  });
  (document.querySelector("#backSubCard") as HTMLDivElement).style.display = "flex";
  (document.querySelector("#lceSaveCard") as HTMLDivElement).style.display = "flex";
  (document.querySelector("#creditsCard") as HTMLDivElement).style.display = "flex";
  currentCard = "lceSaveCard";
}

function selectMSSCMP() {
  const allVisibleElements = getAllElements(GetType.visible);
    // hide all visible elements
  allVisibleElements.forEach(element => {
      if (!["bg"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()) && ["typeSelectCard", "back"].includes(element.id))
          element.style.display = "none";
  });
  (document.querySelector("#backSubCard") as HTMLDivElement).style.display = "flex";
  (document.querySelector("#msscmpCard") as HTMLDivElement).style.display = "flex";
  currentCard = "msscmpCard";
}

function selectARC() {
  const allVisibleElements = getAllElements(GetType.visible);
    // hide all visible elements
  allVisibleElements.forEach(element => {
      if (!["bg"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()) && ["typeSelectCard", "back"].includes(element.id))
          element.style.display = "none";
  });
  (document.querySelector("#backSubCard") as HTMLDivElement).style.display = "flex";
  (document.querySelector("#arcCard") as HTMLDivElement).style.display = "flex";
  currentCard = "arcCard";
}

document.querySelector('#saveTypeButton')!.addEventListener('click', selectSG);
document.querySelector('#arcTypeButton')!.addEventListener('click', selectARC);
document.querySelector('#msscmpTypeButton')!.addEventListener('click', selectMSSCMP);

export function showNBTCard(data: NBTData | undefined): void {
    if (data == undefined)
      throw new Error("Data is undefined!");

      document.getElementById("backSubCard")!.style.display = "none";
      document.getElementById(currentCard)!.style.display = "none";
      document.getElementById("nbtCard")!.style.display = "flex";
      document.getElementById("backNBTBtn")!.style.display = "block";
      document.getElementById("nbtData")!.innerText = stringify(data, { space: 2 });
}

export function hideNBTCard(): void {
    if (document.getElementById("nbtCard")!.style.display !== "none") {
        document.getElementById("backNBTBtn")!.style.display = "none";
        document.getElementById("backSubCard")!.style.display = "flex";
        document.getElementById(currentCard)!.style.display = "flex";
        document.getElementById("nbtCard")!.style.display = "none";
    }
}

(document.getElementById("saveFileInput")!).addEventListener("change", onFileSelected);

function onFileSelected(this: HTMLInputElement): void {
  const file = this.files![0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readSaveFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

(document.getElementById("msscmpFileInput")!).addEventListener("change", onMSSCMPFileSelected);
(document.getElementById("arcFileInput")!).addEventListener("change", onARCFileSelected);

function onMSSCMPFileSelected(this: HTMLInputElement): void {
  const file = this.files![0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readMSSCMPFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

function onARCFileSelected(this: HTMLInputElement): void {
  const file = this.files![0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readARCFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
}

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer!.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      readSaveFile(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  }
});

(document.querySelector('#backNBT')! as HTMLDivElement).innerText = await getTranslation("base.back");