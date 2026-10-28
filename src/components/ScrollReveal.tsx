import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms for staggered children
  threshold?: number; // 0.1 to 0.2 (10-20% visibility)
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // trigger smoothly as user scrolls in
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const style: React.CSSProperties = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <Component
      ref={ref}
      style={style}
      className={`reveal-item ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};
