import React, { useState, useEffect } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { EnhancedCTA } from '@/components/ui/EnhancedCTA';
import { Card } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';

export const Page2VSLIntro = () => {
  const { setCurrentPage, currentPage, totalSteps } = useQuiz();
  const [showSecondaryCTA, setShowSecondaryCTA] = useState(false);

  useEffect(() => {
    // Mostra CTA secundário após 15 segundos para aumentar conversão
    const timer = setTimeout(() => setShowSecondaryCTA(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                🌱 Os Benefícios Incríveis dos Chás Naturais
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Descubra como o chá certo pode transformar sua saúde
              </p>
            </div>

            <div className="mb-8 animate-scale-in">
              <VideoPlayer 
                title="Benefícios dos Chás Naturais"
                dropboxUrl="https://www.dropbox.com/scl/fi/lyunqier0w3lysgq1f989/07-6.mp4?rlkey=tajmwep4vaars5qkqjfpg7dek&st=bxydy3qp&dl=0"
                verticalFullscreen={true}
                showCTAAfterSeconds={10}
                onCTAClick={() => setCurrentPage(3)}
                ctaText="✨ Vamos descobrir seu chá ideal!"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-lg text-center animate-slide-up">
                <div className="text-2xl sm:text-3xl mb-2">💪</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Energia Natural</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Sem açúcar ou cafeína em excesso</p>
              </div>
              <div className="bg-primary/10 p-3 sm:p-4 rounded-lg text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl sm:text-3xl mb-2">🧘</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Relaxamento</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Reduz stress e ansiedade</p>
              </div>
              <div className="bg-primary/10 p-3 sm:p-4 rounded-lg text-center animate-slide-up sm:col-span-2 md:col-span-1" style={{animationDelay: '0.4s'}}>
                <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Metabolismo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Acelera queima de gordura</p>
              </div>
            </div>

            {/* CTA Principal aprimorado */}
            <div className="text-center mb-6">
              <EnhancedCTA
                onClick={() => setCurrentPage(3)}
                text="🎯 Descobrir Meu Chá Ideal"
                variant="gradient"
                size="lg"
                icon="✨"
                aria-label="Iniciar quiz para descobrir o chá ideal"
                className="animate-cta-glow"
              />
            </div>

            {/* CTA secundário com timer */}
            {showSecondaryCTA && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  💡 Pule direto para o resultado personalizado
                </p>
                <EnhancedCTA
                  onClick={() => setCurrentPage(6)}
                  text="Ver Depoimentos Primeiro"
                  variant="floating"
                  size="sm"
                  icon="👥"
                  aria-label="Ver depoimentos de clientes antes do quiz"
                  className="opacity-80 hover:opacity-100"
                />
              </div>
            )}

          </Card>
        </div>

        {/* CTA Sticky para maximizar conversão */}
        <EnhancedCTA
          onClick={() => setCurrentPage(3)}
          text="Começar Quiz"
          variant="sticky"
          position="fixed-bottom"
          showAfterSeconds={20}
          icon="🚀"
          aria-label="Botão fixo para iniciar o quiz de personalização"
        />
      </div>
    </div>
  );
};