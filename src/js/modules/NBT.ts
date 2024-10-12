/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import { read } from "nbtify";

import type { NBTData } from "nbtify";
import { Container } from "../LCEE-GUI.js";


export async function readNBTfromFile(file: Container): Promise<NBTData | undefined> {
    try {
        return await read(await new Blob([file.data]).arrayBuffer(), { rootName: true, endian: "big", bedrockLevel: false, strict: false });
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export async function isReadable(file: Container): Promise<boolean> {
    try {
        if (await read(await new Blob([file.data]).arrayBuffer(), { rootName: true, endian: "big", bedrockLevel: false, strict: false })) {
            return true;
        } else {
            return false;
        }
        } catch {
            return false;
    }
}