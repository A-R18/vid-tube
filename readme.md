# VidTube

A scalable **YouTube-inspired video sharing platform** built with **Node.js**, **Express.js**, and **MongoDB**. VidTube provides a modern backend architecture for managing videos, channels, subscriptions, playlists, comments, likes, tweets (community posts), authentication, and user profiles.

The project demonstrates a production-oriented RESTful API design with secure authentication, cloud-based media storage, and efficient data management using MongoDB.

---

# Features

## Authentication & User Management

- User registration
- Secure login and logout
- JWT-based authentication
- Password hashing using bcrypt
- Update account information
- Change password
- Current user session retrieval
- Avatar updates
- Channel information
- Watch history and watch time tracking

---

## Video Management

- Upload videos
- Update video information
- Delete videos
- Fetch individual videos
- Retrieve uploaded videos
- Toggle video visibility/status
- Update video thumbnails/covers

---

## Channel System

- Public channel profiles
- Channel statistics
- Channel video listing
- Subscriber count
- Subscription management

---

## Comments

- Add comments
- Edit comments
- Delete comments
- Retrieve comments for any video

---

## Likes

Support for liking and unliking:

- Videos
- Comments
- Tweets

Users can also retrieve all liked videos.

---

## Playlist Management

- Create playlists
- Delete playlists
- Retrieve playlists
- Add videos to playlists
- Remove videos from playlists
- View playlist contents

---

## Subscription System

- Subscribe to channels
- Unsubscribe from channels
- View subscribers
- View subscribed channels

---

## Tweets (Community Posts)

- Create tweets
- Edit tweets
- Delete tweets
- Retrieve user tweets

---

## Dashboard

Dashboard endpoints provide:

- Channel statistics
- Uploaded videos
- Analytics-ready data

---

## Health Monitoring

Dedicated application health endpoint for monitoring server availability.

---

# Technology Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose ODM

## Authentication & Security

- JSON Web Tokens (JOSE)
- bcrypt
- Cookie Parser
- CORS

## File Uploads

- Multer

## Cloud Storage

- Cloudinary

## Environment Management

- dotenv

## Development Tools

- Nodemon
- Prettier

---

# Project Structure

```text
project/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── public/
├── uploads/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd vid-tube
```

Install dependencies:

```bash
npm install
```

---



# Running the Project

Development mode:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

# API Base Routes

| Route | Description |
|--------|-------------|
| `/app/users` | User authentication and profile management |
| `/app/video` | Video management |
| `/app/comments` | Comment operations |
| `/app/like` | Like system |
| `/app/playlist` | Playlist management |
| `/app/subscription` | Subscription management |
| `/app/dashboard` | Dashboard and channel statistics |
| `/app/tweet` | Community posts (Tweets) |
| `/application` | Health check |

---

# API Overview

## User Routes

- Register account
- Login
- Logout
- Current user
- Update account
- Change password
- Update avatar
- Update video cover
- Watch time
- Channel profile

---

## Video Routes

- Upload video
- Retrieve video
- Update video
- Delete video
- Retrieve uploaded videos
- Toggle publish status

---

## Comment Routes

- Add comment
- Edit comment
- Delete comment
- Retrieve comments for a video

---

## Playlist Routes

- Create playlist
- Delete playlist
- Retrieve playlist
- Add video to playlist
- Remove video from playlist
- Retrieve user playlists

---

## Subscription Routes

- Toggle subscription
- Retrieve subscriptions
- Retrieve subscribers

---

## Like Routes

- Toggle video like
- Toggle comment like
- Toggle tweet like
- Retrieve liked videos

---

## Tweet Routes

- Create tweet
- Edit tweet
- Delete tweet
- Retrieve user tweets

---

## Dashboard Routes

- Retrieve channel videos
- Retrieve channel statistics

---

## Health Route

Returns the application's health status.

---

# Database

VidTube uses **MongoDB**, a NoSQL document database.

Primary collections include:

- Users
- Videos
- Comments
- Likes
- Tweets
- Playlists
- Subscriptions

Relationships between collections are maintained using MongoDB ObjectIds through Mongoose models.

---

# Media Storage

Uploaded media is stored using **Cloudinary**, allowing scalable cloud-based storage for:

- Videos
- User avatars
- Video thumbnails

---

# Authentication

Authentication is implemented using:

- Access Tokens
- Refresh Tokens
- Secure HTTP Cookies
- Password hashing with bcrypt

Protected endpoints require authenticated users before performing write operations.

---

# Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Code formatting:

```bash
npx prettier --write .
```

---

# Architecture

```text
               Client
                  │
                  ▼
            Express Server
                  │
     ┌────────────┼────────────┐
     │            │            │
Controllers   Middlewares   Authentication
     │
     ▼
 Mongoose Models
     │
     ▼
   MongoDB
     │
     ▼
 Cloudinary (Media Storage)
```

---

# Highlights

- RESTful API architecture
- JWT authentication
- MongoDB NoSQL database
- Cloud-based media storage
- Modular Express routing
- Secure password management
- Playlist management
- Subscription system
- Community posts
- Video engagement through comments and likes
- Production-ready backend organization

---

# License

This project is intended for educational purposes and demonstrates the implementation of a modern video-sharing platform backend using Node.js, Express.js, and MongoDB.

---

# Author (Abdullah Rashid)

VidTube is a full-stack backend project inspired by the core functionality of YouTube, focusing on scalable API design, secure authentication, media management, and efficient NoSQL data modeling using MongoDB.