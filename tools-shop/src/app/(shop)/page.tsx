import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  ArrowRight,
  Wrench,
  Zap,
  Ruler,
  Leaf,
  ChevronRight,
  Star,
  Flame,
  Package
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

// Icons map for categories
const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'elektro-instrumenti': Zap,
  'rachni-instrumenti': Wrench,
  'izmervatelnii-uredi': Ruler,
  'gradinski-instrumenti': Leaf,
};

const features = [
  {
    icon: Truck,
    title: 'Безплатна доставка',
    description: 'За поръчки над 100 лв.',
  },
  {
    icon: Shield,
    title: 'Гаранция',
    description: '2 години на всички продукти',
  },
  {
    icon: CreditCard,
    title: 'Наложен платеж',
    description: 'Плащане при доставка',
  },
  {
    icon: Headphones,
    title: 'Поддръжка',
    description: 'Пон-Пет: 9:00-18:00',
  },
];

async function getHomePageData() {
  try {
    // Fetch featured products (active and featured)
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    // If not enough featured products, get latest active ones
    let products = featuredProducts;
    if (featuredProducts.length < 4) {
      const additionalProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: {
            notIn: featuredProducts.map(p => p.id),
          },
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 4 - featuredProducts.length,
      });
      products = [...featuredProducts, ...additionalProducts];
    }

    // Fetch categories with product count
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { nameBg: 'asc' },
    });

    return { products, categories };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return { products: [], categories: [] };
  }
}

export default async function HomePage() {
  const { products, categories } = await getHomePageData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] overflow-hidden" aria-label="Промоционален банер">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1920&h=1080&fit=crop"
            alt="Работилница с инструменти"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] via-[var(--secondary)]/90 to-[var(--secondary)]/40" />
        </div>

        <div className="container-custom relative z-10">
          <div className="py-16 md:py-24 lg:py-32">
            <div className="max-w-2xl animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/20 text-[var(--primary)] rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                <Flame size={16} className="animate-pulse" />
                Нови продукти всяка седмица
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Качествени инструменти за{' '}
                <span className="text-[var(--primary)]">професионалисти</span>{' '}
                и любители
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-xl">
                Открийте широка гама от електроинструменти и ръчни инструменти
                на достъпни цени. Бърза доставка в цяла България.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn btn-primary btn-lg shadow-lg shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 transition-shadow">
                  Разгледай продуктите
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <Link href="/products?sale=true" className="btn btn-lg bg-white/10 text-white border-2 border-white/50 hover:bg-white hover:text-[var(--secondary)] backdrop-blur-sm transition-all">
                  Виж намаленията
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span>4.9/5 от 500+ отзива</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-green-400" />
                  <span>2 години гаранция</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b border-[var(--border)]" aria-label="Предимства">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-2 p-3">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="text-[var(--primary)]" size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)] text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16" aria-labelledby="categories-heading">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="categories-heading" className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                Категории
              </h2>
              <p className="text-[var(--muted)] mt-1">
                Разгледайте нашите продуктови категории
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-[var(--primary)] hover:underline font-medium"
            >
              Виж всички
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.slug] || Package;
                return (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]"
                  >
                    <div className="aspect-[4/3] relative flex items-center justify-center">
                      <IconComponent size={64} className="text-white/30" />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <IconComponent size={20} aria-hidden="true" />
                        </div>
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {category._count.products} продукт{category._count.products === 1 ? '' : 'а'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">
                        {category.nameBg}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-white/70 mt-1 hidden sm:block">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--muted)]">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>Все още няма добавени категории</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-[var(--card)]" aria-labelledby="featured-heading">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="featured-heading" className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                Популярни продукти
              </h2>
              <p className="text-[var(--muted)] mt-1">
                Най-търсените инструменти тази седмица
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-[var(--primary)] hover:underline font-medium"
            >
              Виж всички
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                let images: string[] = [];
                try {
                  images = JSON.parse(product.images || '[]');
                } catch {
                  images = [];
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.nameBg}
                    slug={product.slug}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    stock={product.stock}
                    image={images[0] || '/images/placeholder.jpg'}
                    category={product.category?.nameBg || ''}
                    categorySlug={product.category?.slug || ''}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--muted)]">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>Все още няма добавени продукти</p>
              <Link href="/admin" className="btn btn-primary mt-4">
                Добави продукт
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="btn btn-outline">
              Виж всички продукти
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="py-12 md:py-16" aria-label="Промоция">
        <div className="container-custom">
          <div className="relative bg-gradient-primary rounded-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5L25 18l-5 2.5zm20-2.5V16H32v2h8v-2.5zm0 2.5V22H32v-2h8v2.5zM0 22v-2h8v2H0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }} />
            </div>

            <div className="relative p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">
                  Ограничено предложение
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  До -40% на избрани инструменти
                </h2>
                <p className="text-white/80 mt-2 max-w-md">
                  Не пропускайте нашите специални оферти. Промоцията е валидна до изчерпване на количествата.
                </p>
              </div>
              <Link
                href="/products?sale=true"
                className="btn btn-lg bg-white text-[var(--primary)] hover:bg-slate-100 flex-shrink-0"
              >
                Виж намаленията
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-12 md:py-16 bg-[var(--secondary)]" aria-labelledby="contact-heading">
        <div className="container-custom text-center">
          <h2 id="contact-heading" className="text-2xl md:text-3xl font-bold text-white">
            Имате въпроси?
          </h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Свържете се с нас и ние ще ви помогнем да изберете правилния инструмент за вашите нужди.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+359888123456" className="btn btn-primary btn-lg">
              <Headphones size={20} aria-hidden="true" />
              Обадете се
            </a>
            <a href="mailto:info@toolsshop.bg" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-[var(--secondary)]">
              Пишете ни
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
