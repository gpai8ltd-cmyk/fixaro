'use client';

import CountUp from 'react-countup';
import { Users, Package, ThumbsUp } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Доволни клиенти',
  },
  {
    icon: Package,
    value: 350,
    suffix: '+',
    label: 'Продукта в наличност',
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: '%',
    label: 'Положителни отзиви',
  },
];

export default function StatsBar() {
  return (
    <section className="py-12 bg-[var(--secondary)]" aria-label="Статистика">
      <div className="container-custom">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="text-[var(--primary)]" size={28} aria-hidden="true" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <p className="text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
