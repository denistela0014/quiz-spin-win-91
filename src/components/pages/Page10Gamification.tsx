import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FortuneWheel } from '@/components/FortuneWheel';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';
import { useGameSounds } from '@/hooks/useGameSounds';
import confetti from 'canvas-confetti';

export const Page10Gamification = () => {
  const { setCurrentPage, setDiscount, currentPage, totalSteps } = useQuiz();
  const [discountWon, setDiscountWon] = useState<number | null>(null);
  const [wheelCompleted, setWheelCompleted] = useState(false);
  const { playConfetti, playPrize, playButtonClick, preloadSounds } = useGameSounds();

  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  const handleWheelComplete = (discountValue: number) => {
    setDiscountWon(discountValue);
    setDiscount(discountValue);
    setWheelCompleted(true);
    
    // Som de prêmio ao ganhar desconto
    playPrize();
    
    // Som de confetes
    setTimeout(() => {
      playConfetti();
    }, 300);
    
    // Efeito de confetes ao ganhar o prêmio
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF66B2', '#d2ffbe', '#ffffff']
    });
    
    // Segundo disparo de confetes para maior impacto
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FF66B2', '#d2ffbe', '#ffffff']
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FF66B2', '#d2ffbe', '#ffffff']
      });
    }, 200);
  };

  const calculateFinalPrice = () => {
    const originalPrice = 67.90;
    if (discountWon) {
      return (originalPrice * (1 - discountWon / 100)).toFixed(2);
    }
    return originalPrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🎯 Parabéns! Você chegou até aqui!
            </h1>
            <p className="text-xl text-primary font-bold">
              GANHE SEU DESCONTO EXCLUSIVO NA RODA DA SORTE!
            </p>
          </div>

          {!wheelCompleted ? (
            <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-scale-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  🎰 Sua Chance de Desconto Especial!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Gire a roda e ganhe até <strong>35% de desconto</strong> no seu chá personalizado!
                </p>
              </div>

              <FortuneWheel onComplete={handleWheelComplete} />

              <div className="text-center mt-8">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="font-bold text-foreground mb-2">🏆 Prêmios Disponíveis:</h3>
                  <p className="text-muted-foreground">
                    10% • 15% • 20% • 25% • 30% • 35% de desconto
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Todos os participantes do quiz ganham desconto garantido!
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-bounce-in">
              <div className="text-center">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-4xl font-bold text-primary mb-4">
                  INCRÍVEL! Você ganhou {discountWon}% de desconto!
                </h2>
                
                <div className="bg-primary/20 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    💰 Seu Preço Final:
                  </h3>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-xl text-muted-foreground line-through">
                      De R$ 67,90
                    </span>
                    <span className="text-4xl font-bold text-primary">
                      Por R$ {calculateFinalPrice()}
                    </span>
                  </div>
                  <p className="text-lg text-accent font-semibold">
                    Você economizou R$ {(67.90 - parseFloat(calculateFinalPrice())).toFixed(2)}!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">⏰</div>
                    <h4 className="font-semibold">Oferta Limitada</h4>
                    <p className="text-sm text-muted-foreground">Válida apenas hoje</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">🚚</div>
                    <h4 className="font-semibold">Frete Grátis</h4>
                    <p className="text-sm text-muted-foreground">Para todo o Brasil</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-semibold">Garantia 30 dias</h4>
                    <p className="text-sm text-muted-foreground">Ou seu dinheiro de volta</p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    playButtonClick();
                    setCurrentPage(11);
                  }}
                  size="lg"
                  className="bg-gradient-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 py-6 text-xl shadow-glow animate-pulse-glow transition-bounce"
                >
                  🛒 GARANTIR MEU DESCONTO AGORA!
                </Button>

                <p className="text-sm text-muted-foreground mt-4">
                  ⚡ Últimas unidades disponíveis com este desconto!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};