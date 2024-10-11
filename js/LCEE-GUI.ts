/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import JSZip from "jszip";
import { readNBTfromFile, isReadable } from "./modules/NBT.js";
import { showNBTCard } from "../LCETools/index.js";
import { downloadZip } from "./LCEE-Core.js";

// todo: don't use 2 functions to do the same stuff, am just doing this to get SOMETHING working as someone seems to want to use this.

export interface Container {
  name: string,
  data: Uint8Array
}

function genRandString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function renderBasicContainer(files: Container[], origFileName: string, container: HTMLDivElement, center: HTMLDivElement): Promise<void> {
  let downloadZipBtn: HTMLButtonElement = document.querySelector("#downloadArchiveButton")!;
  downloadZipBtn?.remove();
  (document.querySelector("#saveLog") as HTMLDivElement)!.style.display = "none";
  container.innerHTML = "";
  container.style.display = "none";
  const filesRoot = document.createElement("div");
  filesRoot.id = `filesRoot_${genRandString(20)}`;
  container!.appendChild(filesRoot);
  var zip = new JSZip();

  if (!Array.isArray(files) || files.length === 0) {
    console.log(files);
    container.innerText = "Read 0 files.";
    container.style.display = "flex";
    return;
  }

  for (const containerFile of files) {
    console.log(containerFile.name);
    const blobUrl = URL.createObjectURL(new File([containerFile.data], containerFile.name));
    
    const fileContainer = document.createElement("div");
    fileContainer.className = "fileContainer";
    fileContainer.style.display = "flex";
    fileContainer.style.flexDirection = "row";
    fileContainer.style.backgroundColor = "rgba(50, 50, 50, 0.5)";
    fileContainer.style.marginBottom = "10px";
  
    const cFile = document.createElement("a");
    cFile.className = "cFile";
    cFile.href = blobUrl;
    cFile.download = containerFile.name;
  
    const filePathSegments = containerFile.name.includes("/") ? containerFile.name.split("/") : containerFile.name.split("\\");
    const fileName = filePathSegments.pop();
    cFile.innerText = fileName ?? "Unknown";
  
    let parentFolder = container; 
  
    filePathSegments.forEach((part, index) => {
      const folderId = "folder_" + filePathSegments.slice(0, index + 1).join("_");
      let folder = document.getElementById(folderId);
      
      if (!folder) {
        folder = document.createElement("div");
        folder.className = "folder";
        folder.id = folderId;
  
        const folderName = document.createElement("h3");
        folderName.innerText = part;
        folderName.className = "folderName";
  
        folder.appendChild(folderName);
        parentFolder.appendChild(folder);
      }
  
      parentFolder = folder as HTMLDivElement;
    });
  
    parentFolder.appendChild(fileContainer);
    cFile.download = fileName!;
    fileContainer.appendChild(cFile);
  
    if ((await isReadable(containerFile)) == true) {
      var viewNBTButton = document.createElement("button");
      viewNBTButton.onclick = async () => {
        showNBTCard(await readNBTfromFile(containerFile));
      };
      
      viewNBTButton.innerText = "View NBT";
      viewNBTButton.className = "button";
      viewNBTButton.style.padding = "unset";
      viewNBTButton.style.marginTop = "unset";
      viewNBTButton.style.marginBottom = "unset";
      viewNBTButton.style.marginLeft = "auto";
      fileContainer.appendChild(viewNBTButton);
    }

    zip.file(containerFile.name, containerFile.data);
    container.style.display = "flex";
    container.style.flexDirection = "column";
  }  

  downloadZipBtn = document.createElement("button");

  downloadZipBtn.onclick = async () => {
    await downloadZip(zip, origFileName);
  };

  downloadZipBtn.innerText = "Download all";
  downloadZipBtn.className = "button";
  downloadZipBtn.id = "downloadArchiveButton";
  center.appendChild(downloadZipBtn);
}