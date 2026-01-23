import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Общи условия | ToolsShop',
  description: 'Общи условия за ползване на онлайн магазин ToolsShop',
};

export default function TermsPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Общи условия</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-[var(--muted)] mb-6">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">1. Общи положения</h2>
          <p className="text-[var(--foreground)] mb-4">
            Настоящите Общи условия уреждат отношенията между ToolsShop (наричан по-долу "Продавач")
            и потребителите на уебсайта toolsshop.bg (наричани по-долу "Клиенти") при извършване на
            покупки на стоки чрез онлайн магазина.
          </p>
          <p className="text-[var(--foreground)] mb-4">
            С използването на този уебсайт и/или извършването на поръчка, Вие се съгласявате с
            настоящите Общи условия.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">2. Поръчка и сключване на договор</h2>
          <p className="text-[var(--foreground)] mb-4">
            Поръчката се счита за приета след потвърждение от страна на Продавача чрез електронна поща
            или телефонно обаждане. Договорът за покупко-продажба се счита за сключен от момента на
            потвърждаване на поръчката.
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Клиентът избира желаните продукти и ги добавя в количката</li>
            <li>Клиентът предоставя данни за доставка и избира метод на плащане</li>
            <li>Клиентът потвърждава поръчката</li>
            <li>Продавачът изпраща потвърждение на поръчката</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">3. Цени и плащане</h2>
          <p className="text-[var(--foreground)] mb-4">
            Всички цени в сайта са в български лева (BGN) и включват ДДС. Продавачът си запазва
            правото да променя цените без предварително уведомление, като промените не засягат
            вече направени поръчки.
          </p>
          <p className="text-[var(--foreground)] mb-4">
            Методи на плащане:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Наложен платеж - плащане в брой при доставка</li>
            <li>Банков превод</li>
            <li>Плащане с карта (скоро)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">4. Гаранция</h2>
          <p className="text-[var(--foreground)] mb-4">
            Всички продукти се предлагат с гаранция съгласно Закона за защита на потребителите.
            Гаранционният срок е посочен в описанието на всеки продукт и започва да тече от датата
            на покупката.
          </p>
          <p className="text-[var(--foreground)] mb-4">
            Гаранцията не покрива:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Повреди, причинени от неправилна употреба</li>
            <li>Нормално износване</li>
            <li>Повреди от външни фактори</li>
            <li>Неоторизирани ремонти или модификации</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">5. Интелектуална собственост</h2>
          <p className="text-[var(--foreground)] mb-4">
            Всички материали на този уебсайт, включително текстове, изображения, лога и дизайн,
            са собственост на ToolsShop или са използвани с разрешение. Забранено е копирането,
            разпространението или използването им без изрично писмено съгласие.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">6. Ограничение на отговорността</h2>
          <p className="text-[var(--foreground)] mb-4">
            Продавачът не носи отговорност за щети, възникнали от неправилна употреба на продуктите,
            забавяне на доставката поради форсмажорни обстоятелства или технически проблеми извън
            неговия контрол.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">7. Изменения на Общите условия</h2>
          <p className="text-[var(--foreground)] mb-4">
            Продавачът си запазва правото да изменя настоящите Общи условия по всяко време.
            Измененията влизат в сила от момента на публикуването им на уебсайта.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">8. Приложимо право</h2>
          <p className="text-[var(--foreground)] mb-4">
            За всички неуредени в настоящите Общи условия въпроси се прилага българското законодателство.
            Всички спорове се решават чрез преговори, а при непостигане на съгласие - от компетентния
            български съд.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">9. Контакт</h2>
          <p className="text-[var(--foreground)] mb-4">
            При въпроси относно Общите условия, моля свържете се с нас:
          </p>
          <ul className="list-none text-[var(--foreground)]">
            <li>Телефон: +359 888 123 456</li>
            <li>Имейл: info@toolsshop.bg</li>
            <li>Адрес: гр. София, бул. "Цариградско шосе" 100</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
