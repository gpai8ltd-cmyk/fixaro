'use client';

import { Phone } from 'lucide-react';

export default function QuickOrderButton() {
  return (
    <a
      href="tel:+359879696506"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Бърза поръчка - обадете се"
    >
      <Phone size={20} className="animate-pulse" aria-hidden="true" />
      <span className="hidden sm:inline font-medium">Бърза поръчка</span>
    </a>
  );
}
