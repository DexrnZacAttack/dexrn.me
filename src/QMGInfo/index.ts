/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import "../js/settings.js"; // sets theme and lang
import "../js/background.js"; // this sets an 'onload' handler
import "../js/fade.js"; // this sets a 'DOMContentLoaded' handler
import "../js/QMGParser.js"; // component setup
import "../js/modules/common.js"; // common setup

import { loadBG } from "../js/background.js";
import { setVer } from "../js/ver.js";
import { doubleImportTest } from "../js/modules/common.js";
doubleImportTest(new URL(import.meta.url).href);
setVer("qd");
loadBG(true);