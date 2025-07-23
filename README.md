```markdown
# Real-time Chat Application

A full-stack real-time chat application with Node.js, Express, Socket.IO, MongoDB, Kafka, and Redis.

## Features

* **User Authentication**: Secure registration and login (JWT, bcryptjs).

* **Separate Pages**: Dedicated auth and chat interfaces.

* **Real-time Messaging**: Instant delivery via Socket.IO.

* **Message Persistence**: Messages stored in MongoDB via Kafka.

* **Media Sharing**: Send images/GIFs (base64).

* **Typing Indicators**: Real-time "user is typing..." status using Redis.

* **Logout**: Clear session.

* **Scalable Architecture**: Kafka for message queuing.

## Technologies Used

* **Backend**: Node.js, Express.js, Socket.IO, Mongoose, KafkaJS, Redis, jsonwebtoken, bcryptjs, body-parser.

* **Database**: MongoDB, Redis.

* **Message Broker**: Apache Kafka.

* **Frontend**: HTML5, CSS3, JavaScript, Socket.IO Client.

## Prerequisites

* Node.js (LTS)

* npm

* Docker Desktop

* Git

## Setup and Installation

1. **Clone Repository**:

```

git clone [https://github.com/advyy100i/chat-app.git](https://www.google.com/search?q=https://github.com/advyy100i/chat-app.git)
cd chat-app

```

2. **Install Node.js Dependencies**:

```

npm install

```

3. **Start Docker Services (Kafka, Zookeeper, Redis)**:

```

cd server
docker-compose up -d

```

4. **Start Node.js Server**:

```

cd ..
npm start

```

## Usage

1. **Access App**: Go to `http://localhost:3000/` (redirects to `auth.html`).

2. **Register**: Create a new account.

3. **Login**: Log in with your credentials (redirects to `index.html`).

4. **Chat**: Type messages, send images/GIFs, see typing indicators.

5. **Logout**: Click the "Logout" button.

## Project Structure

```

Chatapp/
├── client/
│   ├── auth.html
│   ├── index.html
│   ├── main.js
│   └── style.css
├── server/
│   ├── analytics/
│   │   └── analyzer.js
│   ├── auth/
│   │   ├── authController.js
│   │   ├── authMiddleware.js
│   │   └── authRoutes.js
│   ├── kafka/
│   │   ├── consumer.js
│   │   └── producer.js
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── docker-compose.yml
│   └── index.js
├── package.json
└── package-lock.json

```

## Future Enhancements

* Real-time User List

* Private Messaging

* Message History Loading

* Improved Error Handling & UI Feedback

* Cloud Storage for File Uploads

* Enhanced Security (HTTPS, Rate Limiting)

* Deployment Instructions

* Unit/Integration Tests
```
