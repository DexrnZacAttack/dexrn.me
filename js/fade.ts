/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

const backButton: HTMLDivElement = document.querySelector("#back")!;
export const loadingScreen: HTMLDivElement = document.querySelector(".loadingScreen")!;

document.addEventListener("DOMContentLoaded", function () {
  const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".buttonRedirect");

  function handleClick(button: HTMLButtonElement | HTMLDivElement): void {
    const delay = 350;

    loadingScreen.style.display = "flex";
    fadeOut(loadingScreen);
    setTimeout(() => {
      window.location.href = button.getAttribute("linkto")!;
    }, delay);
  }

  buttons.forEach((button) => {
    if (button.classList.contains("noLink"))
      return;
    
    button.addEventListener("click", (e) => {
      e.preventDefault();
      handleClick(button);
    });
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      handleClick(backButton);
    });
  }
});

window.addEventListener('pageshow', function(event) {
  const hist = event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
  if (hist) {
    fadeIn(loadingScreen);
  }
});

function fadeIn(element: HTMLDivElement): void {
  if (element) {
    let opacity: number = 1;
    const duration: number = 20;
    /** how much to fade per call */
    const interval: number = 2;
    const timer = setInterval(function () {
      if (opacity <= 0) {
        clearInterval(timer);
        element.style.display = "none";
      }
      element.style.opacity = `${opacity}`;
      opacity -= 1 / (duration / interval);
    }, interval);
  }
}


export function fadeOut(element: HTMLDivElement) {
  if (element) {
      let opacity = 0;
      const duration = 20;
      const interval = 2;
      element.style.display = "flex"; 
      loadingScreen.style.pointerEvents = "none"; 
      const timer = setInterval(function () {
          if (opacity >= 1) {
            loadingScreen.style.display = "flex"; 
              clearInterval(timer);
          }
          element.style.opacity = `${opacity}`;
          opacity += 1 / (duration / interval);
      }, interval);
  }
}
