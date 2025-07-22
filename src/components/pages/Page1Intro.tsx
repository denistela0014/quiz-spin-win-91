import React from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { Card } from '@/components/ui/card';
import { useQuiz } from '@/contexts/QuizContext';
import teaHeroImage from '@/assets/tea-hero.jpg';

export const Page1Intro = () => {
  const { setCurrentPage } = useQuiz();

  return (
    <div className="min-h-screen bg-gradient-background quiz-page relative">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${teaHeroImage})` }}
      />
      <div className="max-w-4xl mx-auto relative z-10 px-2 sm:px-4">
        <Card className="p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="animate-scale-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                🌿 Descubra Seu Chá Perfeito
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold mb-4 sm:mb-6">
                Quiz Personalizado + Desconto Exclusivo!
              </p>
            </div>

            <div className="bg-primary/10 p-4 sm:p-6 rounded-lg animate-slide-up">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                ✨ O que você vai descobrir:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">🎯</span>
                  <span className="text-sm sm:text-base md:text-lg">Chá ideal para seu perfil</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">💰</span>
                  <span className="text-sm sm:text-base md:text-lg">Desconto de até 35%</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">🎁</span>
                  <span className="text-sm sm:text-base md:text-lg">Roda da sorte exclusiva</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">⚡</span>
                  <span className="text-sm sm:text-base md:text-lg">Resultado instantâneo</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <p className="text-lg font-semibold text-accent-foreground">
                ⏰ Oferta limitada: Apenas hoje!
              </p>
            </div>

            <SoundButton
              onClick={() => setCurrentPage(2)}
              size="lg"
              className="w-full sm:w-auto bg-action-button hover:bg-action-button/90 text-action-button-foreground font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-6 text-lg sm:text-xl shadow-glow animate-pulse-glow transition-bounce min-h-[50px]"
            >
              🚀 COMEÇAR QUIZ AGORA!
            </SoundButton>

            <p className="text-xs sm:text-sm text-muted-foreground">
              ⌚ Leva apenas 2 minutos • 🔒 100% gratuito
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};