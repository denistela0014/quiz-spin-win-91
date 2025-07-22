import React, { useState, useEffect } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { EnhancedCTA } from '@/components/ui/EnhancedCTA';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';

export const Page9VSLFinal = () => {
  const { setCurrentPage, currentPage, totalSteps, answers, setRecommendation } = useQuiz();
  const [showUrgencyTimer, setShowUrgencyTimer] = useState(false);
  const [showExtraIncentive, setShowExtraIncentive] = useState(false);

  useEffect(() => {
    // Mostra timer de urgência após 10 segundos
    const urgencyTimer = setTimeout(() => setShowUrgencyTimer(true), 10000);
    // Mostra incentivo extra após 25 segundos
    const incentiveTimer = setTimeout(() => setShowExtraIncentive(true), 25000);
    
    return () => {
      clearTimeout(urgencyTimer);
      clearTimeout(incentiveTimer);
    };
  }, []);

  // Gera recomendação baseada nas respostas
  const generateRecommendation = () => {
    const hasEnergia = answers.some(a => a.answer.includes('energia') || a.answer.includes('energia'));
    const hasRelaxar = answers.some(a => a.answer.includes('Relaxar') || a.answer.includes('Noite'));
    const hasEmagrecimento = answers.some(a => a.answer.includes('metabolismo') || a.answer.includes('Forte'));
    
    if (hasEnergia) {
      setRecommendation('Chá Verde Premium com Gengibre');
    } else if (hasRelaxar) {
      setRecommendation('Chá de Camomila com Lavanda');
    } else if (hasEmagrecimento) {
      setRecommendation('Chá Detox Termogênico');
    } else {
      setRecommendation('Chá Misto Equilibrium');
    }
  };

  React.useEffect(() => {
    generateRecommendation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                🎉 Sua Recomendação Personalizada Está Pronta!
              </h1>
              <p className="text-xl text-muted-foreground">
                Baseado em suas respostas, selecionamos o chá perfeito para você
              </p>
            </div>

            <div className="bg-gradient-accent p-8 rounded-lg mb-8 text-center animate-scale-in">
              <div className="text-6xl mb-4">🍵</div>
              <h2 className="text-3xl font-bold text-accent-foreground mb-4">
                Chá Verde Premium com Gengibre
              </h2>
              <p className="text-lg text-accent-foreground/80 mb-6">
                Especialmente formulado para aumentar energia e acelerar o metabolismo
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold">Energia Natural</h4>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🔥</div>
                  <h4 className="font-semibold">Queima Gordura</h4>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">💪</div>
                  <h4 className="font-semibold">Antioxidantes</h4>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                ✨ Por que este chá é perfeito para você:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <span className="text-primary">✓</span>
                  <span>Aumenta energia sem causar ansiedade</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-primary">✓</span>
                  <span>Acelera metabolismo de forma natural</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-primary">✓</span>
                  <span>Rico em antioxidantes e vitaminas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-primary">✓</span>
                  <span>Sabor refrescante e energizante</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <p className="text-lg text-muted-foreground mb-2">
                  🎁 Agora vamos descobrir seu desconto exclusivo!
                </p>
                <p className="text-2xl font-bold text-primary">
                  GIRE A RODA DA SORTE E GANHE ATÉ 35% OFF!
                </p>
                
                {/* Timer de urgência */}
                {showUrgencyTimer && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mt-4 animate-fade-in">
                    <p className="text-sm font-medium text-destructive">
                      ⏰ Oferta especial válida apenas hoje!
                    </p>
                  </div>
                )}
              </div>
              
              {/* CTA Principal aprimorado */}
              <EnhancedCTA
                onClick={() => setCurrentPage(10)}
                text="🎰 GIRAR RODA DA SORTE AGORA!"
                variant="pulse"
                size="lg"
                icon="✨"
                aria-label="Girar roda da sorte para descobrir desconto exclusivo"
                className="mb-4 animate-cta-glow"
              />

              {/* Incentivo extra com prova social */}
              {showExtraIncentive && (
                <div className="bg-accent/20 p-4 rounded-lg mt-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-3">
                    🔥 Mais de 50 pessoas giraram a roda nos últimos 10 minutos!
                  </p>
                  <EnhancedCTA
                    onClick={() => setCurrentPage(10)}
                    text="Não Perder Minha Vez"
                    variant="floating"
                    size="sm"
                    icon="⚡"
                    aria-label="Garantir participação na roda da sorte"
                    className="animate-cta-shake"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* CTA Sticky para máxima conversão */}
        <EnhancedCTA
          onClick={() => setCurrentPage(10)}
          text="Girar Roda"
          variant="sticky"
          position="fixed-bottom"
          showAfterSeconds={15}
          icon="🎯"
          aria-label="Botão fixo para girar a roda da sorte"
        />
      </div>
    </div>
  );
};