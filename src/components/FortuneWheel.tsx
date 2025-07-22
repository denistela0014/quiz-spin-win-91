import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameSounds } from '@/hooks/useGameSounds';

interface FortuneWheelProps {
  onComplete: (discount: number) => void;
}

const PRIZES = [
  { discount: 10, color: '#e91e63', label: '10%' },
  { discount: 15, color: '#9c27b0', label: '15%' },
  { discount: 20, color: '#673ab7', label: '20%' },
  { discount: 25, color: '#3f51b5', label: '25%' },
  { discount: 30, color: '#2196f3', label: '30%' },
  { discount: 35, color: '#00bcd4', label: '35%' },
];

export const FortuneWheel = ({ onComplete }: FortuneWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const { playWheelSpin, preloadSounds } = useGameSounds();

  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  const spinWheel = () => {
    setIsSpinning(true);
    
    // Som da roleta girando
    playWheelSpin();

    // Seleciona um prêmio aleatório
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    
    // Calcula a rotação necessária
    const degreesPerPrize = 360 / PRIZES.length;
    const finalRotation = 1440 + (360 - (prizeIndex * degreesPerPrize + degreesPerPrize / 2));
    
    setRotation(finalRotation);

    // Completa após a animação
    setTimeout(() => {
      setIsSpinning(false);
      onComplete(prize.discount);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          🎰 Gire a roda da sorte!
        </h3>
        <p className="text-lg text-muted-foreground">
          Ganhe até 35% de desconto no seu chá
        </p>
      </div>

      <div className="relative">
        {/* Ponteiro */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
        </div>

        {/* Roda */}
        <div 
          className={`w-80 h-80 rounded-full border-8 border-primary shadow-glow transition-transform duration-[3000ms] ease-out relative`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${PRIZES.map((prize, index) => 
              `${prize.color} ${(index * 360) / PRIZES.length}deg ${((index + 1) * 360) / PRIZES.length}deg`
            ).join(', ')})` 
          }}
        >
          {PRIZES.map((prize, index) => (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 text-white font-bold text-lg"
              style={{
                transform: `rotate(${(index * 360) / PRIZES.length + 360 / PRIZES.length / 2}deg) translateY(-120px) rotate(-${(index * 360) / PRIZES.length + 360 / PRIZES.length / 2}deg)`,
                transformOrigin: 'center',
              }}
            >
              {prize.discount}%
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        size="lg"
        className="bg-gradient-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-xl shadow-glow disabled:opacity-50 transition-smooth"
      >
        {isSpinning ? '🎰 Girando...' : '🎯 GIRAR AGORA!'}
      </Button>
    </div>
  );
};