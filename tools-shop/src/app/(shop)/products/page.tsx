import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Продукти',
  description: 'Разгледайте всички продукти в онлайн магазин Fixaro. Електроинструменти, ръчни инструменти, винтоверти, бормашини и аксесоари на достъпни цени.',
  keywords: ['продукти', 'инструменти', 'електроинструменти', 'ръчни инструменти', 'винтоверт', 'бормашина', 'каталог'],
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Продукти | Fixaro',
    description: 'Разгледайте всички инструменти в онлайн магазин Fixaro. Бърза доставка в цяла България.',
    type: 'website',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
