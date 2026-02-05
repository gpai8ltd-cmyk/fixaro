import { Metadata } from 'next';
import CookiesClient from './CookiesClient';

export const metadata: Metadata = {
  title: 'Политика за бисквитки',
  description: 'Информация за използваните бисквитки на сайта Fixaro. Управление на бисквитки, видове и цели на използване.',
  keywords: ['бисквитки', 'cookies', 'поверителност', 'GDPR', 'управление на бисквитки'],
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: 'Политика за бисквитки | Fixaro',
    description: 'Информация за използваните бисквитки и как да ги управлявате.',
    type: 'website',
  },
};

export default function CookiesPage() {
  return <CookiesClient />;
}
