/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

import { parse } from "marked";
import { getVer } from "./ver.js";
import { v1 } from "uuid";
import { getAllElements, GetType } from "./modules/common.js";
import { getTranslation } from "./settings.js";

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

export async function viewSinglePost(title: string) {
    // maybe I should make this only fetch the post... later tho.
    const blog = await (await fetch(`https://dexrn.duckdns.org/post?post=${title}`)).json();
    if (blog.title && blog.body)
        await viewBlog(blog.title, blog.body);
}

interface elementVisibility {
    element: HTMLElement,
    visibility: string
}

export async function viewBlog(title: string, content: string) {

    // random UUID
    const randomUUID = v1();

    // create elements
    const backBar = document.createElement("div");
    const backBarBtn = document.createElement("div");
    const blogPage = document.createElement("card");
    const body = document.createElement("div");
    const postTitle = document.createElement("h1");

    // set IDs
    backBar.id = `blogPage_backBar_${randomUUID}`;
    backBarBtn.id = `blogPage_backBarBtn_${randomUUID}`;
    blogPage.id = `blogPage_${randomUUID}`;
    body.id = `blogPage_body_${randomUUID}`;
    postTitle.id = `blogPage_postTitle_${randomUUID}`;

    // set classes
    backBarBtn.className = `back`;
    backBar.className = `topcard`;
    body.className = `postBody`;
    postTitle.className = `postTitle`;

    // format the markdown and set text
    body.innerHTML = await parse(content);
    postTitle.innerText = title;

    // set onclick
    const allVisibleElements = getAllElements(GetType.visible);
    let elements: elementVisibility[] = [];
    backBar.addEventListener('click', function () {
        elements.forEach(element => {
            if (!["homepage"].includes(element.element.id) && !["body", "head", "html"].includes(element.element.tagName.toLowerCase()))
                backBar.remove();
            blogPage.remove();
            backBarBtn.remove();
            body.remove();
            postTitle.remove();
            element.element.style.display = element.visibility;
        });
    });

    // set backBarBtn text and some styling stuffs
    backBarBtn.innerText = await getTranslation("base.back");
    backBarBtn.style.cursor = "pointer";
    backBar.style.marginTop = "20px";

    // appendChild
    backBar.appendChild(backBarBtn);
    blogPage.appendChild(postTitle);
    blogPage.appendChild(body);

    // hide all visible elements
    allVisibleElements.forEach(element => {
        elements.push({element: element, visibility: element.style.display});
        if (!["homepage"].includes(element.id) && !["body", "head", "html"].includes(element.tagName.toLowerCase()))
            element.style.display = "none";
    });

    // show the blog
    document.querySelector("#homepage")!.appendChild(backBar);
    document.querySelector("#homepage")!.appendChild(blogPage);
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
            const response = await (await fetch(`https://dexrn.duckdns.org${post.postURL}`, {
                method: "GET", 
                headers: {
                    "dzVersion": `${curVer.version};${curVer.date.getTime()}`
                }
            })).json();

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            const blogPost: Post = await response.json();
            posts.push(blogPost);
        } catch (error) {
            console.error(`Couldn't get post 'https://dexrn.duckdns.org${post.postURL}'`, error);
        }
    }

    posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return posts;
}
