'use client';

import { useState } from 'react';
import { Truck, Package, Clock, MapPin, CreditCard, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: 'Кога ще получа поръчката си?',
    answer: (
      <div className="space-y-2">
        <p>Времето за доставка зависи от избрания метод:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Стандартна доставка:</strong> 1-3 работни дни</li>
          <li><strong>Експресна доставка:</strong> 1 работен ден (само за определени населени места)</li>
          <li><strong>До офис/автомат:</strong> 1-2 работни дни</li>
        </ul>
        <p className="text-sm text-[var(--muted)]">Поръчки до 14:00 ч. в работни дни се обработват и изпращат в същия ден.</p>
      </div>
    ),
  },
  {
    question: 'Колко струва доставката?',
    answer: (
      <div className="space-y-2">
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>До 50 лв.:</strong> 5.99 лв. (офис) / 7.99 лв. (адрес)</li>
          <li><strong>50-100 лв.:</strong> 4.99 лв. (офис) / 5.99 лв. (адрес)</li>
          <li><strong>Над 100 лв.:</strong> БЕЗПЛАТНО</li>
        </ul>
        <p className="text-sm text-[var(--muted)]">* Цените са ориентировъчни и могат да варират в зависимост от теглото.</p>
      </div>
    ),
  },
  {
    question: 'Как да проследя пратката?',
    answer: (
      <div className="space-y-2">
        <p>След изпращане на поръчката ще получите имейл с номер за проследяване. Можете да проследите пратката чрез:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Сайта на куриерската компания</li>
          <li>Мобилното приложение на куриера</li>
          <li>SMS известия (ако сте посочили телефонен номер)</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Какво да направя при неуспешна доставка?',
    answer: (
      <div className="space-y-2">
        <p>Ако не сте на адреса при опит за доставка:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Куриерът ще остави известие с инструкции</li>
          <li>Ще бъде направен втори опит за доставка</li>
          <li>Можете да получите пратката от най-близкия офис на куриера</li>
          <li>Пратката се съхранява 7 дни преди да бъде върната</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Какви методи на плащане приемате?',
    answer: (
      <div className="space-y-2">
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Наложен платеж:</strong> Плащате в брой на куриера при получаване на пратката.</li>
          <li><strong>Банков превод:</strong> Получавате данни за превод след потвърждение на поръчката.</li>
        </ul>
      </div>
    ),
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-[var(--foreground)]">{item.question}</span>
              <ChevronDown
                size={20}
                className={`text-[var(--muted)] transition-transform duration-200 flex-shrink-0 ml-4 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-5 pt-0 text-[var(--foreground)]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Условия за доставка</h1>

      {/* Highlights - Enhanced icon grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="text-[var(--primary)]" size={40} />
          </div>
          <h3 className="font-bold text-lg mb-2">Безплатна доставка</h3>
          <p className="text-[var(--muted)]">За поръчки над 100 лв.</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="text-[var(--primary)]" size={40} />
          </div>
          <h3 className="font-bold text-lg mb-2">Бърза доставка</h3>
          <p className="text-[var(--muted)]">1-3 работни дни</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-[var(--primary)]" size={40} />
          </div>
          <h3 className="font-bold text-lg mb-2">До всяка точка</h3>
          <p className="text-[var(--muted)]">В цяла България</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        {/* Courier companies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Куриерски компании</h2>
          <p className="text-[var(--foreground)] mb-4">
            Работим с водещите куриерски компании в България за да осигурим бърза и надеждна доставка:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Package className="text-[var(--primary)]" size={24} />
                Еконт
              </h3>
              <ul className="list-disc pl-6 text-[var(--foreground)] space-y-2">
                <li>Доставка до адрес</li>
                <li>Доставка до офис на Еконт</li>
                <li>Доставка до автомат</li>
                <li>Срок: 1-2 работни дни</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Package className="text-[var(--primary)]" size={24} />
                Спиди
              </h3>
              <ul className="list-disc pl-6 text-[var(--foreground)] space-y-2">
                <li>Доставка до адрес</li>
                <li>Доставка до офис на Спиди</li>
                <li>Експресна доставка</li>
                <li>Срок: 1-2 работни дни</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing table - enhanced */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Цени на доставка</h2>

          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-semibold text-[var(--foreground)]">Стойност на поръчката</th>
                  <th className="p-4 text-left font-semibold text-[var(--foreground)]">До офис</th>
                  <th className="p-4 text-left font-semibold text-[var(--foreground)]">До адрес</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-4 text-[var(--foreground)]">До 50 лв.</td>
                  <td className="p-4 text-[var(--foreground)]">5.99 лв.</td>
                  <td className="p-4 text-[var(--foreground)]">7.99 лв.</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="p-4 text-[var(--foreground)]">50 - 100 лв.</td>
                  <td className="p-4 text-[var(--foreground)]">4.99 лв.</td>
                  <td className="p-4 text-[var(--foreground)]">5.99 лв.</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="p-4 font-semibold text-[var(--foreground)]">Над 100 лв.</td>
                  <td className="p-4 text-green-600 font-semibold">БЕЗПЛАТНО</td>
                  <td className="p-4 text-green-600 font-semibold">БЕЗПЛАТНО</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[var(--muted)] text-sm mt-4">
            * Цените са ориентировъчни и могат да варират в зависимост от теглото и размера на пратката.
          </p>
        </section>

        {/* Payment methods */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Начини на плащане</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-green-600" size={28} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Наложен платеж</h3>
                <p className="text-[var(--muted)] text-sm">
                  Плащате в брой на куриера при получаване на пратката.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-blue-600" size={28} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Банков превод</h3>
                <p className="text-[var(--muted)] text-sm">
                  Получавате данни за превод след потвърждение на поръчката.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Important notes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Получаване на пратка</h2>
          <p className="text-[var(--foreground)] mb-4">
            При получаване на пратката, моля проверете:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Дали опаковката е непокътната</li>
            <li>Дали продуктите съответстват на поръчката</li>
            <li>Дали има видими повреди</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <p className="text-amber-800 text-sm">
              <strong>Важно:</strong> При забелязани повреди или несъответствия, моля откажете
              приемането и се свържете с нас веднага на телефон +359 888 123 456.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Контакт</h2>
          <p className="text-[var(--foreground)] mb-4">
            При въпроси относно доставката, моля свържете се с нас:
          </p>
          <div className="rounded-xl bg-gray-50 p-5 shadow-sm">
            <ul className="list-none text-[var(--foreground)] space-y-2">
              <li><strong>Телефон:</strong> +359 888 123 456</li>
              <li><strong>Имейл:</strong> info@fixaro.bg</li>
              <li><strong>Работно време:</strong> Пон-Пет 9:00 - 18:00</li>
            </ul>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Често задавани въпроси</h2>
          <FAQAccordion items={faqItems} />
        </section>
      </div>
    </div>
  );
}
