/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import {getAllElements, GetType} from "./modules/common.js";

export enum CurrentTab {
    DISCORD,
    BLOG
}
export let curTab: CurrentTab;

export function setCurTab(newValueOrSetter: CurrentTab | ((previous: CurrentTab) => CurrentTab)): CurrentTab {
    if (typeof newValueOrSetter === "number"){
        curTab = newValueOrSetter;
        return newValueOrSetter;
    }
    const previous = curTab;
    return newValueOrSetter(previous);
}

// Currently, this is used globally within event handlers inlined in `index.html`
// @ts-ignore IDK why its complaining here
globalThis.changeMainCard = changeTab;

type ChangeMainCard = typeof changeTab;

declare global {
    let changeMainCard: ChangeMainCard;
}

const mainCard = document.getElementById('mainCard');
const activityCard = document.getElementById('activityCard');
const aboutCard = document.getElementById('aboutCard');
const linksCard = document.getElementById('linksCard');
const blogCard = document.getElementById('blogCard');

const tabContents: { [key: string]: Array<HTMLElement> } = {
    'Discord': [mainCard!, activityCard!, aboutCard!, linksCard!],
    'Blog': [blogCard!]
};

function showClickedButton(activeTabId: string): void {
    Object.keys(tabContents).forEach(tabId => {
        const tabButton = document.getElementById(`${tabId.toLowerCase()}TabButton`);
        if (tabButton) {
            tabButton.className = (tabId === activeTabId) ? 'tabButtonClicked' : 'tabbutton';
        }
    });
}

function switchTabs(activeTabItems: Array<HTMLElement>): void {
    const allVisibleElements = getAllElements(GetType.all);
    allVisibleElements.forEach(element => {
        if (!["homepage"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()) && "CARD".includes(element.nodeName) && !activeTabItems.includes(element) && !"settingsDoNotHide".includes(element.id))
            element.style.display = "none";
        if (activeTabItems.includes(element))
            element.style.display = "block";
    });

}

export function changeTab(whatToChangeTo: string): void {
    if (!(whatToChangeTo in tabContents)) return;

    if (CurrentTab[whatToChangeTo.toUpperCase() as keyof typeof CurrentTab] == curTab)
        return;

    curTab = CurrentTab[whatToChangeTo.toUpperCase() as keyof typeof CurrentTab];

    showClickedButton(whatToChangeTo);

    if (whatToChangeTo === 'Blog') {
        const height = [
            mainCard,
            activityCard,
            aboutCard,
            linksCard
        ].filter(card => card !== null).reduce((sum, card) => sum + card!.offsetHeight, 0) + 12 * 3 + 5;

        if (blogCard) {
            blogCard.style.height = `${height}px`;
        }
    }

    switchTabs(tabContents[whatToChangeTo]!);
}