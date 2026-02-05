import { Metadata } from 'next';
import DeliveryClient from './DeliveryClient';

export const metadata: Metadata = {
  title: 'Условия за доставка',
  description: 'Безплатна доставка за поръчки над 100 лв. Доставка с Еконт и Спиди до адрес или офис. 1-3 работни дни в цяла България.',
  keywords: ['доставка', 'безплатна доставка', 'Еконт', 'Спиди', 'наложен платеж', 'куриер'],
  alternates: {
    canonical: '/delivery',
  },
  openGraph: {
    title: 'Условия за доставка | Fixaro',
    description: 'Безплатна доставка за поръчки над 100 лв. Бърза доставка в цяла България.',
    type: 'website',
  },
};

export default function DeliveryPage() {
  return <DeliveryClient />;
}
