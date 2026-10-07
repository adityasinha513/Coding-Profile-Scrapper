import requests

def fetch_codeforces_profile(username: str) -> dict:
    """
    Fetches real-time Codeforces profile data using the official Codeforces REST API.
    Retrieves current rating, max rating, rank title, max rank, and avatar.
    """
    username = username.strip()
    if not username:
        return {"platform": "Codeforces", "error": "Username cannot be empty"}

    url = f"https://codeforces.com/api/user.info?handles={username}"
    headers = {
        "User-Agent": "CodingProfileScrapper/1.0"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()

        if data.get("status") != "OK" or not data.get("result"):
            return {
                "platform": "Codeforces",
                "username": username,
                "error": data.get("comment", f"User '{username}' not found on Codeforces")
            }

        user_info = data["result"][0]

        return {
            "platform": "Codeforces",
            "username": user_info.get("handle", username),
            "name": f"{user_info.get('firstName', '')} {user_info.get('lastName', '')}".strip() or username,
            "rating": user_info.get("rating", 0),
            "max_rating": user_info.get("maxRating", 0),
            "rank": (user_info.get("rank") or "unranked").capitalize(),
            "max_rank": (user_info.get("maxRank") or "unranked").capitalize(),
            "avatar": user_info.get("titlePhoto") or user_info.get("avatar") or "",
            "contribution": user_info.get("contribution", 0),
            "profile_url": f"https://codeforces.com/profile/{username}",
            "error": None
        }

    except requests.RequestException as e:
        return {
            "platform": "Codeforces",
            "username": username,
            "error": f"Network error fetching Codeforces profile: {str(e)}"
        }
