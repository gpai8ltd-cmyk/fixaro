'use client';

import { Award, Truck, Headphones } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const reasons = [
  {
    icon: Award,
    title: 'Оригинални продукти',
    description: 'Работим директно с производителите. Всеки инструмент идва с пълна гаранция и сертификат за автентичност.',
    highlight: '100% оригинални',
  },
  {
    icon: Truck,
    title: 'Бърза доставка',
    description: 'Поръчките до 14:00 се изпращат същия ден. Безплатна доставка за поръчки над 100 лв. в цяла България.',
    highlight: 'До 24 часа',
  },
  {
    icon: Headphones,
    title: 'Експертна подкрепа',
    description: 'Нашият екип от специалисти ще ви помогне да изберете правилния инструмент за вашия проект.',
    highlight: 'Пон-Пет 9-18',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--background)]" aria-labelledby="why-us-heading">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 id="why-us-heading" className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Защо да изберете нас?
            </h2>
            <p className="text-[var(--muted)] mt-2 max-w-2xl mx-auto">
              Повече от 10 години опит в продажбата на професионални инструменти
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="bg-[var(--card)] rounded-xl p-6 md:p-8 border border-[var(--border)] card-hover-enhanced h-full">
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                  <reason.icon className="text-[var(--primary)]" size={28} aria-hidden="true" />
                </div>
                <span className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-full mb-3">
                  {reason.highlight}
                </span>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  {reason.title}
                </h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
