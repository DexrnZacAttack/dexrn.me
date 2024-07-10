import JSZip from "jszip";
import { readNBTfromFile, isReadable } from "./modules/NBT.js";
import { showNBTCard } from "../LCETools/index.js";
import { downloadZip } from "./LCEE-Core.js";
import { index, msscmpFile } from "liblce";

// todo: don't use 2 functions to do the same stuff, am just doing this to get SOMETHING working as someone seems to want to use this.

export async function renderSave(files: index[], origFileName: string): Promise<void> {
  let downloadZipBtn: HTMLButtonElement = document.querySelector("#downloadArchiveButton")!;
  downloadZipBtn?.remove();
  const filesDiv: HTMLDivElement = document.querySelector("#files")!;
  const center: HTMLDivElement = document.querySelector(".center")!;
  (document.querySelector("#saveLog") as HTMLDivElement)!.style.display = "none";
  filesDiv.innerHTML = "";
  filesDiv.style.display = "none";
  const lceRoot = document.createElement("div");
  lceRoot.id = "lceRoot";
  document.getElementById("files")!.appendChild(lceRoot);
  var zip = new JSZip();
  for (const file of files) {
    console.log(file.name);
    const blobUrl = URL.createObjectURL(file.data);
    
    const LCEFileContainer = document.createElement("div");
    LCEFileContainer.className = "LCEFileContainer";
    LCEFileContainer.style.display = "flex";
    LCEFileContainer.style.flexDirection = "row";
    LCEFileContainer.style.backgroundColor = "rgba(50, 50, 50, 0.5)";
    LCEFileContainer.style.marginBottom = "10px";
  
    const lceFile = document.createElement("a");
    lceFile.className = "LCEFile";
    lceFile.href = blobUrl;
    lceFile.download = file.name;
  
    const filePathSegments = file.name.split("/");
    const fileName = filePathSegments.pop();
    lceFile.innerText = fileName ?? "Unknown";
  
    let parentFolder = filesDiv; 
  
    filePathSegments.forEach((part, index) => {
      const folderId = "LCEFolder_" + filePathSegments.slice(0, index + 1).join("_");
      let lceFolder = document.getElementById(folderId);
      
      if (!lceFolder) {
        lceFolder = document.createElement("div");
        lceFolder.className = "LCEFolder";
        lceFolder.id = folderId;
  
        const folderName = document.createElement("h3");
        folderName.innerText = part;
        folderName.className = "LCEFolderName";
  
        lceFolder.appendChild(folderName);
        parentFolder.appendChild(lceFolder);
      }
  
      parentFolder = lceFolder as HTMLDivElement;
    });
  
    parentFolder.appendChild(LCEFileContainer);
    lceFile.download = fileName!;
    LCEFileContainer.appendChild(lceFile);
  
    if ((await isReadable(file)) == true) {
      var viewNBTButton = document.createElement("button");
      viewNBTButton.onclick = async () => {
        showNBTCard(await readNBTfromFile(file));
      };
      
      viewNBTButton.innerText = "View NBT";
      viewNBTButton.className = "button";
      viewNBTButton.style.padding = "unset";
      viewNBTButton.style.marginTop = "unset";
      viewNBTButton.style.marginBottom = "unset";
      viewNBTButton.style.marginLeft = "auto";
      LCEFileContainer.appendChild(viewNBTButton);
    }

    zip.file(file.name, file.data);
    filesDiv.style.display = "flex";
    filesDiv.style.flexDirection = "column";
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

// literally other function copy pasted LMFAO
export async function renderMSSCMP(files: msscmpFile[], origFileName: string): Promise<void> {
  let downloadZipBtn: HTMLButtonElement = document.querySelector("#msscmpDownloadArchiveButton")!;
  downloadZipBtn?.remove();
  const filesDiv: HTMLDivElement = document.querySelector("#msscmpFiles")!;
  const center = document.querySelector("#msscmpCenter")!;
  (document.querySelector("#msscmpLog") as HTMLDivElement)!.style.display = "none";
  filesDiv.innerHTML = "";
  filesDiv.style.display = "none";
  const lceMSSCMPRoot = document.createElement("div");
  lceMSSCMPRoot.id = "lceMSSCMPRoot";
  document.getElementById("msscmpFiles")!.appendChild(lceMSSCMPRoot);
  var zip = new JSZip();
  for (const file of files) {
    console.log(file.file.name);
    const blobUrl = URL.createObjectURL(file.file);
    
    const LCEFileContainer = document.createElement("div");
    LCEFileContainer.className = "LCEFileContainer";
    LCEFileContainer.style.display = "flex";
    LCEFileContainer.style.flexDirection = "row";
    LCEFileContainer.style.backgroundColor = "rgba(50, 50, 50, 0.5)";
    LCEFileContainer.style.marginBottom = "10px";
  
    const lceFile = document.createElement("a");
    lceFile.className = "LCEFile";
    lceFile.href = blobUrl;
    lceFile.download = file.file.name;
  
    const filePathSliceNDiced = file.file.name.split("/");
    const fileName = filePathSliceNDiced.pop();
    lceFile.innerText = fileName ?? "Unknown";
  
    let parentFolder = filesDiv; 
  
    filePathSliceNDiced.forEach((part, index) => {
      const folderId = "LCEFolder_" + filePathSliceNDiced.slice(0, index + 1).join("_");
      let lceFolder = document.getElementById(folderId);
      
      if (!lceFolder) {
        lceFolder = document.createElement("div");
        lceFolder.className = "LCEFolder";
        lceFolder.id = folderId;
  
        const folderName = document.createElement("h3");
        folderName.innerText = part;
        folderName.className = "LCEFolderName";
  
        lceFolder.appendChild(folderName);
        parentFolder.appendChild(lceFolder);
      }
  
      parentFolder = lceFolder as HTMLDivElement;
    });
  
    parentFolder.appendChild(LCEFileContainer);
    lceFile.download = fileName!;
    LCEFileContainer.appendChild(lceFile);
  
    zip.file(file.file.name, file.file);
    filesDiv.style.display = "flex";
    filesDiv.style.flexDirection = "column";
  }  

  downloadZipBtn = document.createElement("button");

  downloadZipBtn.onclick = async () => {
    await downloadZip(zip, origFileName);
  };

  downloadZipBtn.innerText = "Download all";
  downloadZipBtn.className = "button";
  downloadZipBtn.id = "msscmpDownloadArchiveButton";
  center.appendChild(downloadZipBtn);
}
