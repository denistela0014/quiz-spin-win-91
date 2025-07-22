import React, { useState, useEffect } from 'react';
import { EnhancedCTA } from './EnhancedCTA';

export interface CTATestVariant {
  id: string;
  name: string;
  text: string;
  variant: 'default' | 'sticky' | 'floating' | 'pulse' | 'gradient';
  position?: 'relative' | 'fixed-bottom' | 'fixed-top' | 'sticky-bottom';
  size?: 'sm' | 'lg';
  icon?: string;
  showAfterSeconds?: number;
  className?: string;
}

export interface CTATestingProps {
  variants: CTATestVariant[];
  onClick: () => void;
  testName: string;
  disabled?: boolean;
  'aria-label'?: string;
}

// Framework de teste A/B para CTAs
export const CTATestingFramework: React.FC<CTATestingProps> = ({
  variants,
  onClick,
  testName,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<CTATestVariant | null>(null);
  const [testStartTime] = useState(Date.now());

  useEffect(() => {
    // Seleciona variante aleatória para teste A/B
    if (variants.length > 0) {
      const randomIndex = Math.floor(Math.random() * variants.length);
      const variant = variants[randomIndex];
      setSelectedVariant(variant);

      // Registra início do teste para analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cta_test_start', {
          test_name: testName,
          variant_id: variant.id,
          variant_name: variant.name,
          timestamp: testStartTime
        });
      }
    }
  }, [variants, testName, testStartTime]);

  const handleClick = () => {
    if (selectedVariant) {
      const clickTime = Date.now();
      const timeToClick = clickTime - testStartTime;

      // Registra clique para analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cta_test_click', {
          test_name: testName,
          variant_id: selectedVariant.id,
          variant_name: selectedVariant.name,
          time_to_click: timeToClick,
          timestamp: clickTime
        });
      }

      onClick();
    }
  };

  if (!selectedVariant || disabled) return null;

  return (
    <EnhancedCTA
      onClick={handleClick}
      text={selectedVariant.text}
      variant={selectedVariant.variant}
      position={selectedVariant.position}
      size={selectedVariant.size}
      icon={selectedVariant.icon}
      showAfterSeconds={selectedVariant.showAfterSeconds}
      className={selectedVariant.className}
      aria-label={ariaLabel || `${selectedVariant.name}: ${selectedVariant.text}`}
    />
  );
};

// Configurações pré-definidas para testes A/B comuns
export const CTATestConfigs = {
  positionTest: [
    {
      id: 'relative-main',
      name: 'Botão Principal Relativo',
      text: '🎯 Continuar',
      variant: 'gradient' as const,
      position: 'relative' as const,
      size: 'lg' as const,
      icon: '✨'
    },
    {
      id: 'fixed-bottom',
      name: 'Botão Fixo Inferior',
      text: '🎯 Continuar',
      variant: 'sticky' as const,
      position: 'fixed-bottom' as const,
      size: 'lg' as const,
      icon: '✨',
      showAfterSeconds: 10
    }
  ],

  textTest: [
    {
      id: 'action-direct',
      name: 'Ação Direta',
      text: 'Continuar',
      variant: 'default' as const,
      size: 'lg' as const,
      icon: '▶️'
    },
    {
      id: 'benefit-focused',
      name: 'Foco no Benefício',
      text: '🎯 Descobrir Meu Chá Ideal',
      variant: 'gradient' as const,
      size: 'lg' as const,
      icon: '✨'
    },
    {
      id: 'urgency-based',
      name: 'Baseado em Urgência',
      text: '⚡ Não Perder Esta Chance',
      variant: 'pulse' as const,
      size: 'lg' as const,
      icon: '🔥'
    }
  ],

  timingTest: [
    {
      id: 'immediate',
      name: 'Imediato',
      text: '🎯 Continuar Agora',
      variant: 'gradient' as const,
      size: 'lg' as const,
      icon: '✨',
      showAfterSeconds: 0
    },
    {
      id: 'delayed-10s',
      name: 'Após 10 segundos',
      text: '🎯 Pronto Para Continuar?',
      variant: 'floating' as const,
      size: 'lg' as const,
      icon: '⏰',
      showAfterSeconds: 10
    },
    {
      id: 'delayed-20s',
      name: 'Após 20 segundos',
      text: '🎯 Vamos Finalizar Isto!',
      variant: 'pulse' as const,
      size: 'lg' as const,
      icon: '🚀',
      showAfterSeconds: 20
    }
  ],

  styleTest: [
    {
      id: 'subtle',
      name: 'Sutil',
      text: 'Continuar',
      variant: 'default' as const,
      size: 'lg' as const,
      icon: '→'
    },
    {
      id: 'prominent',
      name: 'Proeminente',
      text: '🎯 CONTINUAR AGORA!',
      variant: 'pulse' as const,
      size: 'lg' as const,
      icon: '✨',
      className: 'animate-cta-glow'
    },
    {
      id: 'elegant',
      name: 'Elegante',
      text: '✨ Descobrir Resultado',
      variant: 'floating' as const,
      size: 'lg' as const,
      icon: '🌟'
    }
  ]
};

// Hook para gerenciar múltiplos testes simultaneamente
export const useCTATesting = (testName: string) => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const recordConversion = (variantId: string, conversionType: string) => {
    const result = {
      testName,
      variantId,
      conversionType,
      timestamp: Date.now()
    };

    setTestResults(prev => ({
      ...prev,
      [variantId]: [...(prev[variantId] || []), result]
    }));

    // Enviar para analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_conversion', result);
    }
  };

  const getTestData = () => {
    return {
      testName,
      results: testResults,
      totalConversions: Object.values(testResults).flat().length
    };
  };

  return {
    recordConversion,
    getTestData,
    testResults
  };
};