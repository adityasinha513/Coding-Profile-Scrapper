import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .models import db, User, Friend

load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    os.makedirs(app.instance_path, exist_ok=True)
    default_db_path = os.path.join(app.instance_path, 'coding_profiles.db')

    # Base configuration
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'portfolio-v1-super-secret-key-2026'),
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL', f"sqlite:///{default_db_path}"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config:
        app.config.update(test_config)

    # CORS setup allowing frontend on port 3000 or custom origins
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Init database
    db.init_app(app)

    # Register blueprints
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    # Ensure tables exist and seed demo data
    with app.app_context():
        db.create_all()
        seed_initial_data()

    return app

def seed_initial_data():
    """Seeds demo user & friend if database is freshly created."""
    if User.query.count() == 0:
        # Primary user: Aditya Sinha
        aditya = User(
            email='adityasinha513@gmail.com',
            name='Aditya Sinha',
            leetcode_handle='adityasinha513',
            github_handle='adityasinha513',
            codeforces_handle='tourist',
            codechef_handle='chandravo',
            gfg_handle='adityasinha513'
        )
        aditya.set_password('123456')
        db.session.add(aditya)

        # Demo Guest Account for Portfolio Reviewers
        demo_user = User(
            email='demo@portfolio.com',
            name='Guest Reviewer',
            leetcode_handle='tourist',
            github_handle='torvalds',
            codeforces_handle='tourist',
            codechef_handle='chandravo',
            gfg_handle='geeksforgeeks'
        )
        demo_user.set_password('demo123')
        db.session.add(demo_user)
        db.session.commit()

        # Add sample friend for comparison
        friend1 = Friend(
            user_id=aditya.id,
            name='Aarya Gupta',
            email='aaryax135@gmail.com',
            leetcode_handle='Aarya135',
            github_handle='aaryaa135',
            codeforces_handle='petr',
            codechef_handle='aarya135',
            gfg_handle='aaryagt7b'
        )
        db.session.add(friend1)
        db.session.commit()
