import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Свържете се с Fixaro. Телефон: +359 87 9696506, Имейл: fixaroshop@gmail.com. Работно време: Пон-Пет 9:00-18:00. София, бул. Цариградско шосе 100.',
  keywords: ['контакти', 'телефон', 'имейл', 'адрес', 'работно време', 'свържете се'],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Контакти | Fixaro',
    description: 'Свържете се с нас по телефон, имейл или ни посетете в София.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
