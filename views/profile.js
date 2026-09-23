import { login } from "./login.js";
import { feed } from "./feed.js";
const api_key = "3956091a-2141-44f0-ae9e-b7cb52e626e1";


export function profile() {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        mainContent.innerHTML = `
            <h1>Profile</h1>

            <p>Welcome to your profile page!</p>

            <p>
                Username:
                ${localStorage.getItem("username") || "N/A"}
            </p>

            <p>
                Email:
                ${localStorage.getItem("email") || "N/A"}
            </p>

            <img
                src="${localStorage.getItem("avatar") || "default-avatar.png"}"
                alt="Avatar"
                width="100"
            >

            <button id="logout-button">Logout</button>
            <button id="feed-button">Feed</button>

            <div class="create-post">
                <h2>Create a New Post</h2>
                <form id="create-post-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Post Title"
                        required
                    >
                    <textarea
                        name="body"
                        placeholder="What's on your mind?"
                        required
                    ></textarea>
                    <button type="submit">
                        Create Post
                    </button>
                </form>
            </div>

            <div class="posts">
                <h2>Your Posts</h2>

                <div id="user-posts"></div>
            </div>
        `;

        const createPostForm =
            document.getElementById("create-post-form");

        if (createPostForm) {
            createPostForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const title =
                    createPostForm.elements["title"].value;
                const body =
                    createPostForm.elements["body"].value;
                createPost(title, body);
            });
        }

        const feedButton =
            document.getElementById("feed-button");
        if (feedButton) {
            feedButton.addEventListener("click", () => {
                feed();
            });
        }
        const logoutButton =
            document.getElementById("logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                logout();
            });
        }
        posts();
    }
}



async function createPost(title, body) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("User is not authenticated.");
        }
        const response = await fetch(
            "https://v2.api.noroff.dev/social/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                },

                body: JSON.stringify({
                    title: title,
                    body: body
                })
            }
        );
        if (!response.ok) {
            throw new Error("Failed to create post.");
        }
        console.log("Post created successfully.");
        posts();

    } catch (error) {
        console.error("Error creating post:", error);
    }
}



async function posts() {
    try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${username}/posts`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user posts.");
        }

        const data = await response.json();

        console.log("User posts:", data);

        const userPosts =
            document.getElementById("user-posts");

        if (userPosts) {
            userPosts.innerHTML = "";

            data.data.forEach((post) => {
                userPosts.innerHTML += `
                    <div
                        class="user-post"
                        data-post-id="${post.id}"
                    >
                        <h3>${post.title}</h3>

                        <p>${post.body}</p>

                        <button
                            class="edit-post-button"
                            data-post-id="${post.id}"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-post-button"
                            data-post-id="${post.id}"
                        >
                            Delete
                        </button>

                        <hr>
                    </div>
                `;
            });

            const deleteButtons =
                document.querySelectorAll(
                    ".delete-post-button"
                );

            deleteButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const postId =
                        button.getAttribute("data-post-id");
                    deletePost(postId);
                });
            });


            
            const editButtons =
                document.querySelectorAll(
                    ".edit-post-button"
                );

            editButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const postContainer =
                        button.closest(".user-post");
                    if (postContainer) {
                        showEditForm(postContainer);
                    }
                });
            });
        }

    } catch (error) {
        console.error(
            "Error fetching user posts:",
            error
        );
    }
}



function showEditForm(postContainer) {
    const postId =
        postContainer.getAttribute("data-post-id");

    const title =
        postContainer.querySelector("h3").textContent;

    const body =
        postContainer.querySelector("p").textContent;


    postContainer.innerHTML = `
        <h3>Edit Post</h3>

        <form class="edit-post-form">

            <input
                type="text"
                name="title"
                value="${title}"
                required
            >

            <textarea
                name="body"
                required
            >${body}</textarea>

            <button type="submit">
                Save
            </button>

            <button
                type="button"
                class="cancel-edit-button"
            >
                Cancel
            </button>

        </form>

        <hr>
    `;


    const editForm =
        postContainer.querySelector(".edit-post-form");
    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newTitle =
            editForm.elements["title"].value;
        const newBody =
            editForm.elements["body"].value;

        await editPost(
            postId,
            newTitle,
            newBody
        );
    });
    const cancelButton =
        postContainer.querySelector(
            ".cancel-edit-button"
        );
    cancelButton.addEventListener("click", () => {
        posts();
    });
}



async function editPost(postId, newTitle, newBody) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `https://v2.api.noroff.dev/social/posts/${postId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newTitle,
                    body: newBody
                })
            }
        );
        if (!response.ok) {
            throw new Error("Failed to edit post.");
        }
        console.log("Post edited successfully.");
        posts();

    } catch (error) {
        console.error("Error editing post:", error);
    }
}



async function deletePost(postId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `https://v2.api.noroff.dev/social/posts/${postId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete post.");
        }
        console.log("Post deleted successfully.");
        posts();
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}



function logout() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error(
                "User is not authenticated."
            );
        }
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        login();
    } catch (error) {
        console.error("Error logging out:", error);
    }
}
