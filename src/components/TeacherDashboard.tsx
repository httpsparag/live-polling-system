import React, { useState } from 'react';
import { ArrowLeft, Plus, Users, Timer, BarChart3 } from 'lucide-react';
import { usePoll } from '../context/PollContext';
import PollResults from './PollResults';
import type { Student, Poll } from '../context/PollContext';

interface TeacherDashboardProps {
  onBack: () => void;
}

// Component for the create poll form
const CreatePollForm: React.FC<{
  question: string;
  options: string[];
  onQuestionChange: (value: string) => void;
  onOptionsChange: (options: string[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ question, options, onQuestionChange, onOptionsChange, onSubmit, onCancel }) => (
  <div className="space-y-6">
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700">Question</label>
      <textarea
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Enter your poll question..."
        className="w-full h-24 p-4 border border-gray-300 resize-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700">Options</label>
      <div className="space-y-3">
        {options.map((option, index) => (
          <input
            key={index}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              onOptionsChange(newOptions);
            }}
            placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ))}
      </div>
    </div>

    <div className="flex space-x-4">
      <button
        onClick={onSubmit}
        disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
        className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Poll
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 border border-gray-300 rounded-xl hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  </div>
);

// Component for displaying active poll
const ActivePoll: React.FC<{
  poll: Poll;
  onEndPoll: () => void;
}> = ({ poll, onEndPoll }) => (
  <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Active Poll</h2>
      {poll.status === 'active' && (
        <button
          onClick={onEndPoll}
          className="px-4 py-2 font-semibold text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-600"
        >
          End Poll
        </button>
      )}
    </div>

    <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{poll.question}</h3>
      <div className="flex items-center text-sm text-gray-600">
        <Timer className="w-4 h-4 mr-1" />
        {poll.status === 'active' ? 'Poll is live' : 'Poll ended'}
        <span className="mx-2">•</span>
        <Users className="w-4 h-4 mr-1" />
        {poll.responses.length} responses
      </div>
    </div>
  </div>
);

// Component for displaying student list
const StudentList: React.FC<{
  students: Student[];
  poll: Poll | null;
  onRemoveStudent: (id: string) => void;
}> = ({ students, poll, onRemoveStudent }) => {
  const activeStudents = students.filter(s => s.isActive);
  
  return (
    <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center text-lg font-semibold text-gray-900">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Connected Students
        </h3>
        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
          {activeStudents.length} online
        </span>
      </div>
      
      <div className="space-y-3">
        {activeStudents.map(student => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 transition-all duration-300 rounded-lg bg-gray-50 animate-fade-in hover:bg-gray-100"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 mr-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900">{student.name}</span>
              {poll && poll.responses.find(r => r.studentId === student.id) && (
                <span className="px-2 py-1 ml-3 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Answered
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onRemoveStudent(student.id)}
                className="p-2 text-red-500 transition-colors duration-200 rounded-full hover:text-red-600 hover:bg-red-50"
              title="Remove student"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
      {students.filter(s => s.isActive).length === 0 && (
        <p className="py-4 text-center text-gray-500">No students connected</p>
      )}
    </div>
  </div>
  );
};

// Main TeacherDashboard component
const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const { poll, createPoll, endPoll, students, removeStudent } = usePoll();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePoll = () => {
    if (question.trim() && options.filter(opt => opt.trim()).length >= 2) {
      const validOptions = options.filter(opt => opt.trim());
      createPoll(question, validOptions);
      setQuestion('');
      setOptions(['', '', '', '']);
      setShowCreateForm(false);
    }
  };

  const activeStudents = students.filter(s => s.isActive).length;
  const canCreateNewPoll = !poll || poll.status === 'ended' || 
    (poll.responses.length > 0 && poll.responses.length === activeStudents);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center mr-6 text-gray-600 transition-colors duration-200 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <span className="font-semibold text-gray-900">{activeStudents}</span>
              <span className="ml-1 text-gray-600">Active Students</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {!poll || poll.status === 'ended' ? (
              <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">Ready to Create a Poll?</h2>
                  <p className="text-gray-600">Start engaging with your students through interactive polling</p>
                </div>

                {!showCreateForm ? (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Poll
                  </button>
                ) : (
                  <CreatePollForm
                    question={question}
                    options={options}
                    onQuestionChange={setQuestion}
                    onOptionsChange={setOptions}
                    onSubmit={handleCreatePoll}
                    onCancel={() => setShowCreateForm(false)}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <ActivePoll poll={poll} onEndPoll={endPoll} />
                {poll?.status === 'ended' && canCreateNewPoll && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center justify-center w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Poll
                  </button>
                )}
                <PollResults />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudentList
              students={students}
              poll={poll}
              onRemoveStudent={removeStudent}
            />

            {poll && poll.status === 'active' && (
              <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Live Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((poll.responses.length / Math.max(activeStudents, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${(poll.responses.length / Math.max(activeStudents, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;