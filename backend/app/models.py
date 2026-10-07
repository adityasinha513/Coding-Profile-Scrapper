from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False, default="")
    
    # Platform Handles
    leetcode_handle = db.Column(db.String(100), default="")
    github_handle = db.Column(db.String(100), default="")
    codeforces_handle = db.Column(db.String(100), default="")
    codechef_handle = db.Column(db.String(100), default="")
    gfg_handle = db.Column(db.String(100), default="")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    friends = db.relationship('Friend', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def get_handles(self) -> dict:
        return {
            'leetcode': self.leetcode_handle or "",
            'github': self.github_handle or "",
            'codeforces': self.codeforces_handle or "",
            'codechef': self.codechef_handle or "",
            'gfg': self.gfg_handle or ""
        }

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'handles': self.get_handles(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Friend(db.Model):
    __tablename__ = 'friends'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), default="")

    # Platform Handles
    leetcode_handle = db.Column(db.String(100), default="")
    github_handle = db.Column(db.String(100), default="")
    codeforces_handle = db.Column(db.String(100), default="")
    codechef_handle = db.Column(db.String(100), default="")
    gfg_handle = db.Column(db.String(100), default="")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_handles(self) -> dict:
        return {
            'leetcode': self.leetcode_handle or "",
            'github': self.github_handle or "",
            'codeforces': self.codeforces_handle or "",
            'codechef': self.codechef_handle or "",
            'gfg': self.gfg_handle or ""
        }

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'handles': self.get_handles(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
