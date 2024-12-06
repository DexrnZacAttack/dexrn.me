/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import { getVer } from "./ver.js";

interface PostInfo {
    timestamp: Date,
    title: string,
    id: string,
    filename: string,
    postURL: string,
}

interface Post {
    timestamp: Date,
    title: string,
    body: string,
    id: string,
    hidden?: boolean
}

export async function fetchBlogList(): Promise<Post[]> {
    /** compat moment */
    const curVer = getVer();
    const res = await (await fetch("https://dexrn.duckdns.org/posts", {
        method: "GET", 
        headers: {
            "dzVersion": `${curVer.version};${curVer.date.getTime()}`
        }
    })).json();
    let posts: Post[] = [];
    
    for (const postName of res) {
        const post: PostInfo = postName[Object.keys(postName)[0]!];
        
        try {
            const blogPost = await (await fetch(`https://dexrn.duckdns.org${post.postURL}`, {
                method: "GET", 
                headers: {
                    "dzVersion": `${curVer.version};${curVer.date.getTime()}`
                }
            })).json() as Post;

            posts.push(blogPost);
        } catch (error) {
            console.error(`Couldn't get post 'https://dexrn.duckdns.org${post.postURL}'`, error);
        }
    }

    posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return posts;
}
