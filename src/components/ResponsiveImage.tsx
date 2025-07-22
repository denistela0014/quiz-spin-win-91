import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const ResponsiveImage = ({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ResponsiveImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`responsive-img ${className}`}
      loading={priority ? "eager" : "lazy"}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        objectFit: 'cover'
      }}
    />
  );
};