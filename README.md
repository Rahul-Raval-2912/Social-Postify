# Social Postify

A comprehensive social media posting application that allows users to create, schedule, and publish posts across multiple platforms including Telegram, Instagram, Facebook, and WhatsApp.

## Features

- **Multi-platform posting**: Support for Telegram, Instagram, Facebook, and WhatsApp
- **AI Image Generation**: Generate images from text prompts using Stability AI
- **Post Scheduling**: Schedule posts for future publishing
- **User Authentication**: Secure user registration and login
- **Image Upload**: Upload your own images for posts
- **Hashtag Support**: Easy hashtag management in post descriptions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Django 5.2.4
- Django REST Framework
- Python Telegram Bot
- Instagrapi (Instagram posting)
- Stability AI (Image generation)
- SQLite Database

### Frontend
- React 19.1.0
- Axios for API calls
- React Router for navigation
- React DatePicker for scheduling
- React Toastify for notifications

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv envgp
envgp\Scripts\activate  # Windows
# or
source envgp/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
copy .env.example .env  # Windows
# or
cp .env.example .env  # Linux/Mac
```

5. Configure your environment variables in `.env`:
```
TELEGRAM_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id
STABILITY_API_KEY=your_stability_ai_key
```

6. Run migrations:
```bash
cd server
python manage.py makemigrations
python manage.py migrate
```

7. Create superuser (optional):
```bash
python manage.py createsuperuser
```

8. Start the Django server:
```bash
python manage.py runserver
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

3. Start the React development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Platform Configuration

### Telegram Setup
1. Create a bot via @BotFather on Telegram
2. Get your bot token
3. Add the bot to your channel/group
4. Get the chat ID using the bot API
5. Add credentials to `.env` file

### Instagram Setup
- No pre-configuration needed
- Credentials are requested at posting time for security
- Your username and password are NOT stored

### Facebook & WhatsApp
- Currently in development
- Will be added in future updates

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Posts
- `GET /api/posts/` - Get all posts
- `POST /api/posts/` - Create new post
- `PUT /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/generate_image/` - Generate image from prompt
- `POST /api/posts/{id}/publish/` - Publish post
- `GET /api/posts/{id}/results/` - Get posting results

### Social Accounts
- `GET /api/accounts/` - Get all accounts
- `POST /api/accounts/` - Add new account
- `PUT /api/accounts/{id}/` - Update account
- `DELETE /api/accounts/{id}/` - Delete account

## Usage

1. **Register/Login**: Create an account or login
2. **Add Social Accounts**: Configure your social media accounts
3. **Create Posts**: 
   - Write your content with hashtags
   - Upload an image or generate one with AI
   - Select target platforms
   - Schedule for later or publish immediately
4. **Manage Posts**: View, edit, or delete your posts
5. **Publishing**: Posts can be published immediately or scheduled

## Security Features

- Instagram credentials are never stored
- API tokens are encrypted in database
- CORS protection enabled
- CSRF protection for forms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.