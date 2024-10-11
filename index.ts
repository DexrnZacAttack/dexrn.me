/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

// These imports are here because they use side-effects, rather than
// import-based function calls. Ideally modules don't add side-effects, rather
// they can export functionality that can be called from the module that imports it.

import "./js/settings.js"; // sets theme and lang
import "./js/modules/msgbox.js"; // unused? not used yet, at least
import "./js/modules/common.js"; // common setup
import "./js/lanyard.js"; // common setup
// import "./js/steam.js"; // unused
import "./js/background.js"; // this sets an 'onload' handler
import "./js/fade.js"; // this sets a 'DOMContentLoaded' handler
import "./js/expandable.js"; // component setup

doubleImportTest(new URL(import.meta.url).href);

import {loadBG, startLoadingTimer} from "./js/background.js";
import {
    Theme,
    checkLang,
    getLang,
    getThemeCookie,
    getTranslation,
    setTheme,
} from "./js/settings.js";
import {CurrentTab, curTab, setCurTab} from "./js/tabs.js";
import {setVer} from "./js/ver.js";
import {fetchBlogList} from "./js/blog.js";
import {marked, parse, Renderer} from "marked";
import {v1} from "uuid";
import {getAllElements, GetType, doubleImportTest} from "./js/modules/common.js";

marked.setOptions({
    gfm: true,
    breaks: true,
});

const renderer = new Renderer();

renderer.heading = (text: string, level: number) => {
    if (level === 1 || level === 2) {
        return `<h${level} style="margin-bottom:0;">${text}</h${level}><hr />`;
    }
    return `<h${level}>${text}</h${level}>`;
};

marked.setOptions({
    renderer: renderer
});

function init() {
    // thx actuallyaridan
    startLoadingTimer();
    loadBG(true);
}

init();
const aboutCard: HTMLElement = document.querySelector("#aboutCard")!,
    linksCard: HTMLElement = document.querySelector("#linksCard")!,
    abm: HTMLElement = document.querySelector("#blogCard")!,
    toggleButton: HTMLElement = document.getElementById("settingsTabButton")!,
    settingsPage: HTMLElement = document.getElementById("settings")!,
    activityCard: HTMLElement = document.querySelector("#activityCard")!,
    closeSettingsTabButton: HTMLElement = document.getElementById("settingsclose")!,
    tabContainer: HTMLElement = document.getElementById("mainCardsContainer")!,
    saveBtn: HTMLElement = document.getElementById("saveBtn")!;
settingsPage.style.display = "none";

function settingsExitHandler() {
    setCurTab((previous) => previous);
    tabContainer.style.display = "block";
    console.log("init curTab: " + curTab);
    if (curTab === CurrentTab.DISCORD) {
        activityCard.style.display = "flex";
        aboutCard.style.display = "block";
        linksCard.style.display = "block";
    } else if (curTab === CurrentTab.BLOG) {
        abm.style.display = "block";
    }
    toggleButton.style.display = "block";
    settingsPage.style.display = "none";
}

closeSettingsTabButton.addEventListener("click", settingsExitHandler);
saveBtn.addEventListener("click", settingsExitHandler);

toggleButton.addEventListener("click", function () {
    tabContainer.style.display = "none";
    activityCard.style.display = "none";
    aboutCard.style.display = "none";
    linksCard.style.display = "none";
    abm.style.display = "none";
    toggleButton.style.display = "none";
    settingsPage.style.display = "block";
});

setCurTab(CurrentTab.DISCORD);

document.getElementById("saveBtn")!.addEventListener("click", function () {
    var selectedLanguage = (
        document.getElementById("language2") as HTMLInputElement
    ).value;
    var selectedTheme: Theme = (
        document.getElementById("themeOption") as HTMLSelectElement
    ).value as Theme;
    if (selectedLanguage !== getLang() && selectedLanguage !== "unselected") {
        const expires = new Date("Fri, 31 Dec 9999 23:59:59 GMT").toUTCString();
        document.cookie =
            "lang=" + selectedLanguage + "; expires=" + expires + "; path=/";
        checkLang();
    } else {
    }
    if (
        selectedTheme !== getThemeCookie("Theme") &&
        selectedTheme !== "unselectedtheme"
    ) {
        setTheme(selectedTheme);
    } else {
    }
});

setVer("default");

async function viewSinglePost(title: string) {
    // maybe I should make this only fetch the post... later tho.
    const blog = await (await fetch(`https://dexrn.duckdns.org/post?post=${title}`)).json();
    if (blog.title && blog.body)
        await viewBlog(blog.title, blog.body);
}

async function blogTabHandler() {
    document.querySelectorAll("#blogPostPreview").forEach(element => {
        element.remove()
    });
    const blogTabBody = document.querySelector("#blogCard")!;
    blogTabBody.innerHTML = "";
    const loadingText = document.createElement("h1");
    loadingText.innerText = await getTranslation("base.loading");
    loadingText.className = "postTitle";
    blogTabBody.appendChild(loadingText);
    const blogs = await fetchBlogList();
    blogTabBody.innerHTML = "";
    blogs.forEach(blog => {
        if ((blog.hidden) !== true) {
            const blogElement = document.createElement("div");
            blogElement.id = `blog_${blog.timestamp}`;
            blogElement.className = "blogPostPreview";
            const blogTitle = document.createElement("h1");
            blogTitle.innerText = blog.title;
            blogTitle.className = "blogTitlePreview";
            const blogDate = document.createElement("p");
            blogDate.innerText = Intl.DateTimeFormat('en-US', {
                "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "hour12": true,
                "hour": "numeric",
                "minute": "numeric",
                "second": "numeric",
                "day": "numeric",
                "month": "numeric",
                "year": "numeric"
            }).format(blog.timestamp);
            blogDate.className = "blogDate";
            blogElement.appendChild(blogTitle);
            blogElement.appendChild(blogDate);
            blogTabBody.appendChild(blogElement);
            blogTabBody.appendChild(document.createElement("br"));
            blogElement.addEventListener('click', async function () {
                await viewBlog(blog.title, blog.body);
            });
        }
    });
    if (document.querySelectorAll(".blogPostPreview").length == 0) {
        loadingText.innerText = await getTranslation("blog.noPosts");
    } else {
        loadingText.remove();
    }
}

interface elementVisibility {
    element: HTMLElement,
    visibility: string
}

async function viewBlog(title: string, content: string) {

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

document.querySelector('#mainbtn-2')!.addEventListener('click', async () => {
    await viewSinglePost("QMG");
});
document.querySelector('#blogTabButton')!.addEventListener('click', await blogTabHandler);
