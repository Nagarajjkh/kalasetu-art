import { useState, type ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
}

// Image with graceful fallback to a craft-themed placeholder if the source fails.
export default function SmartImage({ src, alt, className, ...rest }: Props) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-cream-200 to-cream-300 text-cream-500 ${className ?? ''}`}
        role="img"
        aria-label={alt}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="h-1/4 w-1/4 opacity-60"
        >
          <path d="M4 16l4-4 4 4 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="1.6" fill="currentColor" />
          <rect x="3" y="4" width="18" height="16" rx="2" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
      {...rest}
    />
  );
}
