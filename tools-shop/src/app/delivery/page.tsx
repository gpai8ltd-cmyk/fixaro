import { Metadata } from 'next';
import { Truck, Package, Clock, MapPin, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Условия за доставка | ToolsShop',
  description: 'Информация за начините на доставка, срокове и цени в ToolsShop',
};

export default function DeliveryPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Условия за доставка</h1>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-[var(--primary)]" size={32} />
          </div>
          <h3 className="font-bold text-lg mb-2">Безплатна доставка</h3>
          <p className="text-[var(--muted)]">За поръчки над 100 лв.</p>
        </div>
        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-[var(--primary)]" size={32} />
          </div>
          <h3 className="font-bold text-lg mb-2">Бърза доставка</h3>
          <p className="text-[var(--muted)]">1-3 работни дни</p>
        </div>
        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-[var(--primary)]" size={32} />
          </div>
          <h3 className="font-bold text-lg mb-2">До всяка точка</h3>
          <p className="text-[var(--muted)]">В цяла България</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Куриерски компании</h2>
          <p className="text-[var(--foreground)] mb-4">
            Работим с водещите куриерски компании в България за да осигурим бърза и надеждна доставка:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
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
            <div className="card p-6">
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

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Цени на доставка</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 p-3 text-left">Стойност на поръчката</th>
                  <th className="border border-slate-200 p-3 text-left">До офис</th>
                  <th className="border border-slate-200 p-3 text-left">До адрес</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 p-3">До 50 лв.</td>
                  <td className="border border-slate-200 p-3">5.99 лв.</td>
                  <td className="border border-slate-200 p-3">7.99 лв.</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 p-3">50 - 100 лв.</td>
                  <td className="border border-slate-200 p-3">4.99 лв.</td>
                  <td className="border border-slate-200 p-3">5.99 лв.</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-slate-200 p-3 font-semibold">Над 100 лв.</td>
                  <td className="border border-slate-200 p-3 text-green-600 font-semibold">БЕЗПЛАТНО</td>
                  <td className="border border-slate-200 p-3 text-green-600 font-semibold">БЕЗПЛАТНО</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[var(--muted)] text-sm mt-4">
            * Цените са ориентировъчни и могат да варират в зависимост от теглото и размера на пратката.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Срокове за доставка</h2>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>Стандартна доставка:</strong> 1-3 работни дни</li>
            <li><strong>Експресна доставка:</strong> 1 работен ден (само за определени населени места)</li>
            <li><strong>Доставка до офис/автомат:</strong> 1-2 работни дни</li>
          </ul>
          <p className="text-[var(--foreground)] mb-4">
            Поръчки, направени до 14:00 ч. в работни дни, се обработват и изпращат в същия ден.
            Поръчки след 14:00 ч. или в почивни дни се обработват на следващия работен ден.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Начини на плащане</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Наложен платеж</h3>
                <p className="text-[var(--muted)] text-sm">
                  Плащате в брой на куриера при получаване на пратката.
                </p>
              </div>
            </div>
            <div className="card p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-blue-600" size={24} />
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

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Проследяване на пратка</h2>
          <p className="text-[var(--foreground)] mb-4">
            След изпращане на поръчката ще получите имейл с номер за проследяване. Можете да
            проследите пратката си чрез:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Сайта на куриерската компания</li>
            <li>Мобилното приложение на куриера</li>
            <li>SMS известия (ако сте посочили телефонен номер)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Получаване на пратка</h2>
          <p className="text-[var(--foreground)] mb-4">
            При получаване на пратката, моля проверете:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Дали опаковката е непокътната</li>
            <li>Дали продуктите съответстват на поръчката</li>
            <li>Дали има видими повреди</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Важно:</strong> При забелязани повреди или несъответствия, моля откажете
              приемането и се свържете с нас веднага на телефон +359 888 123 456.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Неуспешна доставка</h2>
          <p className="text-[var(--foreground)] mb-4">
            Ако не сте на адреса при опит за доставка:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Куриерът ще остави известие с инструкции</li>
            <li>Ще бъде направен втори опит за доставка</li>
            <li>Можете да получите пратката от най-близкия офис на куриера</li>
            <li>Пратката се съхранява 7 дни преди да бъде върната</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Контакт</h2>
          <p className="text-[var(--foreground)] mb-4">
            При въпроси относно доставката, моля свържете се с нас:
          </p>
          <ul className="list-none text-[var(--foreground)]">
            <li>Телефон: +359 888 123 456</li>
            <li>Имейл: info@toolsshop.bg</li>
            <li>Работно време: Пон-Пет 9:00 - 18:00</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
