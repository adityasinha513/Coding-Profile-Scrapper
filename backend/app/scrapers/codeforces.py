import requests

def fetch_codeforces_profile(username: str) -> dict:
    """
    Fetches real-time Codeforces profile data using the official Codeforces REST API.
    Retrieves current rating, max rating, rank title, max rank, and avatar.
    Returns:
        {
            "username": str,
            "platform": "Codeforces",
            "available": bool,
            "stats": dict or None,
            "error": str or None
        }
    """
    username = (username or "").strip()
    if not username:
        return {
            "username": "",
            "platform": "Codeforces",
            "available": False,
            "stats": None,
            "error": "Username cannot be empty"
        }

    url = f"https://codeforces.com/api/user.info?handles={username}"
    headers = {
        "User-Agent": "CodingProfileScrapper/1.0"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()

        if data.get("status") != "OK" or not data.get("result"):
            return {
                "username": username,
                "platform": "Codeforces",
                "available": False,
                "stats": None,
                "error": data.get("comment", f"Codeforces user '{username}' not found")
            }

        user_info = data["result"][0]

        return {
            "username": user_info.get("handle", username),
            "platform": "Codeforces",
            "available": True,
            "stats": {
                "name": f"{user_info.get('firstName', '')} {user_info.get('lastName', '')}".strip() or username,
                "rating": user_info.get("rating", 0),
                "max_rating": user_info.get("maxRating", 0),
                "rank": (user_info.get("rank") or "unranked").capitalize(),
                "max_rank": (user_info.get("maxRank") or "unranked").capitalize(),
                "avatar": user_info.get("titlePhoto") or user_info.get("avatar") or "",
                "contribution": user_info.get("contribution", 0),
                "profile_url": f"https://codeforces.com/profile/{username}",
            },
            "error": None
        }

    except requests.RequestException as e:
        return {
            "username": username,
            "platform": "Codeforces",
            "available": False,
            "stats": None,
            "error": f"Network error connecting to Codeforces: {str(e)}"
        }
