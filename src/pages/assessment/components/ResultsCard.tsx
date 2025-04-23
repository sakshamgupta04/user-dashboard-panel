
import React from 'react';
import { questions } from '../data/questions';

interface ResultsCardProps {
  scores: number[];
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ scores }) => {
  const calculatePersonalityType = (scores: number[]) => {
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
    const maxPossibleScore = questions.length * 5;
    const percentage = (totalScore / maxPossibleScore) * 100;

    if (percentage >= 70) {
      return "Highly Extroverted";
    } else if (percentage >= 50) {
      return "Moderately Extroverted";
    } else if (percentage >= 30) {
      return "Moderately Introverted";
    } else {
      return "Highly Introverted";
    }
  };

  const personalityType = calculatePersonalityType(scores);

  return (
    <div className="mt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Results</h2>
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{personalityType}</div>
        </div>
        <p className="text-center text-lg mb-8">
          Based on your responses, you tend to be more {personalityType.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};
