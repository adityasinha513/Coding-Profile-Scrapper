from flask import Blueprint, request, jsonify, g
from .models import db, User, Friend
from .auth import generate_token, token_required
from .cache import cache
from .scrapers import (
    fetch_leetcode_profile,
    fetch_github_profile,
    fetch_codeforces_profile,
    fetch_codechef_profile,
    fetch_gfg_profile,
)

api = Blueprint('api', __name__)

PLATFORM_FETCHERS = {
    'leetcode': fetch_leetcode_profile,
    'github': fetch_github_profile,
    'codeforces': fetch_codeforces_profile,
    'codechef': fetch_codechef_profile,
    'gfg': fetch_gfg_profile,
}

def fetch_single_profile(platform: str, handle: str, force_refresh: bool = False) -> dict:
    platform_key = platform.lower()
    fetcher = PLATFORM_FETCHERS.get(platform_key)
    if not fetcher or not handle:
        return {
            'username': handle or '',
            'platform': platform,
            'available': False,
            'stats': None,
            'error': f'Unsupported platform {platform}' if not fetcher else 'Handle is empty'
        }

    cache_key = f"profile:{platform_key}:{handle.strip().lower()}"
    if not force_refresh:
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

    result = fetcher(handle.strip())
    if result and result.get('available'):
        cache.set(cache_key, result, ttl=600)  # 10 minutes cache
    return result

def aggregate_profiles(handles: dict, force_refresh: bool = False) -> list:
    profiles = []
    for platform, handle in handles.items():
        if handle:
            data = fetch_single_profile(platform, handle, force_refresh=force_refresh)
            if data:
                profiles.append(data)
    return profiles

def extract_metric(profile_data: dict, key: str, default=0):
    """Safely extracts a metric from the stats dictionary."""
    if not profile_data or not profile_data.get('available'):
        return default
    stats = profile_data.get('stats') or {}
    return stats.get(key, default)

# ----------------- Health -----------------
@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'UP',
        'service': 'Coding Profile Scrapper API',
        'version': '1.0.0'
    })

# ----------------- Auth -----------------
@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    name = (data.get('name') or '').strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required', 'message': 'Email and password are required'}), 400

    if len(password) < 4:
        return jsonify({'error': 'Password must be at least 4 characters', 'message': 'Password is too short'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists', 'message': 'Account already exists'}), 409

    user = User(
        email=email,
        name=name or email.split('@')[0],
        leetcode_handle=(data.get('leetcode') or '').strip(),
        github_handle=(data.get('github') or '').strip(),
        codeforces_handle=(data.get('codeforces') or '').strip(),
        codechef_handle=(data.get('codechef') or '').strip(),
        gfg_handle=(data.get('gfg') or '').strip()
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': 'Registration successful'
    }), 201

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password are required', 'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password', 'message': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': 'Login successful'
    })

@api.route('/auth/me', methods=['GET'])
@token_required
def get_me():
    return jsonify(g.current_user.to_dict())

# ----------------- Profiles -----------------
@api.route('/profiles', methods=['GET'])
@token_required
def get_user_profiles():
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    handles = g.current_user.get_handles()
    profiles = aggregate_profiles(handles, force_refresh=force_refresh)

    # Compute summary stats
    total_solved = sum(
        extract_metric(p, 'solved', 0)
        for p in profiles
        if p.get('platform') in ['LeetCode', 'CodeChef', 'GFG']
    )
    ratings = [
        extract_metric(p, 'rating')
        for p in profiles
        if isinstance(extract_metric(p, 'rating'), (int, float)) and extract_metric(p, 'rating') > 0
    ]
    best_rating = max(ratings) if ratings else 0

    return jsonify({
        'profiles': profiles,
        'summary': {
            'total_solved': total_solved,
            'best_rating': best_rating,
            'platforms_connected': len([h for h in handles.values() if h])
        }
    })

@api.route('/profiles/handles', methods=['PUT'])
@token_required
def update_handles():
    data = request.get_json() or {}
    user = g.current_user

    for platform in ['leetcode', 'github', 'codeforces', 'codechef', 'gfg']:
        if platform in data:
            old_val = getattr(user, f"{platform}_handle") or ""
            new_val = (data[platform] or '').strip()
            setattr(user, f"{platform}_handle", new_val)
            # Invalidate old and new cache keys
            if old_val:
                cache.delete(f"profile:{platform}:{old_val.lower()}")
            if new_val:
                cache.delete(f"profile:{platform}:{new_val.lower()}")

    if 'name' in data and data['name']:
        user.name = data['name'].strip()

    db.session.commit()
    return jsonify({
        'user': user.to_dict(),
        'message': 'Handles updated successfully'
    })

@api.route('/profiles/scrape/<platform>/<handle>', methods=['GET'])
def scrape_preview(platform, handle):
    data = fetch_single_profile(platform, handle, force_refresh=True)
    if not data or not data.get('available'):
        return jsonify(data or {'error': 'Profile unavailable', 'available': False}), 404
    return jsonify(data)

# ----------------- Friends -----------------
@api.route('/friends', methods=['GET'])
@token_required
def get_friends():
    friends = Friend.query.filter_by(user_id=g.current_user.id).order_by(Friend.created_at.desc()).all()
    results = []

    for f in friends:
        friend_data = f.to_dict()
        friend_data['profiles'] = aggregate_profiles(f.get_handles(), force_refresh=False)
        total_solved = sum(
            extract_metric(p, 'solved', 0)
            for p in friend_data['profiles']
            if p.get('platform') in ['LeetCode', 'CodeChef', 'GFG']
        )
        ratings = [
            extract_metric(p, 'rating')
            for p in friend_data['profiles']
            if isinstance(extract_metric(p, 'rating'), (int, float)) and extract_metric(p, 'rating') > 0
        ]
        friend_data['summary'] = {
            'total_solved': total_solved,
            'best_rating': max(ratings) if ratings else 0
        }
        results.append(friend_data)

    return jsonify(results)

@api.route('/friends', methods=['POST'])
@token_required
def add_friend():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()

    if not name:
        return jsonify({'error': 'Friend name is required', 'message': 'Name is required'}), 400

    handles = data.get('handles') or {}

    friend = Friend(
        user_id=g.current_user.id,
        name=name,
        email=email,
        leetcode_handle=(handles.get('leetcode') or data.get('leetcode') or '').strip(),
        github_handle=(handles.get('github') or data.get('github') or '').strip(),
        codeforces_handle=(handles.get('codeforces') or data.get('codeforces') or '').strip(),
        codechef_handle=(handles.get('codechef') or data.get('codechef') or '').strip(),
        gfg_handle=(handles.get('gfg') or data.get('gfg') or '').strip()
    )

    db.session.add(friend)
    db.session.commit()

    return jsonify({
        'friend': friend.to_dict(),
        'message': 'Friend added successfully'
    }), 201

@api.route('/friends/<int:friend_id>', methods=['DELETE'])
@token_required
def delete_friend(friend_id):
    friend = Friend.query.filter_by(id=friend_id, user_id=g.current_user.id).first()
    if not friend:
        return jsonify({'error': 'Friend not found', 'message': 'Friend not found'}), 404

    db.session.delete(friend)
    db.session.commit()
    return jsonify({'message': 'Friend removed successfully'})

# ----------------- Leaderboard -----------------
@api.route('/leaderboard', methods=['GET'])
@token_required
def get_leaderboard():
    """Returns ranked leaderboard comparing current user and their added friends."""
    entries = []

    # Current User
    user_handles = g.current_user.get_handles()
    user_profiles = aggregate_profiles(user_handles, force_refresh=False)
    user_solved = sum(
        extract_metric(p, 'solved', 0)
        for p in user_profiles
        if p.get('platform') in ['LeetCode', 'CodeChef', 'GFG']
    )
    user_ratings = [
        extract_metric(p, 'rating')
        for p in user_profiles
        if isinstance(extract_metric(p, 'rating'), (int, float)) and extract_metric(p, 'rating') > 0
    ]

    def get_stat(profiles_list, platform_name, stat_name):
        p = next((p for p in profiles_list if p.get('platform') == platform_name), None)
        return extract_metric(p, stat_name, 0)

    entries.append({
        'id': f"user-{g.current_user.id}",
        'name': g.current_user.name or g.current_user.email,
        'is_current_user': True,
        'total_solved': user_solved,
        'best_rating': max(user_ratings) if user_ratings else 0,
        'leetcode_solved': get_stat(user_profiles, 'LeetCode', 'solved'),
        'codeforces_rating': get_stat(user_profiles, 'Codeforces', 'rating'),
        'codechef_rating': get_stat(user_profiles, 'CodeChef', 'rating'),
        'github_stars': get_stat(user_profiles, 'GitHub', 'total_stars'),
    })

    # Friends
    friends = Friend.query.filter_by(user_id=g.current_user.id).all()
    for f in friends:
        f_profiles = aggregate_profiles(f.get_handles(), force_refresh=False)
        f_solved = sum(
            extract_metric(p, 'solved', 0)
            for p in f_profiles
            if p.get('platform') in ['LeetCode', 'CodeChef', 'GFG']
        )
        f_ratings = [
            extract_metric(p, 'rating')
            for p in f_profiles
            if isinstance(extract_metric(p, 'rating'), (int, float)) and extract_metric(p, 'rating') > 0
        ]

        entries.append({
            'id': f"friend-{f.id}",
            'name': f.name,
            'is_current_user': False,
            'total_solved': f_solved,
            'best_rating': max(f_ratings) if f_ratings else 0,
            'leetcode_solved': get_stat(f_profiles, 'LeetCode', 'solved'),
            'codeforces_rating': get_stat(f_profiles, 'Codeforces', 'rating'),
            'codechef_rating': get_stat(f_profiles, 'CodeChef', 'rating'),
            'github_stars': get_stat(f_profiles, 'GitHub', 'total_stars'),
        })

    # Sort primarily by total problems solved, secondarily by best rating
    entries.sort(key=lambda x: (x['total_solved'], x['best_rating']), reverse=True)

    for rank, entry in enumerate(entries, 1):
        entry['rank'] = rank

    return jsonify(entries)
