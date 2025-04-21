# AI Echo - Chatting Website

This project implements a real-time chatting application using Django Channels, DRF, Redis, Daphne, React JS and SQLite as the database.
It allows users to communicate realtime via WebSockets and integrates AI functionalities for enhanced chat experiences.

![Preview Image](https://github.com/dinoCodes2005/AI-Echo/blob/main/preview%20Images/Screenshot%202025-04-22%20010444.png)

## Features

- Real-time chat with WebSocket support
- AI generated replies and summary of the chat using GEMINI 2.0 flash model
- AI generated realtime chat translation
- Personalised response based on profile customisation
- Multi-language support with emojis
- User authentication via Django Rest Framework (DRF) and simple JWT
- SQLite database for storing user data and chat messages

## Tech Stack

- **Backend**: Django, Django Channels, Redis, Daphne, Django Rest Framework (DRF)
- **Frontend**: React JS , Tailwind CSS , React Resizable Panels, React-use-Websocket Hook
- **Database**: SQLite

## Installation

### Setup Instructions

#### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```
2. **Setting up the frontend**:
   ```bash
   npm i
   ```
3. **Setting the backend**:
   - Create the virtual environment and install the dependencies
   ```bash
   python -m venv venv
   venv/Scripts/activate
   pip install -r requirements.txt
   ```
  - Create an .env file and add the API key
  ```
  GEMINI_API_KEY = <your_api_key>
  ```
  - Create the database and configure superuser
  ```
  cd backend
  python manage.py makemigrations
  python manage.py migrate
  python manage.py createsuperuser
  ```
4. **Setting up Redis**:
   - on Linux open terminal and
     ```
     sudo apt update
     sudo apt install redis-server
     sudo service redis-server start
     redis-cli ping
     ```
   if you receive PONG then you are good to go 😀
   - on Windows Download Ubuntu 22.04.5 LTS to run WSL and follow the above steps
5. **Firing up the server**:
    - loading the backend server
   ```
   cd backend
   python manage.py runserver
   ```
   - loading the frontend server
   ```
   cd frontend
   npm start
   ```
Boom you are good to go !! Your realtime chat-application has started working !!!
Visit ```http://localhost:3000/default``` to access the website !!





   
