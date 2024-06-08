# TwitX

This is a full-stack twitter clone built using modern web technologies:

- **Frontend:** React + Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB

Cloudinary is used as an image host

## Live Preview

[Live Preview](https://twitxr.netlify.app)
Register a new account and start twitxing!

## Installation

- Clone the repository.

- Navigate to the backend directory.

- Run `npm install` to install dependencies.

- Check the .env example file and enter your credentials

- Run `node index.js` to start the backend server.

- Navigate to the frontend directory.

- Run `npm install` to install dependencies.

- Check the .env example file and enter your credentials

- Run `npm run dev` to start the frontend.

## API Endpoints

**Authentication:** `api/auth`

- `/`: GET - Authenticate a user with their jwt token and send their information back
- `/register`: POST - Register a new user with their name,username, email and password
- `/login`: POST - Login user with username and password

**User:** `api/user`

- `/`: GET - Fetch all users
- `/:username`: GET - Fetch one user
- `/:username/tweets`: GET - Fetch tweets of one user
- `/:id`: PUT - Update user profile information
- `/:id/follow`: POST - Follow a user
- `/:id/unfollow`: POST - Unfollow a user
- `/:id/uploadProfilePic`: POST - Upload user profile picture

**Tweets:** `api/tweet`

- `/`: GET - Fetch all tweets
- `/:id`: GET - Fetch single tweet
- `/`: POST - Create new tweet and upload it's image (optional)
- `/:id/reply`: POST - Create a new tweet as a reply to another tweet (image optional)
- `/:id/like`: POST - Like a tweet
- `/:id/dislike`: POST - Unlike a tweet
- `/:id/retweet`: POST - Retweet a tweet
- `/:id`: DELETE - Delete a tweet
