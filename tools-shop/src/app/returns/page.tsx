import { Metadata } from 'next';
import { RotateCcw, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Право на връщане | ToolsShop',
  description: 'Информация за връщане на продукти и рекламации в ToolsShop - 14 дни право на отказ',
};

export default function ReturnsPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Право на връщане</h1>

      {/* Highlight box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Условия за връщане</h2>
          <p className="text-[var(--foreground)] mb-4">
            За да упражните правото си на връщане, продуктът трябва да отговаря на следните условия:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-[var(--foreground)]">Неизползван продукт</p>
                <p className="text-[var(--muted)] text-sm">Продуктът не е бил използван</p>
              </div>
            </div>
            <div className="card p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-[var(--foreground)]">Оригинална опаковка</p>
                <p className="text-[var(--muted)] text-sm">Запазена е оригиналната опаковка</p>
              </div>
            </div>
            <div className="card p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-[var(--foreground)]">Всички аксесоари</p>
                <p className="text-[var(--muted)] text-sm">Включени са всички аксесоари и документи</p>
              </div>
            </div>
            <div className="card p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-[var(--foreground)]">В срок от 14 дни</p>
                <p className="text-[var(--muted)] text-sm">От датата на получаване</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Как да върнете продукт</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Свържете се с нас</h3>
                <p className="text-[var(--muted)]">
                  Изпратете имейл на returns@toolsshop.bg или се обадете на +359 888 123 456.
                  Посочете номера на поръчката и причината за връщане.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Получете потвърждение</h3>
                <p className="text-[var(--muted)]">
                  Ще получите имейл с инструкции за връщане и формуляр за отказ от договора.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Опаковайте продукта</h3>
                <p className="text-[var(--muted)]">
                  Опаковайте продукта в оригиналната опаковка заедно с всички аксесоари,
                  документи и гаранционна карта.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Изпратете пратката</h3>
                <p className="text-[var(--muted)]">
                  Изпратете продукта чрез Еконт или Спиди на адрес:
                  гр. София, бул. "Цариградско шосе" 100
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Получете възстановяване</h3>
                <p className="text-[var(--muted)]">
                  След проверка на продукта ще възстановим сумата в срок от 14 дни
                  по същия начин, по който е било извършено плащането.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Разходи за връщане</h2>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li><strong>При отказ от договора (14 дни):</strong> Разходите за връщане са за сметка на клиента</li>
            <li><strong>При дефектен продукт:</strong> Разходите са за наша сметка</li>
            <li><strong>При грешка от наша страна:</strong> Разходите са за наша сметка</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Продукти, които не подлежат на връщане</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Рекламации и гаранция</h2>
          <p className="text-[var(--foreground)] mb-4">
            Ако продуктът има фабричен дефект или не отговаря на описанието, имате право на:
          </p>
          <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
            <li>Безплатен ремонт</li>
            <li>Замяна с нов продукт</li>
            <li>Пълно възстановяване на сумата</li>
          </ul>

          <div className="card p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
              <Clock className="text-[var(--primary)]" size={20} />
              Гаранционни срокове
            </h3>
            <ul className="list-disc pl-6 text-[var(--foreground)]">
              <li><strong>Законова гаранция:</strong> 2 години за всички продукти</li>
              <li><strong>Търговска гаранция:</strong> Посочена в гаранционната карта</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Процедура за рекламация</h2>
          <ol className="list-decimal pl-6 text-[var(--foreground)] mb-4">
            <li className="mb-2">Свържете се с нас в рамките на гаранционния срок</li>
            <li className="mb-2">Опишете проблема и приложете снимки (ако е възможно)</li>
            <li className="mb-2">Изпратете продукта заедно с гаранционната карта и фактурата</li>
            <li className="mb-2">Ще получите отговор в срок от 30 дни</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Формуляр за отказ</h2>
          <div className="card p-6 bg-slate-50">
            <p className="text-[var(--foreground)] mb-4">
              Можете да изтеглите и попълните стандартния формуляр за упражняване право на отказ:
            </p>
            <button className="btn btn-primary">
              <Package size={18} />
              Изтегли формуляр (PDF)
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Контакт за връщания</h2>
          <ul className="list-none text-[var(--foreground)]">
            <li><strong>Имейл:</strong> returns@toolsshop.bg</li>
            <li><strong>Телефон:</strong> +359 888 123 456</li>
            <li><strong>Адрес за връщане:</strong> гр. София, бул. "Цариградско шосе" 100</li>
            <li><strong>Работно време:</strong> Пон-Пет 9:00 - 18:00</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
