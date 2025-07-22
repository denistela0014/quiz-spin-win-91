import React from 'react';
import { QuizProvider } from '@/contexts/QuizContext';
import { TeaQuizApp } from '@/components/TeaQuizApp';

const Index = () => {
  return (
    <QuizProvider>
      <TeaQuizApp />
    </QuizProvider>
  );
};

export default Index;
