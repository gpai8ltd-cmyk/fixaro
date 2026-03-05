export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fixaro',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: 'Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка в цяла България.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+359-87-9696506',
      contactType: 'customer service',
      availableLanguage: ['Bulgarian'],
      areaServed: 'BG',
    },
    sameAs: [
      'https://www.facebook.com/fixaro',
      'https://www.instagram.com/fixaro',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteUrl}/#store`,
    name: 'Fixaro',
    image: `${siteUrl}/images/logo.png`,
    url: siteUrl,
    telephone: '+359-87-9696506',
    email: 'fixaroshop@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'бул. Цариградско шосе 100',
      addressLocality: 'София',
      addressCountry: 'BG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.6977,
      longitude: 23.3219,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'BGN',
    paymentAccepted: 'Cash, Bank Transfer',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fixaro',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability: 'InStock' | 'OutOfStock';
  sku?: string;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = 'BGN',
  availability,
  sku,
  url,
}: ProductJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Fixaro',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Fixaro',
        url: siteUrl,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}

export function FAQJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Какви начини на плащане предлагате?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Предлагаме плащане с наложен платеж при доставка. Плащате на куриера при получаване на пратката.',
        },
      },
      {
        '@type': 'Question',
        name: 'Колко е доставката и кога е безплатна?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Доставката е 7 лв с Еконт или Спиди. При поръчка над 200 лв доставката е безплатна. Доставяме до адрес или офис на куриер в цяла България.',
        },
      },
      {
        '@type': 'Question',
        name: 'Каква гаранция имат инструментите?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Всички инструменти от Fixaro идват с 2 години гаранция. При дефект можете да върнете продукта за ремонт или замяна.',
        },
      },
      {
        '@type': 'Question',
        name: 'За колко дни получавам поръчката?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Поръчките се обработват в рамките на 1 работен ден. Доставката с Еконт или Спиди е 1-2 работни дни до всяка точка в България.',
        },
      },
      {
        '@type': 'Question',
        name: 'Мога ли да върна продукт?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, имате право на връщане до 14 дни от получаването. Продуктът трябва да е в оригиналната си опаковка и неизползван. Свържете се с нас за организиране на връщането.',
        },
      },
      {
        '@type': 'Question',
        name: 'Продавате ли професионални инструменти?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, предлагаме както професионални електроинструменти и ръчни инструменти за майстори и строители, така и инструменти за домашна употреба на достъпни цени.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
