/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import langEN from "../assets/lang/en-US.json";
import langCN from "../assets/lang/zh-CN.json";

export type Theme = undefined | "default-light" | "default-dark";
export type Language = undefined | "en-US" | "zh-CN";

export class Settings {
  public language: Language;
  public theme: Theme;
  public static readonly instance = Settings.load();

  constructor(language: Language, theme: Theme) {
    this.language = language;
    this.theme = theme;
  }

  /** Loads all settings from Local Storage */
  public static load(): Settings {
    return new Settings(
      localStorage.getItem("language") as Language || navigator.language as Language,
      localStorage.getItem("theme") as Theme
    )
  }

  /** Sets all settings in Local Storage */
  public set(): void {
    Object.keys(this).forEach(field => {
      localStorage.setItem(field, this[field as keyof this] as string);
    });
  }

  /** Sets a setting in Local Storage */
  public setSetting<S extends keyof this>(setting: S): void {
    if (!(setting in this))
      throw new Error(`Setting ${setting as string} was not found.`);

    localStorage.setItem(setting as string, this[setting as keyof this] as string);
  }

  /** Loads a setting from Local Storage */
  public loadSetting<S extends keyof this>(setting: S): void {
    const val = localStorage.getItem(setting as string);
    if (!val)
      throw new Error(`Setting ${setting as string} does not exist in the browser's storage.`);

    if (!(setting in this))
      throw new Error(`Setting ${setting as string} was not found.`);

    (this as any)[setting] = val;
  }
}

export let lang = getLang(Settings.instance.language);

export function getLang(lang: Language) {
  switch (lang) {
    default:
    case "en-US":
      return langEN;
    case "zh-CN":
      return langCN;
  }
}

export function applyTheme(theme: Theme): void {
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

export function loadSettings() {
  lang = getLang(Settings.instance.language)
  setLang();
  applyTheme(Settings.instance.theme);
}

export async function getTranslation(key: string): Promise<string> {
    try {
        function getNested(obj: any, path: string): any {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        }
        const translation = getNested(lang, key);
        return translation ? translation.toString() : `${key} (UNLOCALIZED)`;
    } catch (error) {
        return 'translation list error';
    }
}

// Dexrn: Localization! (Kinda janky.)
export function setLang(): void {
      document.querySelectorAll("[data-tlkey]").forEach(e => {
        let key = e.getAttribute('data-tlkey')!;
        // start off as the entire lang obj
        let translation = lang;
        // traverse until we hit the final translation
        for (let part of key.split('.')) {
            translation = (translation as any)[part] || key;
        }
        // eeeee
        e.textContent = translation as unknown as string;
      })
}