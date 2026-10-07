import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app, g
from .models import User

def generate_token(user: User) -> str:
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token is missing', 'message': 'Token is missing!'}), 401

        try:
            parts = auth_header.split(' ')
            token = parts[1] if len(parts) > 1 else parts[0]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])

            current_user = User.query.get(data.get('user_id'))
            if not current_user:
                return jsonify({'error': 'User not found', 'message': 'Invalid token!'}), 401

            g.current_user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired', 'message': 'Session expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token', 'message': 'Invalid token!'}), 401
        except Exception as e:
            return jsonify({'error': str(e), 'message': 'Authentication failed'}), 401

        return f(*args, **kwargs)
    return decorated
