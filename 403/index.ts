/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler

import { loadBG } from "../js/background.js";
import { checkLang } from "../js/settings.js";

loadBG(false);
checkLang();