import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';

// Long-tail keyword map per category slug
const categoryKeywords: Record<string, { title: string; description: string; keywords: string[] }> = {
  'elektro-instrumenti': {
    title: 'Електроинструменти - купи онлайн на ниски цени',
    description: 'Професионални електроинструменти онлайн: бормашини, ъглошлайфи, винтоверти, перфоратори, циркуляри. Топ марки на достъпни цени. Доставка до врата с Еконт и Спиди. Гаранция 2 години.',
    keywords: [
      'електроинструменти онлайн',
      'купи електроинструменти',
      'професионални електроинструменти',
      'бормашина цена',
      'ъглошлайф цена',
      'винтоверт акумулаторен',
      'перфоратор професионален',
      'циркуляр цена',
      'електроинструменти с доставка',
      'евтини електроинструменти',
      'електроинструменти за дома',
      'електроинструменти за строителство',
    ],
  },
  'rachni-instrumenti': {
    title: 'Ръчни инструменти - голям избор на достъпни цени',
    description: 'Ръчни инструменти онлайн: гаечни ключове, отвертки, клещи, чукове, звездогаечни ключове, комплекти инструменти. Професионално качество. Бърза доставка в цяла България.',
    keywords: [
      'ръчни инструменти онлайн',
      'купи ръчни инструменти',
      'гаечни ключове комплект',
      'звездогаечни ключове комплект цена',
      'комплект отвертки',
      'професионални ръчни инструменти',
      'клещи комбинирани',
      'чук шлосерски',
      'ръчни инструменти за дома',
      'ръчни инструменти за работилница',
      'комплект инструменти в куфар',
    ],
  },
  'izmervatelnii-uredi': {
    title: 'Измервателни уреди - лазерни нивелири, рулетки, мултицети',
    description: 'Измервателни уреди онлайн: лазерни нивелири, рулетки, мултицети, далекомери. Точни измервания за професионалисти. Доставка в цяла България.',
    keywords: [
      'измервателни уреди онлайн',
      'лазерен нивелир цена',
      'лазерна ролетка',
      'мултицет цена',
      'далекомер лазерен',
      'строителен нивелир',
      'рулетка 5м',
      'професионални измервателни инструменти',
      'нивелир самонивелиращ',
      'измервателни уреди за строителство',
    ],
  },
  'gradinski-instrumenti': {
    title: 'Градински инструменти - косачки, тримери, ножици за жив плет',
    description: 'Градински инструменти онлайн: косачки, тримери, ножици за жив плет, моторни триони. Електрически и бензинови. Бърза доставка. Гаранция 2 години.',
    keywords: [
      'градински инструменти онлайн',
      'косачка за трева цена',
      'тример за трева',
      'ножица за жив плет',
      'моторен трион цена',
      'градински инструменти електрически',
      'акумулаторни градински инструменти',
      'градинско оборудване',
      'градински инструменти с доставка',
      'косачка електрическа цена',
    ],
  },
};

// Default (all products)
const defaultMeta = {
  title: 'Инструменти - Каталог | Електроинструменти и ръчни инструменти онлайн',
  description: 'Голям избор от инструменти на достъпни цени. Електроинструменти, ръчни инструменти, винтоверти, бормашини, ъглошлайфи, циркуляри и аксесоари. Купи онлайн с бърза доставка в цяла България.',
  keywords: [
    'инструменти онлайн',
    'купи инструменти',
    'електроинструменти',
    'ръчни инструменти',
    'магазин за инструменти',
    'инструменти с доставка',
    'евтини инструменти',
    'професионални инструменти',
    'инструменти за дома',
    'инструменти България',
    'каталог инструменти',
    'бормашина купи онлайн',
    'винтоверт акумулаторен цена',
    'ъглошлайф купи',
  ],
};

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.q;

  // If searching, generate search-specific meta
  if (searchQuery) {
    return {
      title: `Търсене: "${searchQuery}" | Fixaro`,
      description: `Резултати от търсене за "${searchQuery}" в Fixaro. Инструменти, електроинструменти и аксесоари.`,
      robots: { index: false, follow: true },
    };
  }

  // If category is selected, look up category from DB for accurate name
  if (categorySlug) {
    const categoryMeta = categoryKeywords[categorySlug];

    // Try to get category name from DB for non-hardcoded categories
    let categoryName = categorySlug;
    try {
      const category = await prisma.category.findFirst({ where: { slug: categorySlug }, select: { nameBg: true } });
      if (category) categoryName = category.nameBg;
    } catch { /* ignore */ }

    if (categoryMeta) {
      return {
        title: `${categoryMeta.title} | Fixaro`,
        description: categoryMeta.description,
        keywords: categoryMeta.keywords,
        alternates: { canonical: `/products?category=${categorySlug}` },
        openGraph: {
          title: `${categoryMeta.title} | Fixaro`,
          description: categoryMeta.description,
          type: 'website',
        },
      };
    }

    // Fallback for categories not in our map
    return {
      title: `${categoryName} - купи онлайн | Fixaro`,
      description: `${categoryName} на достъпни цени. Бърза доставка в цяла България. Гаранция 2 години. Наложен платеж.`,
      alternates: { canonical: `/products?category=${categorySlug}` },
      openGraph: {
        title: `${categoryName} | Fixaro`,
        description: `${categoryName} на достъпни цени в Fixaro.`,
        type: 'website',
      },
    };
  }

  // Default: all products
  return {
    title: defaultMeta.title,
    description: defaultMeta.description,
    keywords: defaultMeta.keywords,
    alternates: { canonical: '/products' },
    openGraph: {
      title: 'Инструменти - Каталог | Fixaro',
      description: defaultMeta.description,
      type: 'website',
    },
  };
}

// Server-rendered SEO descriptions per category (visible to Google crawlers)
const categorySeoContent: Record<string, { heading: string; text: string }> = {
  'elektro-instrumenti': {
    heading: 'Електроинструменти онлайн — бормашини, ъглошлайфи, винтоверти',
    text: 'В Fixaro ще намерите широка гама от професионални и битови електроинструменти на достъпни цени. Бормашини, ъглошлайфи, акумулаторни винтоверти, перфоратори, циркуляри и къртачи — всичко необходимо за дома, работилницата и строителството. Всички електроинструменти идват с 2 години гаранция и бърза доставка в цяла България с Еконт и Спиди.',
  },
  'rachni-instrumenti': {
    heading: 'Ръчни инструменти — гаечни ключове, отвертки, клещи',
    text: 'Разгледайте нашата колекция от качествени ръчни инструменти. Гаечни ключове, звездогаечни ключове, комплекти отвертки, клещи, чукове и професионални комплекти инструменти в куфар. Подходящи за професионалисти и любители. Доставка с наложен платеж до всяка точка в България.',
  },
  'izmervatelnii-uredi': {
    heading: 'Измервателни уреди — лазерни нивелири, рулетки, далекомери',
    text: 'Прецизни измервателни инструменти за всякакви задачи. Лазерни нивелири, самонивелиращи се нивелири, лазерни далекомери, мултицети и рулетки. Идеални за строителство, ремонти и професионални измервания. Бърза доставка и 2 години гаранция.',
  },
  'gradinski-instrumenti': {
    heading: 'Градински инструменти — косачки, тримери, моторни триони',
    text: 'Всичко за градината на едно място. Електрически и бензинови косачки, тримери за трева, ножици за жив плет, моторни триони и градинско оборудване. Качествени градински инструменти на достъпни цени с доставка до дома.',
  },
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const seoContent = categorySlug ? categorySeoContent[categorySlug] : null;

  return (
    <>
      {seoContent && (
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="container-custom py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {seoContent.heading}
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl">
              {seoContent.text}
            </p>
          </div>
        </section>
      )}
      <ProductsClient />
    </>
  );
}
