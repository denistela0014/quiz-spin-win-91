import React, { useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { GameFeedbackSystem } from '@/components/ui/GameFeedbackSystem';
import { AdvancedSpatialSoundControl } from '@/components/ui/AdvancedSpatialSoundControl';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';
import { Page1Intro } from '@/components/pages/Page1Intro';
import { Page2VSLIntro } from '@/components/pages/Page2VSLIntro';
import { Page3Question1 } from '@/components/pages/Page3Question1';
import { Page4Question2 } from '@/components/pages/Page4Question2';
import { Page5Question3 } from '@/components/pages/Page5Question3';
import { Page6VSLTestimonial } from '@/components/pages/Page6VSLTestimonial';
import { Page7Question4 } from '@/components/pages/Page7Question4';
import { Page8VSLAuthority } from '@/components/pages/Page8VSLAuthority';
import { Page9VSLFinal } from '@/components/pages/Page9VSLFinal';
import { Page10Gamification } from '@/components/pages/Page10Gamification';
import { Page11Checkout } from '@/components/pages/Page11Checkout';
import { PageFinalRecommendation } from '@/components/pages/PageFinalRecommendation';

export const TeaQuizApp = () => {
  const { currentPage, progress } = useQuiz();
  const { playPageTransition, playProgressSound } = useAdvancedGameSounds();
  const { playPageTransition: playPageTransitionSmooth, playMilestone } = useAdvancedSpatialSounds();

  // Sistema avançado de som espacial para transições e marcos
  useEffect(() => {
    if (currentPage > 1) {
      // Som futurista de transição
      playPageTransitionSmooth();
      
      // Sons espaciais para marcos importantes com tecnologia avançada
      if (currentPage === 6) { // Meio do quiz - Marco importante
        setTimeout(() => {
          playMilestone('achievement');
          playProgressSound('milestone');
        }, 300);
      } else if (currentPage === 11) { // Final do quiz - Vitória épica
        setTimeout(() => {
          playMilestone('completion');
          playProgressSound('completion');
        }, 300);
      } else if (currentPage % 3 === 0) { // Marcos menores a cada 3 páginas
        setTimeout(() => playMilestone('celebration'), 200);
      }
    }
  }, [currentPage, playPageTransitionSmooth, playMilestone, playProgressSound]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <Page1Intro />;
      case 2:
        return <Page2VSLIntro />;
      case 3:
        return <Page3Question1 />;
      case 4:
        return <Page4Question2 />;
      case 5:
        return <Page5Question3 />;
      case 6:
        return <Page6VSLTestimonial />;
      case 7:
        return <Page7Question4 />;
      case 8:
        return <Page8VSLAuthority />;
      case 9:
        return <Page9VSLFinal />;
      case 10:
        return <Page10Gamification />;
      case 11:
        return <Page11Checkout />;
      case 12:
        return <PageFinalRecommendation />;
      default:
        return <Page1Intro />;
    }
  };

  return (
    <GameFeedbackSystem enableConfetti={true} enableScreenEffects={true}>
      <div className="min-h-screen relative">
        {/* Controle de Som Compacto no topo */}
        <div className="fixed top-4 right-4 z-50">
          <AdvancedSpatialSoundControl />
        </div>

        {/* Conteúdo principal */}
        {renderCurrentPage()}
      </div>
    </GameFeedbackSystem>
  );
};