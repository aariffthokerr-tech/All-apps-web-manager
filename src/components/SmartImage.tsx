import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#161826] via-[#121320] to-[#0B131E] text-[#94A3B8] select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Layers className="w-6 h-6 text-[#06B6D4] opacity-80 mb-1" />
        {fallbackLabel && (
          <span className="text-[11px] font-medium text-[#F8FAFC]/80 px-2 text-center truncate max-w-full">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
