/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

const msgbox: HTMLElement = document.querySelector('#msgbox')!;

let msgboxExists = false;
let msgboxShown = false;

/** Creates a messagebox */
export function createMSGBox(title: string, message: string, buttons: Array<string> = []): void {
    if (buttons === undefined) {
        buttons = [];
    }

    var msgbox = document.createElement('card');
    msgbox.id = 'msgbox';
    msgbox.style.position = 'absolute';

    var msgboxContainer = document.createElement('div');
    msgboxContainer.id = 'msgboxContainer';
    msgboxContainer.style.display = 'block';
    msgboxContainer.style.position = 'absolute';
    msgboxContainer.style.width = '100%';
    msgboxContainer.style.height = '100%';
    msgboxContainer.style.zIndex = '10';
    msgboxContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    var msgCancel = document.createElement('button');
    msgCancel.id = 'msgCancel';
    msgCancel.innerText = 'Cancel';
    msgCancel.className = 'button';
    msgCancel.style.display = 'none';

    var msgOK = document.createElement('button');
    msgOK.id = 'msgOK';
    msgOK.innerText = 'OK';
    msgOK.className = 'button';
    msgOK.style.display = 'none';

    var msgTitle = document.createElement('h1');
    msgTitle.id = 'msgTitle';
    msgTitle.innerText = title;

    var msgContent = document.createElement('p');
    msgContent.id = 'msgContent';
    msgContent.innerText = message;

    document.getElementById("homepage")!.appendChild(msgboxContainer);
    msgboxContainer.appendChild(msgbox);
    msgbox.appendChild(msgTitle);
    msgbox.appendChild(msgContent);
    msgbox.appendChild(msgCancel);
    msgbox.appendChild(msgOK);

    if (buttons.includes("msgCancel")) {
        msgCancel.style.display = 'block';
    }
    if (buttons.includes("msgOK")) {
        msgOK.style.display = 'block';
    }

    msgboxExists = true;
    msgboxShown = true;
}

/** Creates the messagebox if it doesn't exist, updates it if it does. */
export function useMSGBox(title: string, message: string, buttons: Array<string> = []): void {
    if (!msgboxExists) {
        createMSGBox(title, message, buttons);
        return;
    }

    if (!msgboxShown) {
        return;
    }

}

export function hideMSGBox(): void {
    msgbox.style.display = 'none';
    msgboxShown = false;
}

export function showMSGBox(): void { 
    msgbox.style.display = 'none';
    msgboxShown = true;
}
