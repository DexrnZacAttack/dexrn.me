/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import { setLang } from "./settings.js";
import { getVer } from "./ver.js";

const bgElement: HTMLDivElement = document.querySelector(".bg")!;
const loadingScreen: HTMLDivElement = document.querySelector(".loadingScreen")!;
const loadingText = document.querySelector("#loadingText");


// Dexrn: This is for the text that shows on the loading screen.
export function startLoadingTimer(): void {
    setTimeout(() => {
        if (loadingText && !loadingText.classList.contains("hidden")) {
            loadingText.classList.remove("hidden");
        }
    }, 5000);
}

export function showLoadingText(): void {
    if (loadingText) {
        loadingText.classList.remove("hidden");
    }
}

let touchStartTime: number;
let holdTimeout: number | NodeJS.Timeout;
let countdownInterval: number | NodeJS.Timeout;

function dbgKey(event: KeyboardEvent) {
    if (event.key === ';') {
        showLoadingText();
    }
    if (event.key === '/' && import.meta.env.DEV) {
        fadeLoadingScreen();
    }
}

export function setLoadingText(str: string): void {
    if (loadingText) {
        loadingText.textContent = str;
    }
}

function setBGTime(): void {
    let now = new Date();
    let hour = now.getHours();
    if (hour >= 6 && hour < 20) {
        bgElement.style.backgroundImage =
            `url('https://dexrn.duckdns.org/panorama?time=day&ver=${getVer().version};${getVer().date.getTime()}')`;
    } else {
        bgElement.style.backgroundImage =
            `url('https://dexrn.duckdns.org/panorama?time=night&ver=${getVer().version};${getVer().date.getTime()}')`;
    }
}

enum loadingCode {
    SUCCESS,
    BG_FAIL,
    LOCALIZATION_FAIL,
    OTHER_FAIL
}

export function showError(str: string) {
    try {
        (document.getElementById("lightLoadingSpinner")!).style.display = "none";
        (document.getElementById("darkLoadingSpinner")!).style.display = "none";
    } catch {}
    showLoadingText();
    setLoadingText(str);
}

async function beginLoading(): Promise<loadingCode> {
    const bg = new Image();
    bg.src = bgElement.style.backgroundImage.slice(5, -2);

    setLoadingText("Translating...");
    let localizationLoad: Promise<void>;
    try {
        localizationLoad = Promise.resolve(setLang());
    } catch (error) {
        console.error(error);
        return loadingCode.LOCALIZATION_FAIL;
    }

    setLoadingText("Loading background...");
    const imageLoad = new Promise<loadingCode>((resolve, reject) => {
        bg.onload = () => resolve(loadingCode.SUCCESS);
        bg.onerror = () => reject(loadingCode.BG_FAIL);
        bg.onabort = () => reject(loadingCode.BG_FAIL);
    });

    const result = await Promise.allSettled([localizationLoad, imageLoad]);

    if (result[0].status === 'rejected') {
        showError('Failed to load the translations, try refreshing the page.');
        return loadingCode.LOCALIZATION_FAIL;
    }

    console.log(result[1].status);

    if (result[1].status === 'fulfilled')
        return result[1].value;
    else
        showError('Failed to load the background, try refreshing the page.\nIf that doesn\'t work, then your system is likely not resolving the domain (dexrn.duckdns.org) correctly, try going to this site directly until it loads.');
        return loadingCode.OTHER_FAIL;
}

const fadeLoadingScreen = function () {
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 500);
};

export async function loadBG(shouldLoadBg: boolean | Event): Promise<void> {
    if (shouldLoadBg == true) {
        let oldLoadingText = "";
        document.addEventListener('keydown', dbgKey);
        const touch = function(_: TouchEvent) {
            oldLoadingText = loadingText!.textContent ?? "Loading...";
            touchStartTime = Date.now();
        
            countdownInterval = setInterval(function() {
                const elapsedTime = Date.now() - touchStartTime;
                const remainingTime = 3000 - elapsedTime;
        
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                } else {
                    setLoadingText(`Keep holding for ${Math.ceil(remainingTime / 1000)} seconds to skip loading.`);
                }
            }, 1000);
        
            holdTimeout = setTimeout(() => {
                showError("Loading skipped.");
                clearInterval(countdownInterval);
                fadeLoadingScreen();
                document.removeEventListener('touchstart', touch); 
            }, 3000);
        };
        document.addEventListener('touchstart', touch);
        document.addEventListener('touchend', function(_: TouchEvent) {
            setLoadingText(oldLoadingText);
            clearTimeout(holdTimeout);
            clearInterval(countdownInterval);
        });
        setLoadingText("Loading...");
        if (import.meta.env.DEV)
            showLoadingText();
        if (bgElement) {
            // now we can use timezone stuffs to get time which should be more accurate I think?
            // if not then I can exclude timestamp iirc and the server should localize its timestamp to the provided timezone automatically
            if (Date?.now() && Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone)
                bgElement.style.backgroundImage = `url("https://dexrn.duckdns.org/panorama?timestamp=${Date.now()}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&ver=${getVer().version};${getVer().date.getTime()}")`;
            else
                setBGTime();

            await beginLoading().then((code: loadingCode) => {
                if (code !== loadingCode.SUCCESS) {
                    showLoadingText();
                } else {
                    fadeLoadingScreen();
                    document.removeEventListener('keydown', dbgKey);
                    loadingText!.classList.add("hidden");
                }
            })
        } else {
            showError("Failed to find the background element (.bg), try refreshing the page.");
            throw new ReferenceError("Failed to find the background element (.bg), try refreshing the page.");
        }
    } else {
        return;
    }
}

window.onload = loadBG;

