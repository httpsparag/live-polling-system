# Live Polling System

A real-time polling application built with React, Node.js, and Socket.IO that allows teachers to create instant polls and students to respond in real-time.

## Features

- Real-time updates using Socket.IO
- Teacher dashboard for creating and managing polls
- Student interface for submitting responses
- Live results visualization
- Multiple choice questions support
- Automatic poll ending

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - Socket.IO client for real-time communication

- Backend:
  - Node.js
  - Express
  - Socket.IO for real-time updates

## Getting Started

### Prerequisites

- Node.js 14+ installed
- NPM or Yarn package manager

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Create environment files:

Frontend (.env.local):
```
VITE_BACKEND_URL=http://localhost:3000
```

Backend (server/.env):
```
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

## Deployment

The application is set up for deployment on:
- Frontend: Vercel
- Backend: Railway.app

For deployment instructions, check the deployment documentation.

## Environment Variables

### Frontend
- `VITE_BACKEND_URL`: URL of the backend server

### Backend
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: URL of the frontend application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.