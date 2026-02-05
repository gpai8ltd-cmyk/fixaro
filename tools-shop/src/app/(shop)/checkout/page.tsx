import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Завършване на поръчката',
  description: 'Завършете поръчката си в онлайн магазин Fixaro. Бърза и сигурна доставка с Еконт и Спиди.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
