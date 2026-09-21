import { feed } from "./feed.js";

const api_key = "3956091a-2141-44f0-ae9e-b7cb52e626e1";

export function userProfiles(username) {
    const mainContent = document.getElementById("main-content");

    if (mainContent) {
        mainContent.innerHTML = `
            <h1>${username}</h1>

            <button id="back-to-feed-button">
                Back to Feed
            </button>

            <button id="follow-button">
                Follow
            </button>

            <h2>Posts</h2>

            <div id="profile-posts"></div>
        `;


        // Back to Feed
        const backToFeedButton =
            document.getElementById("back-to-feed-button");

        if (backToFeedButton) {
            backToFeedButton.addEventListener("click", () => {
                feed();
            });
        }


        // Get posts from this user
        getUserPosts(username);


        // Check if logged in user already follows this profile
        checkFollowing(username);
    }
}


async function getUserPosts(username) {
    try {
        const token = localStorage.getItem("token");

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

        const profilePosts =
            document.getElementById("profile-posts");

        if (profilePosts) {
            profilePosts.innerHTML = "";

            data.data.forEach((post) => {
                profilePosts.innerHTML += `
                    <div class="post">
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <hr>
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error(
            "Error fetching user posts:",
            error
        );
    }
}


async function checkFollowing(username) {
    try {
        const token = localStorage.getItem("token");
        const loggedInUsername =
            localStorage.getItem("username");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${loggedInUsername}?_following=true`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to check following.");
        }

        const data = await response.json();

        const isFollowing = data.data.following.some(
            (profile) => profile.name === username
        );

        updateFollowButton(username, isFollowing);

    } catch (error) {
        console.error(
            "Error checking following:",
            error
        );
    }
}


function updateFollowButton(username, isFollowing) {
    const followButton =
        document.getElementById("follow-button");

    if (!followButton) {
        return;
    }

    if (isFollowing) {
        followButton.textContent = "Unfollow";

        followButton.onclick = () => {
            unfollowUser(username);
        };

    } else {
        followButton.textContent = "Follow";

        followButton.onclick = () => {
            followUser(username);
        };
    }
}


async function followUser(username) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${username}/follow`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to follow user.");
        }

        console.log("User followed successfully.");

        updateFollowButton(username, true);

    } catch (error) {
        console.error(
            "Error following user:",
            error
        );
    }
}


async function unfollowUser(username) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${username}/unfollow`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": api_key
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to unfollow user.");
        }

        console.log("User unfollowed successfully.");

        updateFollowButton(username, false);

    } catch (error) {
        console.error(
            "Error unfollowing user:",
            error
        );
    }
}