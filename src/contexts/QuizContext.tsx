import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizAnswer {
  question: string;
  answer: string;
}

interface QuizContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  answers: QuizAnswer[];
  addAnswer: (question: string, answer: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  recommendation: string;
  setRecommendation: (recommendation: string) => void;
  progress: number;
  totalSteps: number;
  correctAnswers: number;
  totalAnswers: number;
  streakCount: number;
  addCorrectAnswer: () => void;
  addIncorrectAnswer: () => void;
  resetAnswerStats: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [discount, setDiscount] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  
  const totalSteps = 11;
  const progress = (currentPage / totalSteps) * 100;

  const addAnswer = (question: string, answer: string) => {
    setAnswers(prev => [...prev, { question, answer }]);
  };

  const addCorrectAnswer = () => {
    setCorrectAnswers(prev => prev + 1);
    setTotalAnswers(prev => prev + 1);
    setStreakCount(prev => prev + 1);
  };

  const addIncorrectAnswer = () => {
    setTotalAnswers(prev => prev + 1);
    setStreakCount(0);
  };

  const resetAnswerStats = () => {
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setStreakCount(0);
  };

  const resetQuiz = () => {
    setCurrentPage(1);
    setAnswers([]);
    setDiscount(0);
    setRecommendation('');
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setStreakCount(0);
  };

  return (
    <QuizContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        answers,
        addAnswer,
        discount,
        setDiscount,
        recommendation,
        setRecommendation,
        progress,
        totalSteps,
        correctAnswers,
        totalAnswers,
        streakCount,
        addCorrectAnswer,
        addIncorrectAnswer,
        resetAnswerStats,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};