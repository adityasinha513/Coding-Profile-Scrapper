import requests

def fetch_github_profile(username: str) -> dict:
    """
    Fetches real-time GitHub profile data using the official GitHub REST API.
    Retrieves public repos, total stars across repos, followers, and bio.
    """
    username = username.strip()
    if not username:
        return {"platform": "GitHub", "error": "Username cannot be empty"}

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "CodingProfileScrapper/1.0"
    }

    try:
        user_url = f"https://api.github.com/users/{username}"
        user_resp = requests.get(user_url, headers=headers, timeout=10)

        if user_resp.status_code == 404:
            return {
                "platform": "GitHub",
                "username": username,
                "error": f"GitHub user '{username}' not found"
            }
        elif user_resp.status_code != 200:
            return {
                "platform": "GitHub",
                "username": username,
                "error": f"GitHub API error (status {user_resp.status_code})"
            }

        user_data = user_resp.json()

        # Compute total stars across up to 100 public repositories
        total_stars = 0
        try:
            repos_url = f"https://api.github.com/users/{username}/repos?per_page=100&type=owner"
            repos_resp = requests.get(repos_url, headers=headers, timeout=10)
            if repos_resp.status_code == 200:
                repos = repos_resp.json()
                total_stars = sum(repo.get("stargazers_count", 0) for repo in repos if isinstance(repo, dict))
        except Exception:
            pass

        return {
            "platform": "GitHub",
            "username": username,
            "name": user_data.get("name") or username,
            "avatar": user_data.get("avatar_url") or "",
            "bio": user_data.get("bio") or "",
            "public_repos": user_data.get("public_repos", 0),
            "total_stars": total_stars,
            "followers": user_data.get("followers", 0),
            "following": user_data.get("following", 0),
            "profile_url": user_data.get("html_url") or f"https://github.com/{username}",
            "created_at": user_data.get("created_at"),
            "error": None
        }

    except requests.RequestException as e:
        return {
            "platform": "GitHub",
            "username": username,
            "error": f"Network error fetching GitHub profile: {str(e)}"
        }
