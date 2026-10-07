import requests
from bs4 import BeautifulSoup
import re

def fetch_gfg_profile(username: str) -> dict:
    """
    Fetches real-time GeeksforGeeks profile data by parsing public user profile.
    Retrieves coding score, problems solved, institute rank, and streak.
    Returns:
        {
            "username": str,
            "platform": "GFG",
            "available": bool,
            "stats": dict or None,
            "error": str or None
        }
    """
    username = (username or "").strip()
    if not username:
        return {
            "username": "",
            "platform": "GFG",
            "available": False,
            "stats": None,
            "error": "Username cannot be empty"
        }

    url = f"https://www.geeksforgeeks.org/user/{username}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 404:
            return {
                "username": username,
                "platform": "GFG",
                "available": False,
                "stats": None,
                "error": f"GeeksforGeeks user '{username}' not found"
            }
        elif response.status_code != 200:
            return {
                "username": username,
                "platform": "GFG",
                "available": False,
                "stats": None,
                "error": f"GeeksforGeeks profile unavailable (status {response.status_code})"
            }

        soup = BeautifulSoup(response.text, "html.parser")

        coding_score = 0
        problems_solved = 0
        institute_rank = "N/A"

        # Search for score cards
        cards = soup.find_all("div", class_=re.compile(r"score_card|basic_details", re.I))
        for card in cards:
            text = card.text
            if "Coding Score" in text:
                nums = re.findall(r"\d+", text)
                if nums:
                    coding_score = int(nums[0])
            if "Problem Solved" in text or "Problems Solved" in text:
                nums = re.findall(r"\d+", text)
                if nums:
                    problems_solved = int(nums[0])

        # Fallback search by labels
        if coding_score == 0:
            elem = soup.find(string=re.compile(r"Coding Score", re.I))
            if elem and elem.parent:
                nums = re.findall(r"\d+", elem.parent.text)
                if nums:
                    coding_score = int(nums[0])

        if problems_solved == 0:
            elem = soup.find(string=re.compile(r"Problem(s)? Solved", re.I))
            if elem and elem.parent:
                nums = re.findall(r"\d+", elem.parent.text)
                if nums:
                    problems_solved = int(nums[0])

        rank_elem = soup.find(string=re.compile(r"Institute Rank", re.I))
        if rank_elem and rank_elem.parent:
            nums = re.findall(r"\d+", rank_elem.parent.text)
            if nums:
                institute_rank = nums[0]

        # Avatar
        img_elem = soup.find("img", class_=re.compile(r"profile|avatar|userImage", re.I))
        avatar = img_elem.get("src", "") if img_elem else ""

        # If we couldn't find any coding stats or user page is empty, mark unavailable
        if coding_score == 0 and problems_solved == 0 and institute_rank == "N/A":
            # Check if this is a valid user page
            user_handle_elem = soup.find(string=re.compile(username, re.I))
            if not user_handle_elem:
                return {
                    "username": username,
                    "platform": "GFG",
                    "available": False,
                    "stats": None,
                    "error": f"GeeksforGeeks user '{username}' profile data unavailable"
                }

        return {
            "username": username,
            "platform": "GFG",
            "available": True,
            "stats": {
                "name": username,
                "rating": coding_score,
                "solved": problems_solved,
                "rank": institute_rank,
                "avatar": avatar,
                "profile_url": url,
            },
            "error": None
        }

    except requests.RequestException as e:
        return {
            "username": username,
            "platform": "GFG",
            "available": False,
            "stats": None,
            "error": f"Network error connecting to GeeksforGeeks: {str(e)}"
        }
