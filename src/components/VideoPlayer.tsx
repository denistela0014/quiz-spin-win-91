import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  placeholder?: boolean;
  dropboxUrl?: string; // Para links do Dropbox
  verticalFullscreen?: boolean; // Para VSLs em formato vertical fullscreen
  showCTAAfterSeconds?: number; // Tempo em segundos para mostrar CTA
  onCTAClick?: () => void; // Função chamada quando CTA é clicado
  ctaText?: string; // Texto do botão CTA
}

// Estados consolidados para controle do vídeo
interface VideoState {
  isMuted: boolean;
  isPlaying: boolean;
  hasStarted: boolean;
  showCTA: boolean;
  status: 'loading' | 'ready' | 'error';
}

export const VideoPlayer = ({ 
  videoUrl, 
  title = "Video", 
  autoplay = false, 
  controls = true,
  className = "",
  placeholder = false,
  dropboxUrl,
  verticalFullscreen = false,
  showCTAAfterSeconds = 10,
  onCTAClick,
  ctaText = "Continuar"
}: VideoPlayerProps) => {
  // Estado consolidado para controle do vídeo
  const [videoState, setVideoState] = useState<VideoState>({
    isMuted: true,
    isPlaying: false,
    hasStarted: false,
    showCTA: false,
    status: 'loading'
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Otimização: Conversão da URL do Dropbox usando useMemo para evitar recálculos desnecessários
  const rawDropboxUrl = useMemo(() => {
    if (!dropboxUrl) return null;
    
    // Validação da URL do Dropbox
    if (!dropboxUrl.includes('dropbox.com')) {
      console.error('URL do Dropbox inválida:', dropboxUrl);
      return null;
    }
    
    // Conversão da URL do Dropbox para formato "raw" para reprodução direta
    let rawUrl = dropboxUrl;
    if (dropboxUrl.includes('?dl=0')) {
      rawUrl = dropboxUrl.replace(/\?dl=0.*/, '?raw=1');
    } else if (dropboxUrl.includes('&dl=0')) {
      rawUrl = dropboxUrl.replace(/&dl=0.*/, '&raw=1');
    } else {
      // Se não tem dl=0, apenas adiciona raw=1
      rawUrl = dropboxUrl + (dropboxUrl.includes('?') ? '&raw=1' : '?raw=1');
    }
    
    console.log('Original Dropbox URL:', dropboxUrl);
    console.log('Converted Raw URL:', rawUrl);
    return rawUrl;
  }, [dropboxUrl]);

  // Limpa timeout quando componente desmonta
  useEffect(() => {
    return () => {
      if (ctaTimeoutRef.current) {
        clearTimeout(ctaTimeoutRef.current);
      }
    };
  }, []);

  // Função para ativar som e reproduzir vídeo com estado consolidado
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setVideoState(prev => ({
        ...prev,
        isMuted: false,
        isPlaying: true,
        hasStarted: true,
        status: 'ready'
      }));
      
      // Inicia o timer para mostrar o CTA após o tempo especificado
      if (showCTAAfterSeconds && onCTAClick) {
        ctaTimeoutRef.current = setTimeout(() => {
          setVideoState(prev => ({ ...prev, showCTA: true }));
        }, showCTAAfterSeconds * 1000);
      }
    }
  };

  // Função para tentar recarregar o vídeo em caso de erro com animação
  const handleRetry = () => {
    if (videoRef.current) {
      setVideoState(prev => ({ ...prev, status: 'loading' }));
      // Animação suave de recarregamento
      videoRef.current.classList.add('animate-pulse');
      videoRef.current.load();
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.classList.remove('animate-pulse');
        }
      }, 1000);
    }
  };

  // Função para CTA com tracking de performance
  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick();
      // Tracking de performance para analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'video_cta_click', {
          event_category: 'Video',
          event_label: ctaText,
          value: 1
        });
      }
    }
  };

  // Configuração para VSL vertical responsivo com melhorias de acessibilidade e responsividade
  if (verticalFullscreen && (rawDropboxUrl || videoUrl)) {
    const videoSrc = rawDropboxUrl || videoUrl;
    return (
      <div className="relative w-full max-w-sm mx-auto">
        {/* Container responsivo com aspect ratio 9:16 (1080x1920) */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-elegant" style={{ aspectRatio: '9/16', maxHeight: '80vh', minHeight: '300px' }}>
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay={false}
            muted={videoState.isMuted}
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-contain"
            onLoadStart={() => {
              console.log('Video loading started for:', videoSrc);
              setVideoState(prev => ({ ...prev, status: 'loading', isPlaying: false }));
            }}
            onCanPlay={() => {
              console.log('Video can play');
              setVideoState(prev => ({ ...prev, status: 'ready', isPlaying: true }));
            }}
            onError={(e) => {
              console.error('Video error:', e);
              console.error('Failed URL:', videoSrc);
              setVideoState(prev => ({ ...prev, status: 'error' }));
            }}
            onLoadedData={() => console.log('Video data loaded')}
            aria-label={`Vídeo: ${title}`}
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
          
          {/* Ícone de mute quando vídeo está mudo */}
          {videoState.isMuted && videoState.status === 'ready' && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-black/70 text-white p-2 rounded-full text-lg" aria-label="Vídeo está mudo">
                🔇
              </div>
            </div>
          )}

          {/* Botão de ativar som com melhorias de acessibilidade */}
          {videoState.isMuted && !videoState.hasStarted && videoState.status === 'ready' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <SoundButton
                onClick={handlePlayWithSound}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-glow animate-pulse z-10 text-sm sm:text-base"
                aria-label="Ativar som e reproduzir vídeo"
              >
                🔊 Ativar Som e Play
              </SoundButton>
            </div>
          )}
          
          {/* Tratamento de erro melhorado */}
          {videoState.status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
              <div className="text-white text-center p-4 max-w-xs">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="font-bold mb-2 text-sm sm:text-base">Erro ao carregar vídeo</p>
                <p className="text-xs sm:text-sm mb-4">Verifique a URL ou a conexão e tente novamente.</p>
                <SoundButton 
                  onClick={handleRetry} 
                  className="bg-white text-red-500 hover:bg-gray-100 px-3 py-1 text-sm rounded"
                  aria-label="Tentar carregar vídeo novamente"
                >
                  Tentar novamente
                </SoundButton>
              </div>
            </div>
          )}
          
          {/* Indicador de carregamento */}
          {videoState.status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p className="text-sm">Carregando vídeo...</p>
              </div>
            </div>
          )}
          
          {/* Botão CTA com melhorias de acessibilidade e tracking */}
          {videoState.showCTA && onCTAClick && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
              <SoundButton
                onClick={handleCTAClick}
                size="lg"
                className="bg-gradient-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg shadow-glow transition-smooth"
                aria-label={`Continuar para próxima seção: ${ctaText}`}
              >
                {ctaText} ▶️
              </SoundButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Validação e renderização para iframe do Dropbox
  if (dropboxUrl) {
    // Validação da URL do Dropbox
    const isDropboxUrlValid = dropboxUrl.includes('dropbox.com');
    if (!isDropboxUrlValid) {
      return (
        <div className="relative w-full aspect-video bg-red-100 rounded-lg overflow-hidden shadow-elegant border-2 border-red-300 flex items-center justify-center">
          <div className="text-red-600 text-center p-4">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="font-bold">Erro: URL do Dropbox inválida</p>
            <p className="text-sm mt-2">Verifique se a URL contém 'dropbox.com'</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative w-full bg-gradient-card rounded-lg overflow-hidden shadow-elegant border-2 md:border-4 border-primary ${className}`}>
        {/* Container responsivo para iframe */}
        <div className="relative w-full aspect-video">
          <iframe
            src={dropboxUrl}
            title={title}
            width="100%"
            height="100%"
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            style={{
              maxHeight: '80vh',
              minHeight: '200px'
            }}
            aria-label={`Iframe de vídeo: ${title}`}
          />
        </div>
      </div>
    );
  }

  // Placeholder melhorado com visual mais atraente
  if (placeholder || !videoUrl) {
    return (
      <div className={`relative w-full aspect-video bg-gradient-card rounded-lg overflow-hidden shadow-elegant min-h-[200px] ${className}`}>
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl md:text-6xl mb-2 md:mb-4 animate-pulse" role="img" aria-label="Ícone de filme">🎬</div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {dropboxUrl ? "Aguardando o vídeo..." : "Vídeo em produção"}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Player de vídeo padrão melhorado
  return (
    <div className={`relative w-full bg-muted rounded-lg overflow-hidden shadow-elegant min-h-[200px] ${className}`}>
      {/* Container responsivo para vídeo padrão */}
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          title={title}
          autoPlay={autoplay}
          controls={controls}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          style={{
            maxHeight: '80vh',
            minHeight: '200px'
          }}
          aria-label={`Vídeo: ${title}`}
          onError={() => setVideoState(prev => ({ ...prev, status: 'error' }))}
          onCanPlay={() => setVideoState(prev => ({ ...prev, status: 'ready' }))}
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
        
        {/* Tratamento de erro para vídeo padrão */}
        {videoState.status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
            <div className="text-white text-center p-4">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-bold">Erro ao carregar vídeo</p>
              <p className="text-sm mt-2">Verifique a URL do vídeo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};