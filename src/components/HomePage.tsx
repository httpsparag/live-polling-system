import React, { useState } from 'react';

interface HomePageProps {
  onSelectRole: (role: 'teacher' | 'student') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex justify-end">
          <div className="px-4 py-2 bg-[#7158e2] text-white rounded-lg font-semibold">
            Intervue Poll
          </div>
        </div>

        {/* Title Section */}
        <div className="mt-12 mb-8 space-y-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to the Live Polling System
          </h1>
          <p className="text-lg text-gray-600">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid max-w-3xl gap-6 mx-auto md:grid-cols-2">
          <div
            onClick={() => setSelectedRole('student')}
            className={`relative p-8 bg-white rounded-2xl cursor-pointer transition-all duration-200 
              ${selectedRole === 'student' 
                ? 'border-2 border-[#7158e2]' 
                : 'border border-gray-200 hover:border-[#7158e2]'}`}
          >
            <h2 className="mb-3 text-2xl font-semibold">I'm a Student</h2>
            <p className="text-gray-600">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          <div
            onClick={() => setSelectedRole('teacher')}
            className={`relative p-8 bg-white rounded-2xl cursor-pointer transition-all duration-200
              ${selectedRole === 'teacher'
                ? 'border-2 border-[#7158e2]'
                : 'border border-gray-200 hover:border-[#7158e2]'}`}
          >
            <h2 className="mb-3 text-2xl font-semibold">I'm a Teacher</h2>
            <p className="text-gray-600">
              Submit answers and view live poll results in real-time!
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-12 py-4 bg-[#7158e2] text-white rounded-xl font-semibold text-lg
              transition-all duration-200 hover:bg-[#5b44b8]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;