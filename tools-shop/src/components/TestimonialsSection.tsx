'use client';

import { Star, Quote } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const testimonials = [
  {
    name: 'Георги Петров',
    role: 'Строителен предприемач',
    rating: 5,
    text: 'Използвам инструменти от този магазин вече 3 години. Качеството е безупречно, а доставката винаги е навреме. Препоръчвам!',
  },
  {
    name: 'Мария Иванова',
    role: 'Майстор мебелист',
    rating: 5,
    text: 'Намерих всичко необходимо за работилницата си. Отличен избор и конкурентни цени. Екипът беше много любезен при консултацията.',
  },
  {
    name: 'Димитър Стоянов',
    role: 'Домашен майстор',
    rating: 5,
    text: 'Като любител съм изненадан от професионалното обслужване. Помогнаха ми да избера правилния инструмент за моя проект.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--card)]" aria-labelledby="testimonials-heading">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Какво казват нашите клиенти
            </h2>
            <p className="text-[var(--muted)] mt-2">
              Над 5000 доволни клиенти ни се доверяват
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="bg-[var(--background)] rounded-xl p-6 border border-[var(--border)] card-hover-enhanced h-full relative">
                {/* Quote icon */}
                <Quote
                  size={32}
                  className="absolute top-4 right-4 text-[var(--primary)]/20"
                  aria-hidden="true"
                />

                {/* Star rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-300'}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-[var(--foreground)] mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
