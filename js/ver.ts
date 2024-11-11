/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

export interface Version {
    version: string;
    date: Date;
};

/**
 * Retrieves version info for the specified file.
 * @param type The file to return info for.
 * @returns A JSON string containing the version and date information.
 */
export function getVer(type?: string): Version {
    switch (type) {
        case "le":
            // LCE Extractor
            return { "version": "1.2.01", "date": new Date(1731317440977)};
        case "qd":
            // QMG Header Parser
            return { "version": "1.2.20", "date": new Date(1728655681160)};
        case "default":
        default:
            return { "version": "1.5.01", "date": new Date(1731317440977)};
    }
}

/**
 * Sets the version information in the current HTML.
 * @param type The file to use the information from when setting the info.
 */
export function setVer(type: string): void {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat(navigator.language, options);
    const ver = getVer(type);
    document.getElementById('lastUpdated')!.innerText = `v${ver.version} (${formatter.format(ver.date)})`;
}

