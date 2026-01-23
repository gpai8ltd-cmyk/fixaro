import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика за бисквитки | ToolsShop',
  description: 'Информация за използването на бисквитки (cookies) в ToolsShop',
};

export default function CookiesPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Политика за бисквитки</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-[var(--muted)] mb-6">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Какво са бисквитките?</h2>
          <p className="text-[var(--foreground)] mb-4">
            Бисквитките (cookies) са малки текстови файлове, които се съхраняват на Вашето устройство
            (компютър, таблет или телефон), когато посещавате уебсайт. Те позволяват на сайта да
            запомни Вашите действия и предпочитания за определен период от време.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Видове бисквитки, които използваме</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Задължителни бисквитки</h3>
            <p className="text-[var(--foreground)] text-sm mb-2">
              Тези бисквитки са необходими за функционирането на сайта и не могат да бъдат изключени.
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] text-sm">
              <li><strong>session_id</strong> - поддържа сесията Ви докато разглеждате сайта</li>
              <li><strong>cart</strong> - запазва продуктите в количката Ви</li>
              <li><strong>csrf_token</strong> - защитава от злонамерени атаки</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Функционални бисквитки</h3>
            <p className="text-[var(--foreground)] text-sm mb-2">
              Тези бисквитки подобряват потребителското изживяване, като запомнят Вашите предпочитания.
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] text-sm">
              <li><strong>language</strong> - запомня предпочитания от Вас език</li>
              <li><strong>recently_viewed</strong> - показва последно разглеждани продукти</li>
              <li><strong>cookie_consent</strong> - запомня Вашия избор за бисквитки</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Аналитични бисквитки</h3>
            <p className="text-[var(--foreground)] text-sm mb-2">
              Тези бисквитки ни помагат да разберем как посетителите използват сайта.
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] text-sm">
              <li><strong>_ga, _gid</strong> - Google Analytics за анализ на трафика</li>
              <li><strong>_gat</strong> - ограничава честотата на заявките</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">Маркетингови бисквитки</h3>
            <p className="text-[var(--foreground)] text-sm mb-2">
              Тези бисквитки се използват за показване на релевантни реклами.
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] text-sm">
              <li><strong>_fbp</strong> - Facebook Pixel за ремаркетинг</li>
              <li><strong>ads_session</strong> - проследява рекламни кампании</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Срок на съхранение</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 p-3 text-left">Бисквитка</th>
                  <th className="border border-slate-200 p-3 text-left">Тип</th>
                  <th className="border border-slate-200 p-3 text-left">Срок</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 p-3">session_id</td>
                  <td className="border border-slate-200 p-3">Задължителна</td>
                  <td className="border border-slate-200 p-3">До края на сесията</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 p-3">cart</td>
                  <td className="border border-slate-200 p-3">Задължителна</td>
                  <td className="border border-slate-200 p-3">7 дни</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 p-3">cookie_consent</td>
                  <td className="border border-slate-200 p-3">Функционална</td>
                  <td className="border border-slate-200 p-3">1 година</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 p-3">_ga</td>
                  <td className="border border-slate-200 p-3">Аналитична</td>
                  <td className="border border-slate-200 p-3">2 години</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 p-3">_fbp</td>
                  <td className="border border-slate-200 p-3">Маркетингова</td>
                  <td className="border border-slate-200 p-3">3 месеца</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Как да управлявате бисквитките</h2>
          <p className="text-[var(--foreground)] mb-4">
            Можете да контролирате и/или изтривате бисквитки по Ваше желание. Повечето браузъри
            позволяват управление на бисквитките чрез настройките им.
          </p>

          <div className="space-y-3">
            <div>
              <strong className="text-[var(--foreground)]">Google Chrome:</strong>
              <p className="text-[var(--muted)] text-sm">Настройки → Поверителност и сигурност → Бисквитки</p>
            </div>
            <div>
              <strong className="text-[var(--foreground)]">Mozilla Firefox:</strong>
              <p className="text-[var(--muted)] text-sm">Настройки → Поверителност и защита → Бисквитки</p>
            </div>
            <div>
              <strong className="text-[var(--foreground)]">Safari:</strong>
              <p className="text-[var(--muted)] text-sm">Предпочитания → Поверителност → Управление на данни</p>
            </div>
            <div>
              <strong className="text-[var(--foreground)]">Microsoft Edge:</strong>
              <p className="text-[var(--muted)] text-sm">Настройки → Бисквитки и разрешения за сайтове</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800 text-sm">
              <strong>Внимание:</strong> Блокирането на задължителните бисквитки може да наруши
              функционалността на сайта и да Ви попречи да направите поръчка.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Бисквитки на трети страни</h2>
          <p className="text-[var(--foreground)] mb-4">
            Някои бисквитки се поставят от трети страни, които предоставят услуги на нашия сайт:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>Google Analytics</strong> - за анализ на посещаемостта</li>
            <li><strong>Facebook</strong> - за социални функции и реклама</li>
            <li><strong>Google Fonts</strong> - за зареждане на шрифтове</li>
          </ul>
          <p className="text-[var(--foreground)]">
            За повече информация относно бисквитките на тези услуги, моля посетете техните
            политики за поверителност.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Контакт</h2>
          <p className="text-[var(--foreground)] mb-4">
            При въпроси относно използването на бисквитки, моля свържете се с нас:
          </p>
          <ul className="list-none text-[var(--foreground)]">
            <li>Имейл: privacy@toolsshop.bg</li>
            <li>Телефон: +359 888 123 456</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
