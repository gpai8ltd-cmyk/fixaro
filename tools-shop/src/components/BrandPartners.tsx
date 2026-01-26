'use client';

import AnimatedSection from './AnimatedSection';

// Using text logos since we don't have actual brand logo images
const brands = [
  { name: 'Bosch', color: '#E30613' },
  { name: 'Makita', color: '#009EDA' },
  { name: 'DeWalt', color: '#FEBD17' },
  { name: 'Milwaukee', color: '#DB021D' },
  { name: 'Metabo', color: '#00A651' },
  { name: 'Festool', color: '#009FE3' },
];

export default function BrandPartners() {
  return (
    <section className="py-12 border-y border-[var(--border)]" aria-label="Партньорски марки">
      <div className="container-custom">
        <AnimatedSection>
          <p className="text-center text-sm text-[var(--muted)] mb-6 uppercase tracking-wide">
            Доверени марки, които предлагаме
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="text-2xl md:text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity cursor-default"
                style={{ color: brand.color }}
              >
                {brand.name}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
