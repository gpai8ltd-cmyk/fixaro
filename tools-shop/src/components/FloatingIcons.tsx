'use client';

import { Wrench, Zap, Ruler, Hammer } from 'lucide-react';

const icons = [
  { Icon: Wrench, delay: '0s', x: '10%', y: '20%' },
  { Icon: Zap, delay: '0.5s', x: '85%', y: '25%' },
  { Icon: Ruler, delay: '1s', x: '8%', y: '75%' },
  { Icon: Hammer, delay: '1.5s', x: '88%', y: '70%' },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-20"
          style={{
            left: x,
            top: y,
            animationDelay: delay,
          }}
        >
          <Icon size={48} className="text-white" />
        </div>
      ))}
    </div>
  );
}
