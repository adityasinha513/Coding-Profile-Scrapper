import requests
from bs4 import BeautifulSoup
import re

def get_stars_from_rating(rating: int) -> str:
    if rating <= 1399:
        return "1 Star"
    elif rating <= 1599:
        return "2 Star"
    elif rating <= 1799:
        return "3 Star"
    elif rating <= 1999:
        return "4 Star"
    elif rating <= 2199:
        return "5 Star"
    elif rating <= 2499:
        return "6 Star"
    else:
        return "7 Star"

def fetch_codechef_profile(username: str) -> dict:
    """
    Fetches real-time CodeChef profile data by parsing public user page.
    Retrieves rating, division/stars, global & country ranks, and problems solved.
    Returns:
        {
            "username": str,
            "platform": "CodeChef",
            "available": bool,
            "stats": dict or None,
            "error": str or None
        }
    """
    username = (username or "").strip()
    if not username:
        return {
            "username": "",
            "platform": "CodeChef",
            "available": False,
            "stats": None,
            "error": "Username cannot be empty"
        }

    url = f"https://www.codechef.com/users/{username}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 404:
            return {
                "username": username,
                "platform": "CodeChef",
                "available": False,
                "stats": None,
                "error": f"CodeChef user '{username}' not found"
            }
        elif response.status_code != 200:
            return {
                "username": username,
                "platform": "CodeChef",
                "available": False,
                "stats": None,
                "error": f"CodeChef profile unavailable (status {response.status_code})"
            }

        soup = BeautifulSoup(response.text, "html.parser")

        # Name
        name_elem = soup.find("h1", class_="h2-style")
        if not name_elem:
            # If standard profile structure isn't present, treat as unavailable
            return {
                "username": username,
                "platform": "CodeChef",
                "available": False,
                "stats": None,
                "error": f"Could not parse CodeChef profile for '{username}'"
            }

        name = name_elem.text.strip() or username

        # Rating
        rating_elem = soup.find("div", class_="rating-number")
        rating_val = 0
        if rating_elem:
            nums = re.findall(r"\d+", rating_elem.text)
            if nums:
                rating_val = int(nums[0])

        # Stars
        stars_elem = soup.find("div", class_="rating-star")
        if stars_elem:
            stars = f"{len(stars_elem.find_all('span'))} Star"
        elif rating_val > 0:
            stars = get_stars_from_rating(rating_val)
        else:
            stars = "1 Star"

        # Global & Country Rank
        global_rank = "N/A"
        country_rank = "N/A"
        ranks = soup.find_all("a", href=re.compile(r"/ratings/all"))
        for rank_link in ranks:
            text = rank_link.text.strip()
            href = rank_link.get("href", "")
            if "filterBy" in href:
                country_rank = text
            else:
                global_rank = text

        # Problems solved
        solved_count = 0
        problems_section = soup.find("section", class_="problems-solved")
        if problems_section:
            match = re.search(r"\((\d+)\)", problems_section.text)
            if match:
                solved_count = int(match.group(1))
            else:
                h5_elem = problems_section.find("h5")
                if h5_elem:
                    nums = re.findall(r"\d+", h5_elem.text)
                    if nums:
                        solved_count = int(nums[-1])

        # Avatar
        img_elem = soup.find("img", class_="profileImage")
        avatar = img_elem.get("src", "") if img_elem else ""

        return {
            "username": username,
            "platform": "CodeChef",
            "available": True,
            "stats": {
                "name": name,
                "rating": rating_val,
                "stars": stars,
                "global_rank": global_rank,
                "country_rank": country_rank,
                "solved": solved_count,
                "avatar": avatar,
                "profile_url": url,
            },
            "error": None
        }

    except requests.RequestException as e:
        return {
            "username": username,
            "platform": "CodeChef",
            "available": False,
            "stats": None,
            "error": f"Network error connecting to CodeChef: {str(e)}"
        }
