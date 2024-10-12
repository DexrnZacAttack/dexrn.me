/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

// for later

// ensures that this file is a module (in TypeScript's eyes),
// since no existing exports are present

export enum GetType {
    all,
    visible,
    hidden
}

// if I don't do this we get funny "too much recursion"
const conLog = console.log;

export function log(string: string) {
    if (import.meta.env.DEV) {
        conLog(string ?? "dunno");
    }
}

console.log = log;

let callCount = 0;
let callLocations: Array<string> = [];

export function doubleImportTest(url: string) {
    // call this from index.ts for each page as those usually get double-imported.
    if (import.meta.env.DEV) {
        callCount += 1;
        callLocations.push(url);
        if (callCount >= 2) {
            const noteBar = document.createElement("div");
            noteBar.className = "topcard";
            const note = document.createElement("p");
            note.innerText = `WARNING! Your browser has double-imported index.ts... Things may not work as expected.\nCheck the console for more info.`;
            note.style.textAlign = "center";
            noteBar.appendChild(note);
            (document.querySelector(".bg")!).appendChild(noteBar);
            console.warn(`Test function was called ${callCount} times by [${callLocations}]`);
        }
    }
}

/** for blogs */
export function parseString(str: string) {
    return str.replace(/\\r/g, '\r').replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

export function getAllElements(getType: GetType) {
    const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
    let allElementsOfType: Array<HTMLElement> = []

    if (getType !== GetType.all) {
        allElements.forEach(element => {
            switch (getType) {                
                case GetType.visible:
                    if (element.style.display !== "none") {
                        allElementsOfType.push(element);
                    }
                    break;
                case GetType.hidden:
                    if (element.style.display === "none") {
                        allElementsOfType.push(element);
                    }
                    break;
            }
        });
        return allElementsOfType;
    } else {
        return allElements;
    }

}