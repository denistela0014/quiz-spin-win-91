import React, { useState } from 'react';
import { FuturisticSoundButton } from '@/components/ui/FuturisticSoundButton';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { ProgressiveDiscountBanner } from '@/components/ui/ProgressiveDiscountBanner';
import { SocialProofWidget } from '@/components/ui/SocialProofWidget';
import { useQuiz } from '@/contexts/QuizContext';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';

export const Page3Question1 = () => {
  const { setCurrentPage, addAnswer, addCorrectAnswer, currentPage, totalSteps, progress } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [responseStartTime] = useState<number>(Date.now());
  const { feedbackAnimation } = useAdvancedGameSounds();
  const { playAnswerFeedback, playPageTransition } = useAdvancedSpatialSounds();

  const handleAnswer = (answer: string) => {
    const responseTime = Date.now() - responseStartTime;
    setSelectedAnswer(answer);
    addAnswer('Qual é seu objetivo principal?', answer);
    addCorrectAnswer(); // Registrar como resposta correta
    
    // Som espacial baseado no tempo de resposta
    const isQuickResponse = responseTime < 3000;
    playAnswerFeedback(true, isQuickResponse, responseTime);
    
    // Auto-advance após um breve delay
    setTimeout(() => {
      playPageTransition();
      setCurrentPage(4);
    }, 1200);
  };

  const options = [
    { id: 'energia', text: '⚡ Mais energia e disposição', icon: '💪' },
    { id: 'relaxar', text: '🧘 Relaxar e reduzir stress', icon: '😌' },
    { id: 'emagrecimento', text: '🔥 Acelerar metabolismo', icon: '🏃‍♀️' },
    { id: 'saude', text: '🌿 Melhorar saúde geral', icon: '❤️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          {/* Banner de desconto progressivo */}
          <ProgressiveDiscountBanner progressPercentage={progress} />
          
          {/* Prova social */}
          <SocialProofWidget variant="compact" className="justify-center" />
          
          <Card className={`p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in ${feedbackAnimation}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                🎯 Qual é seu objetivo principal?
              </h1>
              <p className="text-xl text-muted-foreground">
                Vamos encontrar o chá perfeito para suas necessidades
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <FuturisticSoundButton
                  key={option.id}
                  variant="outline"
                  onClick={() => handleAnswer(option.text)}
                  disabled={selectedAnswer !== ''}
                  soundType={selectedAnswer === option.text ? 'correct-advanced' : 'button-futuristic'}
                  soundIntensity={1.2}
                  spatialPosition={{ x: (index % 2 === 0 ? -0.5 : 0.5), y: 0, z: 0 }}
                  className={`w-full p-4 sm:p-6 h-auto text-left border-2 transition-all duration-300 animate-slide-up hover:shadow-glow hover:border-primary/50 ${
                    selectedAnswer === option.text 
                      ? 'bg-primary/20 border-primary shadow-glow animate-cta-glow' 
                      : 'bg-card/50 hover:bg-primary/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{option.icon}</span>
                    <span className="text-base sm:text-lg font-medium text-foreground text-left">{option.text}</span>
                  </div>
                </FuturisticSoundButton>
              ))}
            </div>

            {selectedAnswer && (
              <div className="text-center mt-6 animate-bounce-in">
                <p className="text-primary font-semibold">
                  ✅ Perfeito! Analisando sua escolha...
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};