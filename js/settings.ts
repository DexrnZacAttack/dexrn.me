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

import langEN from "../assets/lang/en-US.json?url";
import langCN from "../assets/lang/zh-CN.json?url";

export type Theme = "unselectedtheme" | "default-light" | "default-dark";

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

export function checkLang(syslang?: keyof LanyardLangNameMap): void {
  setLang(getLangFilePath(syslang));
}

export function getLangFilePath(syslang?: keyof LanyardLangNameMap): string {
  const lang = getLang();
  let langFilePath;
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


checkLang();

export function getLang(): keyof LanyardLangNameMap | undefined | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "lang") {
      return value as keyof LanyardLangNameMap;
    }
  } 
  return null;
}

export async function getTranslation(str: string): Promise<string> {
  const langPath = getLangFilePath();
  
  return fetch(langPath)
    .then((response) => {
      if (!response.ok) {
        return "fetch error";
      }
      return response.json();
    })
    .then((data) => {
      if (data[str]) {
        return data[str].toString();
      } else {
        return "string not found";
      }
    })
    .catch((error) => {
      console.error('Error fetching translations:', error);
      return 'translation list error';
    });
}


// Dexrn: Localization! (Kinda janky.)
function setLang(langFilePath: string): void {
  fetch(langFilePath)
    .then((response) => response.json())
    .then((data) => {
      checkIfExists("loadingText", data.LoadingText);
      checkIfExists("onlineState", data.Status2);
      checkIfExists("activityName", data.ActivityName);
      checkIfExists("activityState", data.ActivityState);
      checkIfExists("activityDetail", data.ActivityDetail);
      checkIfExists("activity-path", data.ActivityPath);
      checkIfExists("discord-path", data.DiscordPath);
      checkIfExists("steam-path", data.SteamPath);
      checkIfExists("about-path", data.AboutPath);
      checkIfExists("stuff-path", data.LinksPath);
      checkIfExists("mainbtn-1", data.MainPageButton1);
      checkIfExists("mainbtn-2", data.MainPageButton2);
      checkIfExists("mainbtn-3", data.MainPageButton3);
      checkIfExists("abm-1", data.AboutMeTxt1);
      checkIfExists("abm-2", data.AboutMeTxt2);
      checkIfExists("savebtn", data.SettingsSaveButton);
      checkIfExists("settings-path", data.SettingsPath);
      checkIfExists("backbtn", data.BackButton);
      checkIfExists("languagetxt", data.LanguageText);
      checkIfExists("settingsbtn", data.SettingsButton);
      checkIfExists("ftlLanguageTxt", data.FirstTimeLoadLanguageText);
      checkIfExists("ftlcbtn-1", data.FirstTimeLoadButton1);
      checkIfExists("backbtn", data.BackButton);
      checkIfExists("backNBT", data.backNBT);
      checkIfExists("backbtn2", data.BackButtonAlt);
      checkIfExists("qmghp-path", data.QMGHeaderParserPath);
      checkIfExists("lcet-path", data.LCETypePath);
      checkIfExists("lcet-save-path", data.LCEExtractorPath);
      checkIfExists("lcee-nbt-path", data.LCENBTPath);
      checkIfExists("lcet-msscmp-path", data.MSSCMPExtractorPath);
      checkIfExists("lceSaveFileSelectBtn", data.LCEFileSelectButton);
      checkIfExists("msscmpfileselectbtn", data.MSSCMPFileSelectButton);
      checkIfExists("fileselectbtn", data.FileSelectButton);
      checkIfExists("output", data.QMGHPOutputText);
      checkIfExists("qmgr-path", data.QMGResearchPath);
      checkIfExists("404msg", data.NotFoundErrorText);
      checkIfExists("homebtn", data.HomeButton);
      checkIfExists("403msg", data.ForbiddenErrorText);
      checkIfExists("selopt", data.SelectOptionText);
      checkIfExists("selopt2", data.SelectOptionText);
      checkIfExists("darkthmopt", data.DarkThemeOption);
      checkIfExists("lightthmopt", data.LightThemeOption);
      checkIfExists("themetxt", data.ThemeText);
      checkIfExists("ftlThemeTxt", data.FirstTimeLoadThemeText);
      checkIfExists("blogbtntxt", data.BlogButtonText);
      checkIfExists("bbutton", data.BlogText);
      checkIfExists("stuff2-path", data.BlogPath);
      checkIfExists("darkopt", data.InitialSetupDarkThemeOption);
      checkIfExists("lightopt", data.InitialSetupLightThemeOption);
    })
    .catch((error) => console.error("Error whilst loading lang file:", error));
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

// Dexrn: This makes sure that the element exists before setting it... otherwise it will throw an error.
function checkIfExists(elementId: string, value: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  } 
}
