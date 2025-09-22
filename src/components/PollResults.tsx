import React from 'react';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import { usePoll } from '../context/PollContext';

const PollResults: React.FC = () => {
  const { poll, students } = usePoll();

  if (!poll || poll.responses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Yet</h2>
        <p className="text-gray-600">Waiting for responses to show results...</p>
      </div>
    );
  }

  const resultCounts = poll.options.reduce((acc, option) => {
    acc[option] = poll.responses.filter((r: { answer: string }) => r.answer === option).length;
    return acc;
  }, {} as Record<string, number>);

  const totalResponses = poll.responses.length;
  const maxCount = Math.max(...Object.values(resultCounts));

  const getBarColor = (count: number) => {
    if (count === maxCount && maxCount > 0) {
      return 'from-green-500 to-green-600';
    }
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
          Poll Results
        </h2>
        <div className="flex items-center text-gray-600">
          <Users className="w-5 h-5 mr-2" />
          <span className="font-semibold">{totalResponses}</span>
          <span className="ml-1">responses</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.question}</h3>
        <div className="flex items-center text-sm text-gray-600">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {poll.status === 'active' ? 'Live' : 'Ended'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {poll.options.map((option, index) => {
          const count = resultCounts[option];
          const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{option}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900">{count}</span>
                  <span className="text-sm text-gray-600">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
              
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBarColor(count)} transition-all duration-1000 ease-out rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              {count === maxCount && maxCount > 0 && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{totalResponses}</div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {totalResponses > 0 ? Math.round((totalResponses / students.filter(s => s.isActive).length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                const leadingOption = poll.options.find(opt => resultCounts[opt] === maxCount);
                return leadingOption
                  ? leadingOption.slice(0, 8) + (leadingOption.length > 8 ? '...' : '')
                  : 'N/A';
              })()}
            </div>
            <div className="text-sm text-gray-600">Top Choice</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{poll.options.length}</div>
            <div className="text-sm text-gray-600">Options</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollResults;