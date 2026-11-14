# YouTube-Study-Workspace

# YouTube Study Workspace

YouTube Study Workspace is a MERN stack web application that helps users turn YouTube playlists into a personal study tracker.

Instead of keeping track of videos manually, users can import a YouTube playlist and monitor their learning progress with checkboxes, notes, and bookmarks.

## Features

- User registration and login using JWT authentication
- Import any public YouTube playlist
- View all imported playlists
- Track progress by marking videos as completed
- Add personal notes for each video
- Bookmark important videos
- Delete playlists
- User-specific data (each user can only access their own playlists)

## Tech Stack

- React
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- YouTube Data API
- Axios

## How it Works

1. Create an account or log in.
2. Paste a YouTube playlist URL.
3. The app imports the playlist using the YouTube Data API.
4. Videos are stored in MongoDB.
5. Track your learning by marking videos complete, adding notes, and bookmarking important ones.

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd youtube-study-workspace
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

## Future Improvements

- Search videos inside a playlist
- Playlist synchronization when new videos are added
- AI-generated summaries and quizzes
- Dashboard with learning statistics
financial ledger
