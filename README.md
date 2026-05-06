# POPTHESKILLS

SkillSwap is a full-stack MERN-based web application that enables users to exchange skills through peer-to-peer collaboration. Instead of traditional paid learning, the platform promotes mutual knowledge sharing, where users can teach what they know and learn what they need.

The system integrates real-time communication, secure authentication, and feedback mechanisms to create a dynamic and trustworthy learning ecosystem.

## Motivation

In today's fast-paced world, the acquisition of new skills is essential for personal and professional growth. However, traditional learning methods often lack interaction and dynamism. SkillSwap was created to address this gap by providing a platform where users can learn from each other's experiences in a collaborative and supportive community.

## Features

1) Peer Connection & Collaboration
Send and accept connection requests, Real-time chat system using Socket.io, One-on-one skill exchange sessions
2) Industrial-Grade Security
Authentication using Google OAuth 2.0, Secure authorization via JWT (JSON Web Tokens),   Protected backend APIs and user sessions
3) Real-Time Communication
Instant messaging with Socket.io, Smooth and responsive chat interface, Enables hands-on guidance and interaction
4) Rating & Feedback System
Users can rate sessions, Provide feedback after skill exchange, Builds trust and credibility
5) Responsive UI/UX
Fully responsive design, Works across desktop, tablet, and mobile, Clean and intuitive interface
6) Dashboard Feature
The Dashboard provides a centralized overview of platform activity, User Dashboard, Total skills offered, Total skills requested, Active swap requests, Completed swaps, Notifications summary


## Technologies Used

- `Frontend`: React.js, React Router, Context API, React-Bootstrap, Axios,  Socket.io-client.
- `Backend`: Node.js, Express.js, MongoDB (MongoDB Atlas), Mongoose, Socket.io, JSON Web Token (JWT), Passport.js.
- `Tools`: Google Cloud Console (OAuth), MongoDB Compass, Postman, Docker, Docker Compose, VSCode, Git, GitHub.



## Installation

To run PopTheSkill locally, follow these steps:

### Prerequisites

1. For Google OAuth, know how to obtain the Google OAuth credentials and configure the redirect and allowed origins routes in the Google Cloud Console.
2. Know how to obtain the connection link of the MongoDB Atlas database.
3. For Nodemailer, you should know how to obtain the app password.
4. Familiarity with working on Node.js and React projects is required.

### Clone the Repo

```bash
git clone <repo link>
cd PopTheSkill-main
```

### Frontend Setup

```bash
cd Frontend; npm install
```

Create .env file in the frontend and write the following:

```env
VITE_LOCALHOST = http://localhost:8000
VITE_SERVER_URL = <your deployment link>
```

Run frontend

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

### Backend Setup

```bash
cd ../Backend; npm install
```

Create .env file in the frontend and write the following:

```env
PORT = 8000
CORS_ORIGIN = *
MONGODB_URI = mongodb+srv://<your-username>:<your-password>@cluster0.<your-project>.mongodb.net

CLOUDINARY_CLOUD_NAME = <your-cloudinary-cloud-name>
CLOUDINARY_API_KEY = <your-cloudinary-api-key>
CLOUDINARY_API_SECRET = <your-cloudinary-api-key>

GOOGLE_CLIENT_ID = <your-google-client-id> 
GOOGLE_CLIENT_SECRET = <your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

JWT_SECRET = <your-jwt-secret>

EMAIL_ID = <your-email-id>
APP_PASSWORD = <your-app-password>
```

Run backend

```bash
npm run dev
```

The frontend will be running on `http://localhost:8000`
