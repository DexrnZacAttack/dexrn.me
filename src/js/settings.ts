/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import langEN from "../assets/lang/en-US.json?url";
import langCN from "../assets/lang/zh-CN.json?url";

export type Theme = "unselectedtheme" | "default-light" | "default-dark";

type languages = "en-US" | "zh-CN";

export function setTheme(theme: "default-light" | "default-dark") {
  var expirationDate = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
  document.cookie = `Theme=${theme}; expires=${expirationDate.toUTCString()}; path=/`;

  applyTheme(theme);
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  switch (theme) {
    case "default-light":
      root.style.setProperty('--loading-screen-bg', 'url(\'/bglight.webp\')');
      root.style.setProperty('--prim-bg-color', 'rgba(255, 255, 255, 0.3)');
      root.style.setProperty('--alt-bg-color', 'rgba(200, 200, 200, 0.3)');
      root.style.setProperty('--prim-control-color', 'rgba(255, 255, 255, 0.5)');  
      root.style.setProperty('--prim-border-color', 'rgba(255, 255, 255, 0.2)'); 
      root.style.setProperty('--prim-img-border-color', 'rgba(15, 15, 15, 0.3)'); 
      root.style.setProperty('--prim-moreopaque-border-color', 'rgba(200, 200, 200, 0.5)'); 
      root.style.setProperty('--prim-control-border-color', 'rgba(200, 200, 200, 0.2)'); 
      root.style.setProperty('--prim-other-bg-color', 'rgba(255, 255, 255, 0.2)');
      root.style.setProperty('--prim-reading-bg-color', 'rgba(229, 229, 229, 1)');
      root.style.setProperty('--prim-color', 'rgba(255, 255, 255, 1)');
      root.style.setProperty('--prim-hover-color', 'rgba(0, 120, 215, 0.3)'); 
      root.style.setProperty('--prim-subborder-color', 'rgba(255, 255, 255, 0.212)'); 
      root.style.setProperty('--prim-shadow-color', 'rgba(100, 100, 100, 0.3)'); 
      root.style.setProperty('--alt-border-size', '4px'); 
      root.style.setProperty('--prim-border-size', '2px');
      root.style.setProperty('--prim-text-color', 'black');
      root.style.setProperty('--href-color', '#0c3485');
      root.style.setProperty('--href-hover-color', '#07235c');
      break;
    case "default-dark":
    default:
      root.style.setProperty('--loading-screen-bg', 'url(\'/bgdark.webp\')');
      root.style.setProperty('--prim-bg-color', 'rgba(0, 0, 0, 0.6)');
      root.style.setProperty('--alt-bg-color', 'rgba(50, 50, 50, 0.6)');
      root.style.setProperty('--prim-control-color', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--prim-border-color', 'rgba(100, 100, 100, 0.2)');
      root.style.setProperty('--prim-img-border-color', 'rgba(15, 15, 15, 0.3)');
      root.style.setProperty('--prim-moreopaque-border-color', 'rgba(100, 100, 100, 0.5)');
      root.style.setProperty('--prim-control-border-color', 'rgba(150, 150, 150, 0.2)');
      root.style.setProperty('--prim-other-bg-color', 'rgba(0, 0, 0, 0.2)');
      root.style.setProperty('--prim-reading-bg-color', 'rgba(15, 15, 15, 1)');
      root.style.setProperty('--prim-color', 'rgba(0, 0, 0, 1)');
      root.style.setProperty('--prim-hover-color', 'rgba(0, 120, 215, 0.3)');
      root.style.setProperty('--prim-subborder-color', 'rgba(255, 255, 255, 0.212)');
      root.style.setProperty('--prim-shadow-color', 'rgba(0, 0, 0, 0.6)');
      root.style.setProperty('--alt-border-size', '4px'); 
      root.style.setProperty('--prim-border-size', '2px');
      root.style.setProperty('--prim-text-color', 'white');
      root.style.setProperty('--href-color', '#109fff');
      root.style.setProperty('--href-hover-color', '#0b6cac');
      break;
  }
}

export function getThemeCookie<K extends string>(name: K): K extends "Theme" ? Theme : string {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      // @ts-expect-error - type inference, TS overloads would work better to solve this
      return cookieValue;
    }
  }
  return "unselectedtheme";
}

const savedTheme = getThemeCookie("Theme");

applyTheme(savedTheme);

export async function checkLang(syslang?: languages): Promise<void> {
  await setLang(getLangFilePath(syslang));
}

export function getLangFilePath(syslang?: languages): string {
  const lang: languages | undefined | null = getLang();
  let langFilePath: string;
  if (lang) {
  switch (lang.toLowerCase()) {
    case "zh-cn":
      langFilePath = langCN;
      break;
    case "en-us":
    default:
      langFilePath = langEN;
      break;
  }} else if (syslang) {
    switch (syslang.toLowerCase()) {
      case "zh-cn":
        langFilePath = langCN;
        break;
      case "en-us":
      default:
        langFilePath = langEN;
        break;
    }} else {
      langFilePath = langEN;
    }
  return langFilePath;
}


export function getLang(): languages | undefined | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "lang") {
      return value as languages;
    }
  } 
  return null;
}

export async function getTranslation(key: string): Promise<string> {
    const langPath = getLangFilePath();
    try {
        const response = await fetch(langPath);
        if (!response.ok) {
            return "fetch error";
        }
        const data = await response.json();
        function getNested(obj: any, path: string): any {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        }
        const translation = getNested(data, key);
        return translation ? translation.toString() : `${key} (UNLOCALIZED)`;
    } catch (error) {
        return 'translation list error';
    }
}

type LangMappings = typeof import("../assets/lang/en-US.json") | typeof import("../assets/lang/zh-CN.json");

// Dexrn: Localization! (Kinda janky.)
async function setLang(langFilePath: string): Promise<void> {
  try {
    const response: Response = await fetch(langFilePath);
    const data: LangMappings = await response.json();
      translateElement(activityPath, data.path.activity);
      translateElement(discordPath, data.path.discord);
      translateElement(steamPath, data.SteamPath);
      translateElement(aboutPath, data.path.about);
      translateElement(stuffPath, data.path.links);
      translateElement(mainbtn1, data.main.button1);
      translateElement(mainbtn2, data.main.button2);
      translateElement(mainbtn3, data.main.button3);
      translateElement(abm1, data.main.about.line1);
      translateElement(abm2, data.main.about.line2);
      translateElement(saveBtn, data.settings.save);
      translateElement(settingsPath, data.path.settings);
      translateElement(backbtn, data.base.back);
      translateElement(languagetxt, data.settings.language);
      translateElement(settingsTabButton, data.main.settings);
      translateElement(backNBT, data.backNBT);
      translateElement(backbtn2, data.base.backAlt);
      translateElement(qmghpPath, data.path.qmghp);
      translateElement(lcetPath, data.path.lceTools);
      translateElement(lcetSavePath, data.path.lceExtractor);
      translateElement(lcetArcPath, data.path.arcExtractor);
      translateElement(lceeNbtPath, data.path.lceNbt);
      translateElement(lcetMsscmpPath, data.path.msscmpExtractor);
      translateElement(lceSaveFileSelectBtn, data.lcetools.save.selectFile);
      translateElement(msscmpfileselectbtn, data.lcetools.msscmp.selectFile);
      translateElement(arcFileSelectBtn, data.lcetools.arc.selectFile);
      translateElement(fileselectbtn, data.qmghp.selectFile);
      translateElement(goBack, data.error.goBack);
      translateElement(output, data.qmghp.outputPlaceholder);
      translateElement(qmgrPath, data.path.qmgResearch);
      translateElement(_404msg, data.error.notFound);
      translateElement(homebtn, data.base.goHome);
      translateElement(_403msg, data.error.forbidden);
      translateElement(selopt, data.settings.optionSelect);
      translateElement(selopt2, data.settings.optionSelect);
      translateElement(darkthmopt, data.settings.theme.dark);
      translateElement(lightthmopt, data.settings.theme.light);
      translateElement(themetxt, data.settings.theme.string);
      translateElement(blogbtntxt, data.main.blog);
      translateElement(blogTabButton, data.main.blog);
      translateElement(stuff2Path, data.path.blog);
  } catch (error) {
    console.error("Error whilst loading lang file:", error);
  }
}

export function getLocalization(langFilePath: string, code: string) {
  fetch(langFilePath)
  .then((response) => response.json())
  .then((data) => {
    if (data[code]) {
      return data[code];
    }
  })
  .catch((error) => console.error("Error whilst loading lang file:", error));
}

/**
 * Sets the text of the element to the string given.
 * @param elementId Element to search for
 * @param value String to set said element's textContent
 */
function translateElement(element: Element, value: string): void {
  element.textContent = value;
}
