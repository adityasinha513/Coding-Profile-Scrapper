import sys
import json
from app import create_app
from app.models import db, User, Friend

def run_tests():
    print("=" * 60)
    print("Running DevProfile.hub V1 Backend Test Suite")
    print("=" * 60)

    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    client = app.test_client()

    with app.app_context():
        # 1. Health check
        res = client.get('/api/health')
        assert res.status_code == 200, f"Health check failed: {res.status_code}"
        data = res.get_json()
        assert data.get('status') == 'UP', f"Status not UP: {data}"
        print("[PASS] 1. Health endpoint (GET /api/health)")

        # 2. Registration
        test_email = 'tester@example.com'
        test_pw = 'secret123'
        res = client.post('/api/auth/register', json={
            'email': test_email,
            'password': test_pw,
            'name': 'Test Engineer',
            'leetcode': 'tourist',
            'github': 'torvalds'
        })
        assert res.status_code == 201, f"Registration failed: {res.status_code} {res.get_json()}"
        reg_data = res.get_json()
        token = reg_data.get('token')
        assert token, "Token missing in registration"
        print("[PASS] 2. User registration (POST /api/auth/register)")

        # 3. Duplicate registration
        res = client.post('/api/auth/register', json={
            'email': test_email,
            'password': test_pw,
            'name': 'Duplicate User'
        })
        assert res.status_code == 409, f"Duplicate registration didn't return 409: {res.status_code}"
        print("[PASS] 3. Duplicate email handling (409 Conflict)")

        # 4. Valid login
        res = client.post('/api/auth/login', json={'email': test_email, 'password': test_pw})
        assert res.status_code == 200, f"Login failed: {res.status_code}"
        login_data = res.get_json()
        auth_token = login_data.get('token')
        assert auth_token, "Token missing in login"
        print("[PASS] 4. User login (POST /api/auth/login)")

        # 5. Invalid credentials login
        res = client.post('/api/auth/login', json={'email': test_email, 'password': 'wrongpassword'})
        assert res.status_code == 401, f"Invalid password didn't return 401: {res.status_code}"
        print("[PASS] 5. Invalid credentials check (401 Unauthorized)")

        # 6. Protected endpoint rejection
        res = client.get('/api/auth/me')
        assert res.status_code == 401, f"Protected endpoint without token didn't return 401: {res.status_code}"
        print("[PASS] 6. Unauthorized access rejection (401)")

        # 7. Protected endpoint with token
        headers = {'Authorization': f'Bearer {auth_token}'}
        res = client.get('/api/auth/me', headers=headers)
        assert res.status_code == 200, f"GET /api/auth/me failed: {res.status_code}"
        me_data = res.get_json()
        assert me_data['email'] == test_email
        print("[PASS] 7. Authenticated user profile (GET /api/auth/me)")

        # 8. Update handles
        res = client.put('/api/profiles/handles', json={
            'codeforces': 'tourist',
            'codechef': 'chandravo'
        }, headers=headers)
        assert res.status_code == 200
        handles = res.get_json()['user']['handles']
        assert handles['codeforces'] == 'tourist'
        print("[PASS] 8. Profile handles update (PUT /api/profiles/handles)")

        # 9. Scrape preview live valid user
        res = client.get('/api/profiles/scrape/leetcode/tourist')
        assert res.status_code == 200, f"Scrape preview failed: {res.status_code}"
        preview = res.get_json()
        assert preview['available'] is True
        assert preview['stats']['solved'] >= 0
        print(f"[PASS] 9. Live LeetCode scraping (solved: {preview['stats']['solved']})")

        # 10. Scrape preview invalid user (must report unavailable, not crash or fake)
        res = client.get('/api/profiles/scrape/leetcode/nonexistent_user_99999_xyz')
        assert res.status_code == 404
        bad_preview = res.get_json()
        assert bad_preview['available'] is False
        assert bad_preview['error'] is not None
        print(f"[PASS] 10. Nonexistent user handling (available: False, error: '{bad_preview['error']}')")

        # 11. Fetch user aggregated profiles and cache
        res = client.get('/api/profiles', headers=headers)
        assert res.status_code == 200
        profiles_res = res.get_json()
        assert 'profiles' in profiles_res
        assert 'summary' in profiles_res
        print(f"[PASS] 11. Aggregated profiles endpoint (total solved: {profiles_res['summary']['total_solved']})")

        # 12. Add friend
        res = client.post('/api/friends', json={
            'name': 'Gennady',
            'email': 'gennady@cf.com',
            'codeforces': 'tourist',
            'leetcode': 'tourist'
        }, headers=headers)
        assert res.status_code == 201
        friend_id = res.get_json()['friend']['id']
        print(f"[PASS] 12. Add friend (POST /api/friends, id: {friend_id})")

        # 13. Get friends
        res = client.get('/api/friends', headers=headers)
        assert res.status_code == 200
        friends_list = res.get_json()
        assert len(friends_list) >= 1
        print(f"[PASS] 13. Friends list with aggregated stats (count: {len(friends_list)})")

        # 14. Leaderboard
        res = client.get('/api/leaderboard', headers=headers)
        assert res.status_code == 200
        leaderboard = res.get_json()
        assert len(leaderboard) >= 2
        assert leaderboard[0]['rank'] == 1
        print(f"[PASS] 14. Leaderboard ranking (rank 1: {leaderboard[0]['name']})")

        # 15. Delete friend
        res = client.delete(f'/api/friends/{friend_id}', headers=headers)
        assert res.status_code == 200
        print("[PASS] 15. Remove friend (DELETE /api/friends/:id)")

    print("=" * 60)
    print("ALL 15 BACKEND TESTS PASSED WITH 100% SUCCESS")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
