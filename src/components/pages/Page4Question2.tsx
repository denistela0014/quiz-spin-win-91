import React, { useState } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';

export const Page4Question2 = () => {
  const { setCurrentPage, addAnswer, currentPage, totalSteps } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [responseStartTime] = useState<number>(Date.now());
  const { playAnswerFeedback, playPageTransition } = useAdvancedSpatialSounds();

  const handleAnswer = (answer: string) => {
    const responseTime = Date.now() - responseStartTime;
    setSelectedAnswer(answer);
    addAnswer('Quando prefere tomar chá?', answer);
    
    // Som espacial baseado no tempo de resposta
    const isQuickResponse = responseTime < 3000;
    playAnswerFeedback(true, isQuickResponse, responseTime);
    
    setTimeout(() => {
      playPageTransition();
      setCurrentPage(5);
    }, 800);
  };

  const options = [
    { id: 'manha', text: '🌅 Manhã (para começar o dia)', icon: '☀️' },
    { id: 'tarde', text: '☕ Tarde (para manter energia)', icon: '🕐' },
    { id: 'noite', text: '🌙 Noite (para relaxar)', icon: '✨' },
    { id: 'qualquer', text: '🕰️ Qualquer horário', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ⏰ Quando prefere tomar seu chá?
              </h1>
              <p className="text-xl text-muted-foreground">
                O timing perfeito faz toda a diferença
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <SoundButton
                  key={option.id}
                  variant="outline"
                  onClick={() => handleAnswer(option.text)}
                  disabled={selectedAnswer !== ''}
                  className={`p-6 h-auto text-left border-2 transition-all duration-300 animate-slide-up hover:shadow-glow hover:border-primary/50 ${
                    selectedAnswer === option.text 
                      ? 'bg-primary/20 border-primary shadow-glow' 
                      : 'bg-card/50 hover:bg-primary/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{option.icon}</span>
                    <span className="text-lg font-medium text-foreground">{option.text}</span>
                  </div>
                </SoundButton>
              ))}
            </div>

            {selectedAnswer && (
              <div className="text-center mt-6 animate-bounce-in">
                <p className="text-primary font-semibold">
                  ✅ Ótima escolha! Personalizando sua experiência...
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};