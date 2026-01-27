import { Metadata } from 'next';
import { RotateCcw, Clock, CheckCircle, AlertTriangle, Package, Phone, Mail, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Право на връщане | Fixaro',
  description: 'Информация за връщане на продукти и рекламации в Fixaro - 14 дни право на отказ',
};

export default function ReturnsPage() {
  const timelineSteps = [
    {
      number: 1,
      icon: Phone,
      title: 'Свържете се с нас',
      description: 'Изпратете имейл на returns@fixaro.bg или се обадете на +359 87 9696506. Посочете номера на поръчката и причината за връщане.',
    },
    {
      number: 2,
      icon: Mail,
      title: 'Получете потвърждение',
      description: 'Ще получите имейл с инструкции за връщане и формуляр за отказ от договора.',
    },
    {
      number: 3,
      icon: Package,
      title: 'Опаковайте продукта',
      description: 'Опаковайте продукта в оригиналната опаковка заедно с всички аксесоари, документи и гаранционна карта.',
    },
    {
      number: 4,
      icon: Truck,
      title: 'Изпратете пратката',
      description: 'Изпратете продукта чрез Еконт или Спиди на адрес: гр. София, бул. "Цариградско шосе" 100',
    },
    {
      number: 5,
      icon: CheckCircle,
      title: 'Получете възстановяване',
      description: 'След проверка на продукта ще възстановим сумата в срок от 14 дни по същия начин, по който е било извършено плащането.',
    },
  ];

  const returnScenarios = [
    { scenario: 'Отказ от договора (14 дни)', cost: 'За сметка на клиента', deadline: '14 дни', isFree: false },
    { scenario: 'Дефектен продукт', cost: 'За наша сметка', deadline: 'Гаранционен срок', isFree: true },
    { scenario: 'Грешка от наша страна', cost: 'За наша сметка', deadline: '14 дни', isFree: true },
  ];

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Право на връщане</h1>

      {/* Highlight box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw className="text-green-600" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800 mb-2">14 дни право на отказ</h2>
            <p className="text-green-700">
              Имате право да върнете всеки продукт в срок от 14 дни от получаването му,
              без да посочвате причина, съгласно Закона за защита на потребителите.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Условия за връщане</h2>
          <p className="text-slate-300 mb-4">
            За да упражните правото си на връщане, продуктът трябва да отговаря на следните условия:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-slate-800">Неизползван продукт</p>
                <p className="text-slate-600 text-sm">Продуктът не е бил използван</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-slate-800">Оригинална опаковка</p>
                <p className="text-slate-600 text-sm">Запазена е оригиналната опаковка</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-slate-800">Всички аксесоари</p>
                <p className="text-slate-600 text-sm">Включени са всички аксесоари и документи</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-slate-800">В срок от 14 дни</p>
                <p className="text-slate-600 text-sm">От датата на получаване</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Как да върнете продукт</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/30 hidden md:block" />

            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="relative flex items-start gap-4 md:gap-6">
                    {/* Step circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {step.number}
                      </div>
                    </div>

                    {/* Step content card */}
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="text-[var(--primary)]" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                          <p className="text-slate-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Разходи за връщане</h2>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left p-4 font-semibold text-slate-800">Сценарий</th>
                  <th className="text-left p-4 font-semibold text-slate-800">Разходи</th>
                  <th className="text-left p-4 font-semibold text-slate-800">Срок</th>
                </tr>
              </thead>
              <tbody>
                {returnScenarios.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-50 last:border-b-0 ${row.isFree ? 'bg-green-50/50' : ''}`}
                  >
                    <td className="p-4 text-slate-700">{row.scenario}</td>
                    <td className={`p-4 font-medium ${row.isFree ? 'text-green-700' : 'text-slate-700'}`}>
                      {row.isFree && <CheckCircle className="inline-block mr-1 -mt-0.5" size={16} />}
                      {row.cost}
                    </td>
                    <td className="p-4 text-slate-600">{row.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <div className="bg-amber-50 rounded-xl p-6 shadow-sm border border-amber-100">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Готови да върнете продукт?</h2>
            <p className="text-amber-700 mb-6">
              Свържете се с нас и ще Ви изпратим инструкции за връщане и формуляр за отказ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:returns@fixaro.bg"
                className="btn btn-primary inline-flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Свържете се с нас
              </a>
              <a
                href="tel:+359879696506"
                className="btn bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Обадете се
              </a>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Продукти, които не подлежат на връщане</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-red-800 font-medium mb-2">Не можете да върнете:</p>
                <ul className="list-disc pl-6 text-red-700 text-sm">
                  <li>Продукти, изработени по поръчка или персонализирани</li>
                  <li>Разопаковани консумативи (дискове, битове, свредла и др.)</li>
                  <li>Продукти с нарушена хигиенна опаковка</li>
                  <li>Продукти, които са били използвани</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Рекламации и гаранция</h2>
          <p className="text-slate-300 mb-4">
            Ако продуктът има фабричен дефект или не отговаря на описанието, имате право на:
          </p>
          <ul className="list-disc pl-6 text-slate-300 mb-4">
            <li>Безплатен ремонт</li>
            <li>Замяна с нов продукт</li>
            <li>Пълно възстановяване на сумата</li>
          </ul>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="text-[var(--primary)]" size={20} />
              Гаранционни срокове
            </h3>
            <ul className="list-disc pl-6 text-slate-700">
              <li><strong>Законова гаранция:</strong> 2 години за всички продукти</li>
              <li><strong>Търговска гаранция:</strong> Посочена в гаранционната карта</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Процедура за рекламация</h2>
          <ol className="list-decimal pl-6 text-slate-300 mb-4">
            <li className="mb-2">Свържете се с нас в рамките на гаранционния срок</li>
            <li className="mb-2">Опишете проблема и приложете снимки (ако е възможно)</li>
            <li className="mb-2">Изпратете продукта заедно с гаранционната карта и фактурата</li>
            <li className="mb-2">Ще получите отговор в срок от 30 дни</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Формуляр за отказ</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-700 mb-4">
              Можете да изтеглите и попълните стандартния формуляр за упражняване право на отказ:
            </p>
            <button className="btn btn-primary">
              <Package size={18} />
              Изтегли формуляр (PDF)
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Контакт за връщания</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <ul className="list-none text-slate-700 space-y-2">
              <li><strong>Имейл:</strong> returns@fixaro.bg</li>
              <li><strong>Телефон:</strong> +359 87 9696506</li>
              <li><strong>Адрес за връщане:</strong> гр. София, бул. "Цариградско шосе" 100</li>
              <li><strong>Работно време:</strong> Пон-Пет 9:00 - 18:00</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
