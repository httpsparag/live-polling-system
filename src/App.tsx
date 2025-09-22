import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ArrowRight, Timer, BarChart3, CheckCircle } from 'lucide-react';
import HomePage from './components/HomePage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentInterface from './components/StudentInterface';
import { PollProvider } from './context/PollContext';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'teacher' | 'student'>('home');

  return (
    <PollProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {currentView === 'home' && <HomePage onSelectRole={setCurrentView} />}
        {currentView === 'teacher' && <TeacherDashboard onBack={() => setCurrentView('home')} />}
        {currentView === 'student' && <StudentInterface onBack={() => setCurrentView('home')} />}
      </div>
    </PollProvider>
  );
}

export default App;