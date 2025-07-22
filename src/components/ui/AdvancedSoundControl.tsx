import React, { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Slider } from './slider';
import { Switch } from './switch';
import { Badge } from './badge';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { Volume2, VolumeX, Headphones, Zap, Star, Clock, Target } from 'lucide-react';

interface AdvancedSoundControlProps {
  className?: string;
  compact?: boolean;
}

export const AdvancedSoundControl: React.FC<AdvancedSoundControlProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const { 
    soundEnabled, 
    volumeLevel, 
    streakCount,
    isInitialized,
    setVolume, 
    toggleSound, 
    playGameSound,
    playAnswerFeedback,
    playProgressSound
  } = useAdvancedGameSounds();

  const [showAdvanced, setShowAdvanced] = useState(false);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={toggleSound}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        
        {soundEnabled && (
          <div className="flex items-center gap-2 min-w-[100px]">
            <Slider
              value={[volumeLevel]}
              onValueChange={([value]) => setVolume(value)}
              max={1}
              min={0}
              step={0.01}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">
              {Math.round(volumeLevel * 100)}%
            </span>
          </div>
        )}

        {streakCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            {streakCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-4 bg-gradient-card ${className}`}>
      <div className="space-y-4">
        {/* Header com Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Sistema de Som Avançado</h3>
            {!isInitialized && (
              <Badge variant="outline" className="text-xs">
                Carregando...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {streakCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Sequência: {streakCount}
              </Badge>
            )}
            
            <Switch
              checked={soundEnabled}
              onCheckedChange={toggleSound}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Controle de Volume */}
        {soundEnabled && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Volume Principal
                </label>
                <span className="text-sm font-medium text-foreground">
                  {Math.round(volumeLevel * 100)}%
                </span>
              </div>
              
              <Slider
                value={[volumeLevel]}
                onValueChange={([value]) => setVolume(value)}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Testes de Som Rápidos */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => playAnswerFeedback(true)}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 hover:bg-success/10 hover:border-success"
              >
                <Target className="h-3 w-3" />
                Teste Acerto
              </Button>
              
              <Button
                onClick={() => playAnswerFeedback(false)}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 hover:bg-destructive/10 hover:border-destructive"
              >
                <Zap className="h-3 w-3" />
                Teste Erro
              </Button>
              
              <Button
                onClick={() => playProgressSound('normal')}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 hover:bg-primary/10 hover:border-primary"
              >
                <Star className="h-3 w-3" />
                Progresso
              </Button>
              
              <Button
                onClick={() => playGameSound('time-alert', 1.0)}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 hover:bg-warning/10 hover:border-warning"
              >
                <Clock className="h-3 w-3" />
                Alerta
              </Button>
            </div>

            {/* Controles Avançados */}
            <div className="border-t pt-3">
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                {showAdvanced ? 'Ocultar' : 'Mostrar'} Controles Avançados
              </Button>
              
              {showAdvanced && (
                <div className="mt-3 space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => playGameSound('perfect-streak', 1.5)}
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/20"
                    >
                      🌟 Sequência Perfeita
                    </Button>
                    
                    <Button
                      onClick={() => playGameSound('achievement', 1.3)}
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/20"
                    >
                      🏆 Conquista
                    </Button>
                    
                    <Button
                      onClick={() => playProgressSound('milestone')}
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/20"
                    >
                      🎯 Marco Importante
                    </Button>
                    
                    <Button
                      onClick={() => playProgressSound('completion')}
                      variant="outline"
                      size="sm"
                      className="text-xs hover:bg-primary/20"
                    >
                      ✨ Finalização
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Sons com áudio espacial 3D habilitado</p>
                    <p>• Feedback adaptativo baseado no progresso</p>
                    <p>• Sistema de sequências e conquistas</p>
                    <p>• Otimização para alta performance</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações do Sistema */}
        {!soundEnabled && (
          <div className="text-center py-4 text-muted-foreground">
            <VolumeX className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sons desabilitados</p>
            <p className="text-xs">Ative para uma experiência mais imersiva</p>
          </div>
        )}
      </div>
    </Card>
  );
};