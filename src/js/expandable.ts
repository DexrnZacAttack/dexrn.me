/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

let expandcards: NodeListOf<HTMLDivElement>

function expandCard(): void {
    expandcards = document.querySelectorAll('.expandcard');
 
    expandcards.forEach(function (expandcard) {
       expandcard.addEventListener('click', function () {
          this.classList.toggle('active');
       });
    });
}

setTimeout(expandCard, 1000);