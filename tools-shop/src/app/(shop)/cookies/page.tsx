'use client';

import { useState } from 'react';
import { Shield, Settings, BarChart3, Megaphone } from 'lucide-react';

// Custom toggle component
function Toggle({
  enabled,
  onChange,
  disabled = false
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
        ${enabled ? 'bg-green-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
          transition-transform duration-200 ease-in-out
          ${enabled ? 'translate-x-6' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

type CookieCategory = 'mandatory' | 'functional' | 'analytics' | 'marketing';

interface CategoryData {
  id: CookieCategory;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  cookies: { name: string; description: string }[];
  alwaysOn?: boolean;
}

const cookieCategories: CategoryData[] = [
  {
    id: 'mandatory',
    name: 'Задължителни бисквитки',
    description: 'Тези бисквитки са необходими за функционирането на сайта и не могат да бъдат изключени.',
    icon: Shield,
    alwaysOn: true,
    cookies: [
      { name: 'session_id', description: 'поддържа сесията Ви докато разглеждате сайта' },
      { name: 'cart', description: 'запазва продуктите в количката Ви' },
      { name: 'csrf_token', description: 'защитава от злонамерени атаки' },
    ],
  },
  {
    id: 'functional',
    name: 'Функционални бисквитки',
    description: 'Тези бисквитки подобряват потребителското изживяване, като запомнят Вашите предпочитания.',
    icon: Settings,
    cookies: [
      { name: 'language', description: 'запомня предпочитания от Вас език' },
      { name: 'recently_viewed', description: 'показва последно разглеждани продукти' },
      { name: 'cookie_consent', description: 'запомня Вашия избор за бисквитки' },
    ],
  },
  {
    id: 'analytics',
    name: 'Аналитични бисквитки',
    description: 'Тези бисквитки ни помагат да разберем как посетителите използват сайта.',
    icon: BarChart3,
    cookies: [
      { name: '_ga, _gid', description: 'Google Analytics за анализ на трафика' },
      { name: '_gat', description: 'ограничава честотата на заявките' },
    ],
  },
  {
    id: 'marketing',
    name: 'Маркетингови бисквитки',
    description: 'Тези бисквитки се използват за показване на релевантни реклами.',
    icon: Megaphone,
    cookies: [
      { name: '_fbp', description: 'Facebook Pixel за ремаркетинг' },
      { name: 'ads_session', description: 'проследява рекламни кампании' },
    ],
  },
];

interface CookieTableRow {
  name: string;
  type: string;
  category: CookieCategory;
  duration: string;
}

const cookieTable: CookieTableRow[] = [
  { name: 'session_id', type: 'Задължителна', category: 'mandatory', duration: 'До края на сесията' },
  { name: 'cart', type: 'Задължителна', category: 'mandatory', duration: '7 дни' },
  { name: 'csrf_token', type: 'Задължителна', category: 'mandatory', duration: 'До края на сесията' },
  { name: 'cookie_consent', type: 'Функционална', category: 'functional', duration: '1 година' },
  { name: 'language', type: 'Функционална', category: 'functional', duration: '1 година' },
  { name: 'recently_viewed', type: 'Функционална', category: 'functional', duration: '30 дни' },
  { name: '_ga', type: 'Аналитична', category: 'analytics', duration: '2 години' },
  { name: '_gid', type: 'Аналитична', category: 'analytics', duration: '24 часа' },
  { name: '_gat', type: 'Аналитична', category: 'analytics', duration: '1 минута' },
  { name: '_fbp', type: 'Маркетингова', category: 'marketing', duration: '3 месеца' },
  { name: 'ads_session', type: 'Маркетингова', category: 'marketing', duration: '30 дни' },
];

export default function CookiesPage() {
  const [enabledCategories, setEnabledCategories] = useState<Record<CookieCategory, boolean>>({
    mandatory: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const toggleCategory = (category: CookieCategory) => {
    if (category === 'mandatory') return; // Cannot toggle mandatory
    setEnabledCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryStatus = (category: CookieCategory): string => {
    return enabledCategories[category] ? 'Активна' : 'Неактивна';
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Политика за бисквитки</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-slate-300 mb-6">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Какво са бисквитките?</h2>
          <p className="text-slate-300 mb-4">
            Бисквитките (cookies) са малки текстови файлове, които се съхраняват на Вашето устройство
            (компютър, таблет или телефон), когато посещавате уебсайт. Те позволяват на сайта да
            запомни Вашите действия и предпочитания за определен период от време.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-6">Управление на бисквитките</h2>
          <p className="text-slate-300 mb-6">
            Изберете кои категории бисквитки да разрешите. Задължителните бисквитки не могат да бъдат изключени.
          </p>

          <div className="grid gap-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;
              const isEnabled = enabledCategories[category.id];
              const isDisabled = category.alwaysOn;

              return (
                <div
                  key={category.id}
                  className={`
                    rounded-xl p-5 shadow-sm transition-all duration-200
                    ${isEnabled
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gray-50 border-2 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${isEnabled ? 'bg-green-100' : 'bg-gray-200'}
                      `}>
                        <Icon
                          className={isEnabled ? 'text-green-600' : 'text-gray-500'}
                          size={24}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                          {category.name}
                          {isDisabled && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              Винаги активни
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">{category.description}</p>
                        <ul className="space-y-1">
                          {category.cookies.map((cookie) => (
                            <li key={cookie.name} className="text-sm text-slate-700">
                              <strong>{cookie.name}</strong> - {cookie.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Toggle
                        enabled={isEnabled}
                        onChange={() => toggleCategory(category.id)}
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Срок на съхранение</h2>

          {/* Desktop table */}
          <div className="hidden md:block rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-semibold text-slate-800">Бисквитка</th>
                  <th className="p-4 text-left font-semibold text-slate-800">Тип</th>
                  <th className="p-4 text-left font-semibold text-slate-800">Срок</th>
                  <th className="p-4 text-left font-semibold text-slate-800">Статус</th>
                </tr>
              </thead>
              <tbody>
                {cookieTable.map((cookie, index) => (
                  <tr
                    key={cookie.name}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="p-4 font-mono text-sm text-slate-800">{cookie.name}</td>
                    <td className="p-4 text-slate-700">{cookie.type}</td>
                    <td className="p-4 text-slate-600">{cookie.duration}</td>
                    <td className="p-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${enabledCategories[cookie.category]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {getCategoryStatus(cookie.category)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {cookieTable.map((cookie) => (
              <div
                key={cookie.name}
                className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-semibold text-gray-800">{cookie.name}</span>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${enabledCategories[cookie.category]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {getCategoryStatus(cookie.category)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="text-gray-800 font-medium">Тип:</span> {cookie.type}</p>
                  <p><span className="text-gray-800 font-medium">Срок:</span> {cookie.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Как да управлявате бисквитките в браузъра</h2>
          <p className="text-slate-300 mb-4">
            Можете да контролирате и/или изтривате бисквитки по Ваше желание. Повечето браузъри
            позволяват управление на бисквитките чрез настройките им.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
              <strong className="text-slate-800">Google Chrome:</strong>
              <p className="text-slate-600 text-sm mt-1">Настройки - Поверителност и сигурност - Бисквитки</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
              <strong className="text-slate-800">Mozilla Firefox:</strong>
              <p className="text-slate-600 text-sm mt-1">Настройки - Поверителност и защита - Бисквитки</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
              <strong className="text-slate-800">Safari:</strong>
              <p className="text-slate-600 text-sm mt-1">Предпочитания - Поверителност - Управление на данни</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
              <strong className="text-slate-800">Microsoft Edge:</strong>
              <p className="text-slate-600 text-sm mt-1">Настройки - Бисквитки и разрешения за сайтове</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 shadow-sm">
            <p className="text-amber-800 text-sm">
              <strong>Внимание:</strong> Блокирането на задължителните бисквитки може да наруши
              функционалността на сайта и да Ви попречи да направите поръчка.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Бисквитки на трети страни</h2>
          <p className="text-slate-300 mb-4">
            Някои бисквитки се поставят от трети страни, които предоставят услуги на нашия сайт:
          </p>
          <ul className="list-disc pl-6 text-slate-300 mb-4">
            <li><strong>Google Analytics</strong> - за анализ на посещаемостта</li>
            <li><strong>Facebook</strong> - за социални функции и реклама</li>
            <li><strong>Google Fonts</strong> - за зареждане на шрифтове</li>
          </ul>
          <p className="text-slate-300">
            За повече информация относно бисквитките на тези услуги, моля посетете техните
            политики за поверителност.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Контакт</h2>
          <p className="text-slate-300 mb-4">
            При въпроси относно използването на бисквитки, моля свържете се с нас:
          </p>
          <ul className="list-none text-slate-300">
            <li>Имейл: privacy@fixaro.bg</li>
            <li>Телефон: +359 87 9696506</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
