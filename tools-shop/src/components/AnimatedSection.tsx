'use client';

import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number; // delay in ms for staggered animations
}

export default function AnimatedSection({
  children,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0
}: AnimatedSectionProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
