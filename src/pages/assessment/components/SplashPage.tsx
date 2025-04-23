
import React from 'react';
import { PlayCircle } from 'lucide-react';

interface SplashPageProps {
  onStart: () => void;
  isEmbedded: boolean;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onStart, isEmbedded }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
      <h1 className="text-4xl font-bold mb-6">Personality Assessment</h1>
      <p className="text-lg text-center mb-8 max-w-md">
        Take this quick assessment to understand your personality traits and tendencies.
      </p>
      <button
        onClick={onStart}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <PlayCircle size={24} />
        Start Assessment
      </button>
    </div>
  );
};
