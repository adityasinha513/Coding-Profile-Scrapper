import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    print(f"[INFO] Coding Profile Scrapper Backend running on http://{host}:{port}")
    app.run(host=host, port=port, debug=True)
