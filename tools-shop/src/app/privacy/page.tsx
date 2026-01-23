import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика за поверителност | ToolsShop',
  description: 'Политика за поверителност и защита на личните данни (GDPR) на ToolsShop',
};

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Политика за поверителност</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-[var(--muted)] mb-6">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            Тази политика е изготвена в съответствие с Регламент (ЕС) 2016/679 (GDPR) и Закона за
            защита на личните данни на Република България.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">1. Администратор на лични данни</h2>
          <p className="text-[var(--foreground)] mb-4">
            ToolsShop е администратор на личните данни, които събираме чрез нашия уебсайт.
          </p>
          <ul className="list-none text-[var(--foreground)] mb-4">
            <li><strong>Наименование:</strong> ToolsShop ЕООД</li>
            <li><strong>Адрес:</strong> гр. София, бул. "Цариградско шосе" 100</li>
            <li><strong>Имейл:</strong> privacy@toolsshop.bg</li>
            <li><strong>Телефон:</strong> +359 888 123 456</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">2. Какви данни събираме</h2>
          <p className="text-[var(--foreground)] mb-4">
            Събираме следните категории лични данни:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>Идентификационни данни:</strong> име, фамилия</li>
            <li><strong>Данни за контакт:</strong> имейл адрес, телефонен номер, адрес за доставка</li>
            <li><strong>Данни за поръчки:</strong> история на покупките, предпочитания</li>
            <li><strong>Технически данни:</strong> IP адрес, тип браузър, устройство</li>
            <li><strong>Данни от бисквитки:</strong> предпочитания за сайта, сесийна информация</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">3. Цели на обработване</h2>
          <p className="text-[var(--foreground)] mb-4">
            Обработваме Вашите лични данни за следните цели:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Изпълнение на поръчки и доставка на продукти</li>
            <li>Комуникация относно поръчки и клиентско обслужване</li>
            <li>Изпращане на маркетингови съобщения (само с Ваше съгласие)</li>
            <li>Подобряване на нашите услуги и уебсайт</li>
            <li>Изпълнение на законови задължения</li>
            <li>Защита на нашите законни интереси</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">4. Правно основание</h2>
          <p className="text-[var(--foreground)] mb-4">
            Обработваме личните Ви данни на следните правни основания:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>Изпълнение на договор:</strong> за обработка на поръчки</li>
            <li><strong>Съгласие:</strong> за маркетингови комуникации</li>
            <li><strong>Законово задължение:</strong> за счетоводни и данъчни цели</li>
            <li><strong>Легитимен интерес:</strong> за подобряване на услугите</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">5. Срок на съхранение</h2>
          <p className="text-[var(--foreground)] mb-4">
            Съхраняваме личните Ви данни за следните периоди:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Данни за поръчки: 5 години след последната поръчка</li>
            <li>Счетоводни документи: 10 години съгласно закона</li>
            <li>Маркетингови данни: до оттегляне на съгласието</li>
            <li>Технически логове: 12 месеца</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">6. Вашите права</h2>
          <p className="text-[var(--foreground)] mb-4">
            Съгласно GDPR, Вие имате следните права:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>Право на достъп:</strong> да получите информация какви данни обработваме за Вас</li>
            <li><strong>Право на коригиране:</strong> да поискате коригиране на неточни данни</li>
            <li><strong>Право на изтриване:</strong> да поискате изтриване на данните си ("право да бъдеш забравен")</li>
            <li><strong>Право на ограничаване:</strong> да поискате ограничаване на обработването</li>
            <li><strong>Право на преносимост:</strong> да получите данните си в машинночетим формат</li>
            <li><strong>Право на възражение:</strong> да възразите срещу обработването</li>
            <li><strong>Право да оттеглите съгласие:</strong> по всяко време, без това да засяга законосъобразността на обработването преди оттеглянето</li>
          </ul>
          <p className="text-[var(--foreground)] mb-4">
            За упражняване на тези права, моля свържете се с нас на privacy@toolsshop.bg
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">7. Споделяне на данни</h2>
          <p className="text-[var(--foreground)] mb-4">
            Можем да споделяме Вашите данни със следните категории получатели:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Куриерски компании (Еконт, Спиди) - за доставка на поръчки</li>
            <li>Платежни оператори - за обработка на плащания</li>
            <li>IT доставчици - за поддръжка на системите ни</li>
            <li>Държавни органи - когато това се изисква по закон</li>
          </ul>
          <p className="text-[var(--foreground)] mb-4">
            Не продаваме Вашите лични данни на трети страни.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">8. Сигурност на данните</h2>
          <p className="text-[var(--foreground)] mb-4">
            Прилагаме подходящи технически и организационни мерки за защита на Вашите данни:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>SSL криптиране на всички комуникации</li>
            <li>Защитени сървъри с ограничен достъп</li>
            <li>Редовни проверки за сигурност</li>
            <li>Обучение на персонала</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">9. Жалби</h2>
          <p className="text-[var(--foreground)] mb-4">
            Ако смятате, че обработваме данните Ви в нарушение на GDPR, имате право да подадете
            жалба до Комисията за защита на личните данни:
          </p>
          <ul className="list-none text-[var(--foreground)]">
            <li><strong>Адрес:</strong> гр. София 1592, бул. „Проф. Цветан Лазаров" № 2</li>
            <li><strong>Телефон:</strong> 02/91-53-518</li>
            <li><strong>Уебсайт:</strong> www.cpdp.bg</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">10. Промени в политиката</h2>
          <p className="text-[var(--foreground)] mb-4">
            Можем да актуализираме тази политика периодично. При съществени промени ще Ви уведомим
            чрез имейл или известие на сайта.
          </p>
        </section>
      </div>
    </div>
  );
}
