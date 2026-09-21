import { post } from "./post.js";
import { profile } from "./profile.js";
import { userProfiles } from "./userProfiles.js";

const api_key="3956091a-2141-44f0-ae9e-b7cb52e626e1";


export function feed() {
    const mainContent = document.getElementById("main-content");

    mainContent.innerHTML = `
        <h1>Feed</h1>

        <div class="search-bar">
            <input
                type="text"
                id="search-input"
                placeholder="Search posts..."
            >
            <button id="search-button">Search</button>
            <button id="profile-button">Profile</button>
        </div>

        <div class="search-profiles">
            <input
                type="text"
                id="search-profile-input"
                placeholder="Search profiles..."
            >
            <button id="search-profile-button">
                Search Profiles
            </button>
        </div>

        <div id="feed-posts"></div>
    `;


    const profileButton =
        document.getElementById("profile-button");

    if (profileButton) {
        profileButton.addEventListener("click", () => {
            profile();
        });
    }


    const searchButton =
        document.getElementById("search-button");

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const searchInput =
                document.getElementById("search-input");

            if (searchInput) {
                const searchTerm = searchInput.value;

                searchPosts(searchTerm);
            }
        });
    }


    const searchProfileButton =
        document.getElementById("search-profile-button");

    if (searchProfileButton) {
        searchProfileButton.addEventListener("click", () => {
            const searchProfileInput =
                document.getElementById("search-profile-input");

            if (searchProfileInput) {
                const searchProfileTerm =
                    searchProfileInput.value;

                searchProfiles(searchProfileTerm);
            }
        });
    }


    fetchPosts();
}



async function fetchPosts() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://v2.api.noroff.dev/social/posts",
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

            displayPosts(data.data);

        } else {
            throw new Error("Failed to fetch posts.");
        }


    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}



async function searchPosts(searchTerm) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/posts/search?q=${searchTerm}`,
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

            displayPosts(data.data);

        } else {
            throw new Error("Failed to search posts.");
        }


    } catch (error) {
        console.error("Error searching posts:", error);
    }
}



function displayPosts(posts) {
    const feedPosts =
        document.getElementById("feed-posts");

    if (feedPosts) {
        feedPosts.innerHTML = "";


        posts.forEach((postItem) => {
            feedPosts.innerHTML += `
                <h3>${postItem.title}</h3>

                <p>${postItem.body}</p>

                <button
                    class="view-post-button"
                    data-post-id="${postItem.id}"
                >
                    View Post
                </button>

                <hr>
            `;
        });


        const viewPostButtons =
            document.querySelectorAll(".view-post-button");

        viewPostButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const postId =
                    button.getAttribute("data-post-id");

                post(postId);
            });
        });
    }
}



async function searchProfiles(searchTerm) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/search?q=${searchTerm}`,
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

            displayProfiles(data.data);

        } else {
            throw new Error("Failed to search profiles.");
        }


    } catch (error) {
        console.error("Error searching profiles:", error);
    }
}



function displayProfiles(profiles) {
    const feedPosts =
        document.getElementById("feed-posts");

    if (feedPosts) {
        feedPosts.innerHTML = "";


        profiles.forEach((profileItem) => {
            feedPosts.innerHTML += `
                <h3>${profileItem.name}</h3>

                <button
                    class="view-profile-button"
                    data-username="${profileItem.name}"
                >
                    View Profile
                </button>

                <hr>
            `;
        });


        const viewProfileButtons =
            document.querySelectorAll(".view-profile-button");

        viewProfileButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const username =
                    button.getAttribute("data-username");

                userProfiles(username);
            });
        });
    }
}