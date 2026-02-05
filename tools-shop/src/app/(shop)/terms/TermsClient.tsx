'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

// Define sections with their IDs and titles
const sections = [
  { id: 'section-1', title: '1. Общи положения' },
  { id: 'section-2', title: '2. Поръчка и сключване на договор' },
  { id: 'section-3', title: '3. Цени и плащане' },
  { id: 'section-4', title: '4. Гаранция' },
  { id: 'section-5', title: '5. Интелектуална собственост' },
  { id: 'section-6', title: '6. Ограничение на отговорността' },
  { id: 'section-7', title: '7. Изменения на Общите условия' },
  { id: 'section-8', title: '8. Приложимо право' },
  { id: 'section-9', title: '9. Контакт' },
];

export default function TermsClient() {
  // Track which sections are expanded (first section open by default)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['section-1']));
  // Track current section in view
  const [activeSection, setActiveSection] = useState<string>('section-1');
  // Mobile TOC visibility
  const [tocOpen, setTocOpen] = useState(false);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle TOC click - scroll to section and expand it
  const handleTocClick = (sectionId: string) => {
    // Expand the section if not already expanded
    setExpanded((prev) => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });

    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Close mobile TOC
    setTocOpen(false);
  };

  // Track scroll position to highlight current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Общи условия</h1>
      <p className="text-slate-300 mb-8">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

      <div className="lg:flex lg:gap-8">
        {/* Mobile TOC Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 w-full px-4 py-3 bg-amber-50 rounded-xl shadow-sm text-slate-800 font-medium"
          >
            {tocOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            Съдържание
          </button>

          {tocOpen && (
            <nav className="mt-3 p-4 bg-amber-50 rounded-xl shadow-sm">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => handleTocClick(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-amber-200 text-amber-900 font-medium'
                          : 'text-slate-700 hover:bg-amber-100'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Desktop Sticky TOC Sidebar */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <nav className="sticky top-24 p-5 bg-amber-50 rounded-xl shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">Съдържание</h2>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleTocClick(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-amber-200 text-amber-900 font-medium'
                        : 'text-slate-700 hover:bg-amber-100'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content - Accordion Sections */}
        <main className="flex-1 space-y-4">
          {/* Section 1 */}
          <div id="section-1" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-1')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">1. Общи положения</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-1') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-1') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700 mb-4">
                  Настоящите Общи условия уреждат отношенията между Fixaro (наричан по-долу &quot;Продавач&quot;)
                  и потребителите на уебсайта fixaro.bg (наричани по-долу &quot;Клиенти&quot;) при извършване на
                  покупки на стоки чрез онлайн магазина.
                </p>
                <p className="text-slate-700">
                  С използването на този уебсайт и/или извършването на поръчка, Вие се съгласявате с
                  настоящите Общи условия.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div id="section-2" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-2')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">2. Поръчка и сключване на договор</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-2') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-2') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700 mb-4">
                  Поръчката се счита за приета след потвърждение от страна на Продавача чрез електронна поща
                  или телефонно обаждане. Договорът за покупко-продажба се счита за сключен от момента на
                  потвърждаване на поръчката.
                </p>
                <ul className="list-disc pl-6 text-slate-700">
                  <li>Клиентът избира желаните продукти и ги добавя в количката</li>
                  <li>Клиентът предоставя данни за доставка и избира метод на плащане</li>
                  <li>Клиентът потвърждава поръчката</li>
                  <li>Продавачът изпраща потвърждение на поръчката</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div id="section-3" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-3')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">3. Цени и плащане</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-3') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-3') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700 mb-4">
                  Всички цени в сайта са в български лева (BGN) и включват ДДС. Продавачът си запазва
                  правото да променя цените без предварително уведомление, като промените не засягат
                  вече направени поръчки.
                </p>
                <p className="text-slate-700 mb-4">
                  Методи на плащане:
                </p>
                <ul className="list-disc pl-6 text-slate-700">
                  <li>Наложен платеж - плащане в брой при доставка</li>
                  <li>Банков превод</li>
                  <li>Плащане с карта (скоро)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div id="section-4" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-4')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">4. Гаранция</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-4') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-4') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700 mb-4">
                  Всички продукти се предлагат с гаранция съгласно Закона за защита на потребителите.
                  Гаранционният срок е посочен в описанието на всеки продукт и започва да тече от датата
                  на покупката.
                </p>
                <p className="text-slate-700 mb-4">
                  Гаранцията не покрива:
                </p>
                <ul className="list-disc pl-6 text-slate-700">
                  <li>Повреди, причинени от неправилна употреба</li>
                  <li>Нормално износване</li>
                  <li>Повреди от външни фактори</li>
                  <li>Неоторизирани ремонти или модификации</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div id="section-5" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-5')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">5. Интелектуална собственост</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-5') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-5') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700">
                  Всички материали на този уебсайт, включително текстове, изображения, лога и дизайн,
                  са собственост на Fixaro или са използвани с разрешение. Забранено е копирането,
                  разпространението или използването им без изрично писмено съгласие.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div id="section-6" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-6')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">6. Ограничение на отговорността</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-6') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-6') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700">
                  Продавачът не носи отговорност за щети, възникнали от неправилна употреба на продуктите,
                  забавяне на доставката поради форсмажорни обстоятелства или технически проблеми извън
                  неговия контрол.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div id="section-7" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-7')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">7. Изменения на Общите условия</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-7') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-7') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700">
                  Продавачът си запазва правото да изменя настоящите Общи условия по всяко време.
                  Измененията влизат в сила от момента на публикуването им на уебсайта.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div id="section-8" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-8')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">8. Приложимо право</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-8') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-8') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700">
                  За всички неуредени в настоящите Общи условия въпроси се прилага българското законодателство.
                  Всички спорове се решават чрез преговори, а при непостигане на съгласие - от компетентния
                  български съд.
                </p>
              </div>
            </div>
          </div>

          {/* Section 9 */}
          <div id="section-9" className="bg-amber-50/50 rounded-xl shadow-sm overflow-hidden scroll-mt-24">
            <button
              onClick={() => toggleSection('section-9')}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <h2 className="text-xl font-semibold text-slate-800">9. Контакт</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${
                  expanded.has('section-9') ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                expanded.has('section-9') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-5 pb-5">
                <p className="text-slate-700 mb-4">
                  При въпроси относно Общите условия, моля свържете се с нас:
                </p>
                <ul className="list-none text-slate-700 space-y-1">
                  <li>Телефон: +359 87 9696506</li>
                  <li>Имейл: info@fixaro.bg</li>
                  <li>Адрес: гр. София, бул. &quot;Цариградско шосе&quot; 100</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
