const userData = document.getElementById("userData");

async function fetchit(...username) {
  try {
    let user = "";
    const formUser = document.getElementById("text").value;

    formUser ? user = formUser : user = username;

    const response = await fetch(`https://api.github.com/users/${user}`);
    const profile = await response.json();

    if (response.status === 200 || response.status === 302) {
      appendInfoToHTML(profile);
    } else if (response.status === 403) {
      appendInfoToHTML("forbidden");
    } else if (response.status === 404) {
      if (profile.message) appendInfoToHTML("nouser");
    }
    else {
      appendInfoToHTML("");
    }
  } catch (error) {
    console.log("Chief, we've run into an error: " + error)
  }
}

function appendInfoToHTML(profile) {
  // const userInfo = document.createElement("div");
  const profilePicture = document.getElementById("profilePicture");
  if (profile == "forbidden") {
    hideProfilePicture();
    userData.innerHTML = `<p>ERROR: 403 Forbidden</p>
                          <p>Sorry, GET limit is reached for your IP address. Blame it on Corporate greed.</p>
                          <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limiting">Read more here...</a>`
  } else if (profile == "nouser") {
    hideProfilePicture();
    userData.innerHTML = `<p>404 User not found.</p>`
  } else if (profile.login) {
    const blogURL = profile.blog || "";

    profilePicture.src = profile.avatar_url;
    showProfilePicture()

    let userSince = "";
    for (i of profile.created_at) {
      if (i == "T") {
        break;
      }
      userSince += i;
    }

    const twitterURL = () => {
      if (profile.twitter_username) {
        return `https://twitter.com/${profile.twitter_username}`;
      }
    };

    userData.innerHTML = `<p>username: ${profile.login}</p>
                        <p>name: ${profile.name || "NOT SET"}</p>
                        <p>bio: ${profile.bio || "NO BIO"}</p>
                        <p>mail: ${profile.email || "NOT PUBLIC"}</p>
                        <p>blog: <a href="${blogURL}">${blogURL}</a></p>
                        <p>repo count: ${profile.public_repos}</p>
                        <p>followers: ${profile.followers}</p>
                        <p>following: ${profile.following}</p>
                        <p>location: ${profile.location || "PRIVATE"}</p>
                        <p>user since: ${userSince}</p>
                        <a href="${profile.html_url}">go to profile..</a><br><br>
                        <a href="${twitterURL()}">${twitterURL() || ""}</a >   `
  } else {
    userData.innerHTML = `Unknown error!`;
  }

}

function hideProfilePicture() {
  profilePicture.style.width = "0";
  profilePicture.style.visibility = "hidden";
}

function showProfilePicture() {
  profilePicture.style.width = "100px";
  profilePicture.style.visibility = "visible";
}

function clearAll() {
  hideProfilePicture();
  userData.innerHTML = "";
}

window.onload = () => {
  const formUser = document.getElementById("text");
  formUser.value = "";
}