import { Metadata } from 'next';
import { Shield, User, Database, Scale, Clock, UserCheck, Share2, Lock, AlertCircle, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Политика за поверителност | Fixaro',
  description: 'Политика за поверителност и защита на личните данни (GDPR) на Fixaro',
};

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">Политика за поверителност</h1>
      <p className="text-slate-300 mb-8">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

      {/* GDPR Compliance Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 shadow-sm">
        <p className="text-blue-800 text-sm">
          Тази политика е изготвена в съответствие с Регламент (ЕС) 2016/679 (GDPR) и Закона за
          защита на личните данни на Република България.
        </p>
      </div>

      {/* TL;DR Summary Box */}
      <div className="bg-amber-50 rounded-xl p-6 mb-10 shadow-sm border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Накратко за Вашите данни</h2>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span><strong>Какво събираме:</strong> Име, контакти, адрес за доставка и история на поръчките</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span><strong>Защо:</strong> За да обработим поръчките Ви и да подобрим услугите си</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span><strong>Колко дълго:</strong> 5 години след последната поръчка (или по-кратко за някои данни)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span><strong>Вашите права:</strong> Достъп, коригиране, изтриване и пренос на данните Ви</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span><strong>Въпроси?</strong> Пишете ни на privacy@fixaro.bg</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section Groups */}
      <div className="space-y-10">
        {/* Group 1: Data Collection (Sections 1-2) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">Събиране на данни</h3>

          {/* Section 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">1. Администратор на лични данни</h2>
                <p className="text-white mb-4">
                  Fixaro е администратор на личните данни, които събираме чрез нашия уебсайт.
                </p>
                <ul className="list-none text-white space-y-1">
                  <li><strong>Наименование:</strong> Fixaro ЕООД</li>
                  <li><strong>Адрес:</strong> гр. София, бул. &quot;Цариградско шосе&quot; 100</li>
                  <li><strong>Имейл:</strong> privacy@fixaro.bg</li>
                  <li><strong>Телефон:</strong> +359 888 123 456</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">2. Какви данни събираме</h2>
                <p className="text-white mb-4">
                  Събираме следните категории лични данни:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li><strong>Идентификационни данни:</strong> име, фамилия</li>
                  <li><strong>Данни за контакт:</strong> имейл адрес, телефонен номер, адрес за доставка</li>
                  <li><strong>Данни за поръчки:</strong> история на покупките, предпочитания</li>
                  <li><strong>Технически данни:</strong> IP адрес, тип браузър, устройство</li>
                  <li><strong>Данни от бисквитки:</strong> предпочитания за сайта, сесийна информация</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Group 2: Processing & Legal (Sections 3-4) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">Обработка и правно основание</h3>

          {/* Section 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">3. Цели на обработване</h2>
                <p className="text-white mb-4">
                  Обработваме Вашите лични данни за следните цели:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li>Изпълнение на поръчки и доставка на продукти</li>
                  <li>Комуникация относно поръчки и клиентско обслужване</li>
                  <li>Изпращане на маркетингови съобщения (само с Ваше съгласие)</li>
                  <li>Подобряване на нашите услуги и уебсайт</li>
                  <li>Изпълнение на законови задължения</li>
                  <li>Защита на нашите законни интереси</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">4. Правно основание</h2>
                <p className="text-white mb-4">
                  Обработваме личните Ви данни на следните правни основания:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li><strong>Изпълнение на договор:</strong> за обработка на поръчки</li>
                  <li><strong>Съгласие:</strong> за маркетингови комуникации</li>
                  <li><strong>Законово задължение:</strong> за счетоводни и данъчни цели</li>
                  <li><strong>Легитимен интерес:</strong> за подобряване на услугите</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Group 3: Your Rights (Sections 5-6) - Highlighted */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">Вашите права</h3>

          {/* Section 5 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">5. Срок на съхранение</h2>
                <p className="text-white mb-4">
                  Съхраняваме личните Ви данни за следните периоди:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li>Данни за поръчки: 5 години след последната поръчка</li>
                  <li>Счетоводни документи: 10 години съгласно закона</li>
                  <li>Маркетингови данни: до оттегляне на съгласието</li>
                  <li>Технически логове: 12 месеца</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">6. Вашите права</h2>
                <p className="text-white mb-4">
                  Съгласно GDPR, Вие имате следните права:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li><strong>Право на достъп:</strong> да получите информация какви данни обработваме за Вас</li>
                  <li><strong>Право на коригиране:</strong> да поискате коригиране на неточни данни</li>
                  <li><strong>Право на изтриване:</strong> да поискате изтриване на данните си (&quot;право да бъдеш забравен&quot;)</li>
                  <li><strong>Право на ограничаване:</strong> да поискате ограничаване на обработването</li>
                  <li><strong>Право на преносимост:</strong> да получите данните си в машинночетим формат</li>
                  <li><strong>Право на възражение:</strong> да възразите срещу обработването</li>
                  <li><strong>Право да оттеглите съгласие:</strong> по всяко време, без това да засяга законосъобразността на обработването преди оттеглянето</li>
                </ul>
                <p className="text-white mt-4">
                  За упражняване на тези права, моля свържете се с нас на privacy@fixaro.bg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Group 4: Third Parties & Security (Sections 7-8) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">Сигурност и трети страни</h3>

          {/* Section 7 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">7. Споделяне на данни</h2>
                <p className="text-white mb-4">
                  Можем да споделяме Вашите данни със следните категории получатели:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li>Куриерски компании (Еконт, Спиди) - за доставка на поръчки</li>
                  <li>Платежни оператори - за обработка на плащания</li>
                  <li>IT доставчици - за поддръжка на системите ни</li>
                  <li>Държавни органи - когато това се изисква по закон</li>
                </ul>
                <p className="text-white mt-4 font-medium">
                  Не продаваме Вашите лични данни на трети страни.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">8. Сигурност на данните</h2>
                <p className="text-white mb-4">
                  Прилагаме подходящи технически и организационни мерки за защита на Вашите данни:
                </p>
                <ul className="list-disc pl-6 text-white space-y-1">
                  <li>SSL криптиране на всички комуникации</li>
                  <li>Защитени сървъри с ограничен достъп</li>
                  <li>Редовни проверки за сигурност</li>
                  <li>Обучение на персонала</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Group 5: Updates & Complaints (Sections 9-10) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide mb-2">Жалби и актуализации</h3>

          {/* Section 9 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">9. Жалби</h2>
                <p className="text-white mb-4">
                  Ако смятате, че обработваме данните Ви в нарушение на GDPR, имате право да подадете
                  жалба до Комисията за защита на личните данни:
                </p>
                <ul className="list-none text-white space-y-1">
                  <li><strong>Адрес:</strong> гр. София 1592, бул. &quot;Проф. Цветан Лазаров&quot; № 2</li>
                  <li><strong>Телефон:</strong> 02/91-53-518</li>
                  <li><strong>Уебсайт:</strong> www.cpdp.bg</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 10 */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">10. Промени в политиката</h2>
                <p className="text-white">
                  Можем да актуализираме тази политика периодично. При съществени промени ще Ви уведомим
                  чрез имейл или известие на сайта.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
