import React, { createContext, useContext, useState, useEffect } from 'react';

import { io, Socket } from 'socket.io-client';

export interface Student {
  id: string;
  name: string;
  isActive: boolean;
}

export interface PollResponse {
  studentId: string;
  answer: string;
  timestamp: Date;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  status: 'active' | 'ended';
  responses: PollResponse[];
  createdAt: Date;
}

interface PollContextType {
  poll: Poll | null;
  students: Student[];
  currentStudent: Student | null;
  createPoll: (question: string, options: string[]) => void;
  endPoll: () => void;
  joinAsStudent: (name: string) => void;
  submitResponse: (answer: string) => void;
  removeStudent: (studentId: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(backendUrl, {
      transports: ['websocket'],
      withCredentials: true,
      forceNew: true,
      timeout: 10000,
    });
    setSocket(newSocket);

    newSocket.on('poll_created', (newPoll: Poll) => {
      setPoll(newPoll);
    });

    newSocket.on('poll_ended', (endedPoll: Poll) => {
      setPoll(endedPoll);
    });

    newSocket.on('response_received', (updatedPoll: Poll) => {
      setPoll(updatedPoll);
    });

    newSocket.on('students_updated', (updatedStudents: Student[]) => {
      console.log('Students updated:', updatedStudents);
      setStudents(updatedStudents);
    });

    newSocket.on('student_joined', (student: Student) => {
      console.log('Student joined:', student);
      setCurrentStudent(student);
      // Add to students list if not already there
      setStudents(prev => {
        const exists = prev.find(s => s.id === student.id);
        if (exists) return prev;
        return [...prev, student];
      });
    });

    newSocket.on('join_error', (error: { message: string }) => {
      console.error('Join error:', error);
      // Handle join error (e.g., name taken)
      alert(error.message);
    });

    newSocket.on('student_removed', () => {
      setCurrentStudent(null);
      localStorage.removeItem('studentName');
      window.location.href = '/';
    });

    return () => {
      newSocket.close();
    };
  }, [currentStudent]);

  const createPoll = (question: string, options: string[]) => {
    if (socket) {
      socket.emit('create_poll', { question, options });
    }
  };

  const endPoll = () => {
    if (socket) {
      socket.emit('end_poll');
    }
  };

  const joinAsStudent = (name: string) => {
    if (socket) {
      socket.emit('student_join', { name });
    }
  };

  const submitResponse = (answer: string) => {
    if (socket && currentStudent) {
      socket.emit('submit_response', { studentId: currentStudent.id, answer });
    }
  };

  const removeStudent = (studentId: string) => {
    if (socket) {
      socket.emit('remove_student', { studentId });
    }
  };

  return (
    <PollContext.Provider
      value={{
        poll,
        students,
        currentStudent,
        createPoll,
        endPoll,
        joinAsStudent,
        submitResponse,
        removeStudent
      }}
    >
      {children}
    </PollContext.Provider>
  );
};