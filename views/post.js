import { feed } from "./feed.js";

export function post(postId) {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <h1>Post Details</h1>
        <div id="post-details"></div>
        <button id="back-to-feed">Back to Feed</button>
    `;
    const backToFeedButton = document.getElementById("back-to-feed");
    if (backToFeedButton) {
        backToFeedButton.addEventListener("click", () => {
            feed();
        });
    }
    fetchPostDetails(postId);
}
const api_key = "3956091a-2141-44f0-ae9e-b7cb52e626e1";

async function fetchPostDetails(postId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `https://v2.api.noroff.dev/social/posts/${postId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );
        if (response.ok) {
            const data = await response.json();
            const postDetails = document.getElementById("post-details");
            if (postDetails) {
                postDetails.innerHTML = `
                    <h2>${data.data.title}</h2>
                    <p>${data.data.body}</p>
                `;
            }
        } else {
            throw new Error("Failed to fetch post details.");
        }
    } catch (error) {
        console.error("Error fetching post details:", error);
    }
}