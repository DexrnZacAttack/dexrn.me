import { getTranslation } from "../js/settings.js";
import { CardProps } from "./Card.js";
import { fetchBlogList, viewBlog } from "../js/blog.js";

async function blogTabHandler(): Promise<(HTMLDivElement | HTMLBRElement)[]> {
    document.querySelectorAll("#blogPostPreview").forEach(element => {
        element.remove()
    });

    const blogTabChildren: (HTMLDivElement | HTMLBRElement)[] = [];
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
            blogTabChildren.push(blogElement);
            blogTabChildren.push(document.createElement("br"));
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
    return blogTabChildren;
}

export default function BlogCard({ id, className, style, children }: CardProps) {
    

    return (
        <div id={id} className={className != undefined ? `card ${className}` : "card"} style={style}>{children}</div>
    );
}

