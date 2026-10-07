import requests
import json

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

USER_QUERY = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      ranking
      userAvatar
      reputation
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
}
"""

def fetch_leetcode_profile(username: str) -> dict:
    """
    Fetches real-time LeetCode profile data using LeetCode's public GraphQL endpoint.
    Retrieves exact problems solved (Easy/Medium/Hard), contest rating, and global ranking.
    """
    username = username.strip()
    if not username:
        return {"platform": "LeetCode", "error": "Username cannot be empty"}

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": f"https://leetcode.com/{username}/"
    }

    payload = {
        "query": USER_QUERY,
        "variables": {"username": username}
    }

    try:
        response = requests.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers, timeout=10)
        if response.status_code != 200:
            return {
                "platform": "LeetCode",
                "username": username,
                "error": f"LeetCode returned status code {response.status_code}"
            }

        data = response.json().get("data", {})
        matched_user = data.get("matchedUser")

        if not matched_user:
            return {
                "platform": "LeetCode",
                "username": username,
                "error": f"LeetCode user '{username}' not found"
            }

        profile = matched_user.get("profile") or {}
        ac_submissions = matched_user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])

        solved_counts = {"All": 0, "Easy": 0, "Medium": 0, "Hard": 0}
        for item in ac_submissions:
            diff = item.get("difficulty")
            count = item.get("count", 0)
            if diff in solved_counts:
                solved_counts[diff] = count

        contest_ranking = data.get("userContestRanking") or {}
        rating = contest_ranking.get("rating")
        contest_rating = round(rating) if rating is not None else None
        global_contest_rank = contest_ranking.get("globalRanking")
        top_percentage = contest_ranking.get("topPercentage")

        return {
            "platform": "LeetCode",
            "username": username,
            "name": profile.get("realName") or username,
            "avatar": profile.get("userAvatar") or "",
            "global_rank": profile.get("ranking"),
            "solved": solved_counts["All"],
            "solved_easy": solved_counts["Easy"],
            "solved_medium": solved_counts["Medium"],
            "solved_hard": solved_counts["Hard"],
            "rating": contest_rating,
            "contest_rank": global_contest_rank,
            "top_percentage": f"{top_percentage:.1f}%" if top_percentage is not None else None,
            "profile_url": f"https://leetcode.com/{username}/",
            "error": None
        }

    except requests.RequestException as e:
        return {
            "platform": "LeetCode",
            "username": username,
            "error": f"Network error fetching LeetCode profile: {str(e)}"
        }
