import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, Send, CheckCircle, BarChart3 } from 'lucide-react';
import { usePoll } from '../context/PollContext';
import PollResults from './PollResults';

interface StudentInterfaceProps {
  onBack: () => void;
}

const StudentInterface: React.FC<StudentInterfaceProps> = ({ onBack }) => {
  const handleBack = () => {
    localStorage.removeItem('studentName');
    onBack();
  };
  const { poll, joinAsStudent, submitResponse, currentStudent } = usePoll();
  const [studentName, setStudentName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [nameError, setNameError] = useState('');

  // Clear student data when component mounts
  useEffect(() => {
    localStorage.removeItem('studentName');
    setStudentName('');
    setIsJoined(false);
    setSelectedOption('');
    setHasSubmitted(false);
  }, []);

  useEffect(() => {
    if (poll && poll.status === 'active' && isJoined && !hasSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto-submit or show results when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [poll, isJoined, hasSubmitted]);

  useEffect(() => {
    if (timeLeft === 0 && selectedOption && !hasSubmitted) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleJoin = () => {
    const name = studentName.trim();
    if (name) {
      joinAsStudent(name);
      setIsJoined(true);
      // Save name in localStorage to identify this tab
      localStorage.setItem('studentName', name);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && poll && currentStudent) {
      submitResponse(selectedOption);
      setHasSubmitted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <button
            onClick={handleBack}
            className="flex items-center mb-6 text-gray-600 transition-colors duration-200 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Join as Student</h2>
              <p className="text-gray-600">Enter your name to participate in live polls</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setNameError('');
                  }}
                  placeholder="Enter your name"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!studentName.trim()}
                className="w-full px-6 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center mr-6 text-gray-600 transition-colors duration-200 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Student Interface</h1>
          </div>
          
          <div className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-900">{studentName}</span>
          </div>
        </div>

        {!poll || poll.status === 'ended' ? (
          <div className="p-12 text-center bg-white border border-gray-100 shadow-lg rounded-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-500">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Waiting for Poll</h2>
            <p className="text-lg text-gray-600">
              {poll && poll.status === 'ended' 
                ? 'The current poll has ended. Waiting for the teacher to start a new poll.'
                : 'Your teacher hasn\'t started a poll yet. Please wait...'}
            </p>
          </div>
        ) : poll.status === 'active' && !hasSubmitted ? (
          <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Poll</h2>
              <div className="flex items-center px-4 py-2 font-semibold text-orange-800 bg-orange-100 rounded-lg">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{poll.question}</h3>
              <p className="text-gray-600">Choose your answer below</p>
            </div>

            <div className="mb-8 space-y-4">
              {poll.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                    selectedOption === option
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedOption === option ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {selectedOption === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-8 text-center bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Answer Submitted!</h2>
              <p className="text-lg text-gray-600">Thank you for participating. View the results below.</p>
            </div>

            <PollResults />
          </div>
        )}

        {poll && poll.status === 'ended' && (
          <div className="mt-8">
            <PollResults />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInterface;