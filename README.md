# Coding Profile Scrapper

A web application that helps you track and compare coding profiles across multiple platforms including LeetCode, CodeChef, GFG, and GitHub. Built with React.js and Python Flask.

![image](https://github.com/user-attachments/assets/8ba494a1-90fc-4334-8cf4-b6a26c025b05)


## Features

- 🔍 Track coding profiles across multiple platforms
- 👥 Compare your progress with friends
- 📊 View detailed statistics and rankings
- 🌓 Dark/Light mode support
- 📱 Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- Material-UI
- Axios for API calls
- React Router for navigation

### Backend
- Python with Flask
- BeautifulSoup4 for web scraping
- JWT for authentication
- CORS support

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Register/Login to your account
2. Add your coding platform usernames
3. View your profile statistics
4. Add friends to compare progress
5. Track your growth over time

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

Aditya Sinha
- GitHub: [@adityasinha513](https://github.com/adityasinha513)
