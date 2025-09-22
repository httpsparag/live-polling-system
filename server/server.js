import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active polls and students in memory
let activePoll = null;
const activeStudents = new Map(); // Maps socket ID to student info

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Teacher creates a new poll
  socket.on('create_poll', ({ question, options }) => {
    if (!activePoll || activePoll.status === 'ended') {
      activePoll = {
        id: Date.now().toString(),
        question,
        options,
        status: 'active',
        responses: [],
        createdAt: new Date(),
        timeLimit: 60 // 60 seconds default
      };
      io.emit('poll_created', activePoll);
      
      // Auto-end poll after timeLimit
      setTimeout(() => {
        if (activePoll && activePoll.status === 'active') {
          activePoll.status = 'ended';
          io.emit('poll_ended', activePoll);
        }
      }, activePoll.timeLimit * 1000);
    }
  });

  // Student joins
  socket.on('student_join', ({ name }) => {
    const studentId = socket.id;
    const trimmedName = name.trim();
    
    // Check if this name already exists
    let existingId = null;
    for (const [key, student] of activeStudents.entries()) {
      if (student.name.toLowerCase() === trimmedName.toLowerCase() && student.isActive) {
        existingId = key;
        break;
      }
    }

    // If name exists, update that entry's socket ID
    if (existingId) {
      const existingStudent = activeStudents.get(existingId);
      activeStudents.delete(existingId);
      
      const updatedStudent = {
        ...existingStudent,
        id: studentId
      };
      
      activeStudents.set(studentId, updatedStudent);
      socket.emit('student_joined', updatedStudent);
    } else {
      // Create new student
      const student = {
        id: studentId,
        name: trimmedName,
        isActive: true,
        joinedAt: new Date()
      };
      activeStudents.set(studentId, student);
      socket.emit('student_joined', student);
    }
    
    // Update all clients with new student list - remove duplicates by name
    const uniqueStudents = Array.from(activeStudents.values())
      .filter(s => s.isActive)
      .reduce((acc, current) => {
        const x = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase());
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [])
      .sort((a, b) => b.joinedAt - a.joinedAt);
    
    io.emit('students_updated', uniqueStudents);
    
    // Log connection for debugging
    console.log(`Student joined/reconnected: ${trimmedName} (${studentId})`);
    console.log('Active students:', uniqueStudents.map(s => s.name));
  });

  // Student submits response
  socket.on('submit_response', ({ studentId, answer }) => {
    if (activePoll && activePoll.status === 'active') {
      const response = {
        studentId,
        answer,
        timestamp: new Date()
      };
      activePoll.responses.push(response);
      io.emit('response_received', activePoll);

      // Check if all students have responded
      if (activePoll.responses.length === activeStudents.size) {
        activePoll.status = 'ended';
        io.emit('poll_ended', activePoll);
      }
    }
  });

  // Teacher ends poll
  socket.on('end_poll', () => {
    if (activePoll && activePoll.status === 'active') {
      activePoll.status = 'ended';
      io.emit('poll_ended', activePoll);
    }
  });

  // Teacher removes student
  socket.on('remove_student', ({ studentId }) => {
    if (activeStudents.has(studentId)) {
      activeStudents.delete(studentId);
      io.emit('students_updated', Array.from(activeStudents.values()));
      io.to(studentId).emit('student_removed');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (activeStudents.has(socket.id)) {
      const student = activeStudents.get(socket.id);
      student.isActive = false;  // Mark as inactive instead of removing
      activeStudents.set(socket.id, student);
      io.emit('students_updated', Array.from(activeStudents.values()));
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});