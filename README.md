# chat-app
beginner backend project


Real-time Chat Application
A full-stack real-time chat application built with Node.js, Express, Socket.IO, MongoDB, Kafka, and Redis, featuring user authentication, media sharing, and typing indicators.

Table of Contents
Features

Technologies Used

Prerequisites

Setup and Installation

Clone the Repository

Install Node.js Dependencies

Start Docker Services (Kafka, Zookeeper, Redis)

Start the Node.js Server

Usage

Project Structure

Future Enhancements

Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens) and bcryptjs for password hashing.

Separate Pages: Dedicated pages for authentication (auth.html) and chat (index.html) for a clean user experience.

Real-time Messaging: Instant message delivery using Socket.IO.

Message Persistence: Messages are stored in MongoDB via Kafka for reliable delivery and historical viewing.

Image/GIF Sharing: Send images and GIFs directly within the chat (base64 encoding for simplicity).

Typing Indicators: Real-time "user is typing..." status using Redis for temporary storage.

Logout Functionality: Users can explicitly log out, clearing their session.

Scalable Architecture: Utilizes Kafka for message queuing, allowing for decoupled services and handling high message volumes.

Technologies Used
Backend:

Node.js

Express.js (Web Framework)

Socket.IO (WebSockets for real-time communication)

Mongoose (MongoDB ODM)

KafkaJS (Kafka Client)

Redis (for temporary data like typing status)

jsonwebtoken (JWT for authentication)

bcryptjs (Password hashing)

body-parser (Middleware for parsing request bodies)

Database:

MongoDB

Redis

Message Broker:

Apache Kafka

Frontend:

HTML5

CSS3 (style.css)

JavaScript (main.js)

Socket.IO Client Library

Prerequisites
Before you begin, ensure you have the following installed on your machine:

Node.js: (LTS version recommended)

Download Node.js

npm: (Comes with Node.js)

Docker Desktop: (For running Kafka, Zookeeper, and Redis containers)

Download Docker Desktop

Git: (For cloning the repository)

Download Git

Setup and Installation
Follow these steps to get the chat application up and running on your local machine.

1. Clone the Repository
First, clone the project repository to your local machine:

git clone https://github.com/advyy100i/chat-app.git
cd chat-app

2. Install Node.js Dependencies
Navigate to the project root directory and install the required Node.js packages:

npm install

3. Start Docker Services (Kafka, Zookeeper, Redis)
The application relies on Kafka, Zookeeper, and Redis, which are configured via Docker Compose.

Navigate to the server directory and start the Docker containers:

cd server
docker-compose up -d

This command will pull the necessary Docker images and start the services in the background.

4. Start the Node.js Server
Now, go back to the project root directory and start the Node.js server:

cd .. # If you are still in the server directory
npm start

You should see messages indicating that MongoDB is connected and the server is running on http://localhost:3000.

Usage
Access the Application: Open your web browser and navigate to http://localhost:3000/. You will be automatically redirected to the authentication page (auth.html).

Register:

Enter a desired Username and Password in the "Register" section.

Click the "Register" button. You should receive a success message.

Login:

After successful registration (or if you already have an account), enter your Username and Password in the "Login" section.

Click the "Login" button.

Upon successful login, you will be redirected to the chat page (index.html).

Chatting:

On the chat page, you will see your logged-in username displayed.

Type your message in the input field and press "Send" or Enter.

Send Images/GIFs: Use the "Choose File" input next to the text box to select an image or GIF. Click "Send" to upload and share it in the chat.

Typing Status: When another user starts typing, you will see a "User is typing..." indicator.

Logout:

Click the "Logout" button on the chat page to clear your session and return to the authentication page.

Project Structure
Chatapp/
├── client/
│   ├── auth.html           # Authentication (Register/Login) page
│   ├── index.html          # Main Chat page
│   ├── main.js             # Client-side JavaScript logic
│   └── style.css           # Global CSS styles
├── server/
│   ├── analytics/
│   │   └── analyzer.js     # (Currently unused) Basic word frequency analysis
│   ├── auth/
│   │   ├── authController.js # Handles user registration and login logic
│   │   ├── authMiddleware.js # Middleware for JWT verification (used by Socket.IO)
│   │   └── authRoutes.js   # Defines API routes for authentication
│   ├── kafka/
│   │   ├── consumer.js     # Consumes messages from Kafka and saves to MongoDB
│   │   └── producer.js     # Produces messages to Kafka
│   ├── models/
│   │   ├── Message.js      # Mongoose schema for chat messages
│   │   └── User.js         # Mongoose schema for users (with password hashing)
│   ├── docker-compose.yml  # Docker Compose setup for Kafka, Zookeeper, Redis
│   └── index.js            # Main server entry point (Express, Socket.IO, DB, Redis integration)
├── package.json            # Project dependencies and scripts
└── package-lock.json       # Dependency tree lock file

Future Enhancements
Real-time User List: Display a list of currently active users.

Private Messaging: Implement one-on-one private chats.

Message History Loading: Load previous messages from MongoDB when a user joins the chat.

Error Handling & UI Feedback: More sophisticated error messages and loading indicators on the client-side.

File Uploads to Cloud Storage: Instead of base64, upload images to a cloud storage service (e.g., AWS S3, Google Cloud Storage) and send image URLs.

Enhanced Security: Implement HTTPS, rate limiting, and more robust input validation.

Deployment: Instructions for deploying the application to a cloud provider.

Unit/Integration Tests: Add tests for server-side and client-side logic.
