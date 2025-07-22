import React, { useState, useEffect } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { EnhancedCTA } from '@/components/ui/EnhancedCTA';
import { Card } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ProgressBar } from '@/components/ProgressBar';
import { useQuiz } from '@/contexts/QuizContext';

export const Page8VSLAuthority = () => {
  const { setCurrentPage, currentPage, totalSteps } = useQuiz();
  const [showAuthorityCTA, setShowAuthorityCTA] = useState(false);

  useEffect(() => {
    // Mostra CTA de autoridade após 20 segundos
    const timer = setTimeout(() => setShowAuthorityCTA(true), 20000);
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
                👨‍⚕️ O que a ciência diz sobre chás
              </h1>
              <p className="text-xl text-muted-foreground">
                Especialista explica os benefícios comprovados
              </p>
            </div>

            <div className="mb-8 animate-scale-in">
              <VideoPlayer 
                title="Especialista em Fitoterapia"
                dropboxUrl="https://www.dropbox.com/scl/fi/typw5euo0pr9a7hgkim5r/07-7.mp4?rlkey=20p7ju5hbw6nqlygngwebi902&st=5zccsve3&dl=0"
                verticalFullscreen={true}
                showCTAAfterSeconds={10}
                onCTAClick={() => setCurrentPage(9)}
                ctaText="🎯 Ver minha recomendação personalizada"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary/10 p-6 rounded-lg text-center animate-slide-up">
                <div className="text-4xl mb-4">🧬</div>
                <h3 className="font-bold text-foreground mb-2">Estudos Científicos</h3>
                <p className="text-muted-foreground text-sm">
                  Mais de 500 pesquisas comprovam os benefícios dos chás para saúde
                </p>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl mb-4">⚕️</div>
                <h3 className="font-bold text-foreground mb-2">Aprovado por Médicos</h3>
                <p className="text-muted-foreground text-sm">
                  Recomendado por nutricionistas e especialistas em saúde
                </p>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="font-bold text-foreground mb-2">100% Natural</h3>
                <p className="text-muted-foreground text-sm">
                  Sem conservantes, corantes ou substâncias artificiais
                </p>
              </div>
            </div>

            <div className="bg-accent/20 p-6 rounded-lg mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Dr. Ricardo Silva</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fitoterapeuta • 15 anos de experiência
                  </p>
                  <p className="text-foreground italic">
                    "Os chás personalizados representam o futuro da medicina natural. 
                    Cada pessoa tem necessidades únicas, e nossa fórmula personalizada 
                    maximiza os benefícios para cada indivíduo."
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Principal aprimorado */}
            <div className="text-center mb-6">
              <EnhancedCTA
                onClick={() => setCurrentPage(9)}
                text="🎯 Ver Minha Recomendação Personalizada"
                variant="gradient"
                size="lg"
                icon="🏆"
                aria-label="Ver recomendação de chá personalizada baseada em ciência"
                className="animate-cta-glow"
              />
            </div>

            {/* CTA de autoridade científica */}
            {showAuthorityCTA && (
              <div className="bg-primary/5 p-6 rounded-lg text-center border border-primary/20">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl mr-2">🧬</span>
                  <p className="text-sm font-medium text-foreground">
                    Baseado em mais de 500 estudos científicos
                  </p>
                </div>
                <EnhancedCTA
                  onClick={() => setCurrentPage(9)}
                  text="Acessar Fórmula Científica"
                  variant="floating"
                  size="sm"
                  icon="⚗️"
                  aria-label="Acessar recomendação baseada em evidências científicas"
                />
              </div>
            )}

          </Card>
        </div>

        {/* CTA Sticky de conversão final */}
        <EnhancedCTA
          onClick={() => setCurrentPage(9)}
          text="Ver Recomendação"
          variant="sticky"
          position="fixed-bottom"
          showAfterSeconds={30}
          icon="🔬"
          aria-label="Botão fixo para ver recomendação personalizada"
        />
      </div>
    </div>
  );
};