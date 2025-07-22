import React, { useState, useEffect } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { EnhancedCTA } from '@/components/ui/EnhancedCTA';
import { Card } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';

export const Page6VSLTestimonial = () => {
  const { setCurrentPage, currentPage, totalSteps } = useQuiz();
  const [showUrgencyCTA, setShowUrgencyCTA] = useState(false);

  useEffect(() => {
    // Mostra CTA de urgência após 18 segundos
    const timer = setTimeout(() => setShowUrgencyCTA(true), 18000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentPage} totalSteps={totalSteps} />
          
          <Card className="p-8 bg-gradient-card backdrop-blur-sm shadow-elegant animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ⭐ Veja o que nossos clientes dizem
              </h1>
              <p className="text-xl text-muted-foreground">
                Transformações reais de pessoas como você
              </p>
            </div>

            <div className="mb-8 animate-scale-in">
              <VideoPlayer 
                title="Depoimentos de Clientes"
                videoUrl="https://res.cloudinary.com/dasax0uuq/video/upload/f_auto,q_auto/VIDEO_DEPOIMENTO_CURTO__1_reswia.mp4"
                verticalFullscreen={true}
                showCTAAfterSeconds={10}
                onCTAClick={() => setCurrentPage(7)}
                ctaText="🎯 Continuar para última pergunta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-primary/10 p-6 rounded-lg animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "Perdi 8kg em 3 meses tomando o chá personalizado! Além disso, durmo muito melhor."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-foreground">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "Minha energia triplicou! Não consigo mais viver sem meu chá matinal personalizado."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-foreground">João Santos</p>
                    <p className="text-sm text-muted-foreground">Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Principal aprimorado */}
            <div className="text-center mb-6">
              <EnhancedCTA
                onClick={() => setCurrentPage(7)}
                text="🎯 Continuar Para Última Pergunta"
                variant="gradient"
                size="lg"
                icon="➡️"
                aria-label="Continuar para a última pergunta do quiz"
                className="animate-cta-glow"
              />
            </div>

            {/* CTA de urgência baseado em social proof */}
            {showUrgencyCTA && (
              <div className="bg-accent/20 p-4 rounded-lg text-center border-2 border-primary/30">
                <p className="text-sm font-medium text-foreground mb-3">
                  ⚡ Mais de 1.000 pessoas descobriram seu chá ideal hoje!
                </p>
                <EnhancedCTA
                  onClick={() => setCurrentPage(8)}
                  text="Não Ficar Para Trás"
                  variant="pulse"
                  size="sm"
                  icon="🔥"
                  aria-label="Acelerar processo e ver mais informações"
                  className="animate-cta-shake"
                />
              </div>
            )}

          </Card>
        </div>

        {/* CTA Sticky de conversão */}
        <EnhancedCTA
          onClick={() => setCurrentPage(7)}
          text="Próxima Pergunta"
          variant="sticky"
          position="fixed-bottom"
          showAfterSeconds={25}
          icon="⭐"
          aria-label="Botão fixo para continuar o quiz"
        />
      </div>
    </div>
  );
};