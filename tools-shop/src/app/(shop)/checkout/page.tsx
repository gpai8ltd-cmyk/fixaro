'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Building2,
  Check
} from 'lucide-react';
import { useCart } from '@/store/cart';

type DeliveryType = 'address' | 'office';
type Courier = 'econt' | 'speedy';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const total = subtotal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryType: 'address' as DeliveryType,
    courier: 'econt' as Courier,
    city: '',
    address: '',
    office: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = total >= 100 ? 0 : 6.99;
  const finalTotal = total + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Моля, въведете име';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Моля, въведете телефон';
    } else if (!/^(\+359|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Невалиден телефонен номер';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Моля, въведете имейл';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Невалиден имейл адрес';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Моля, въведете град';
    }

    if (formData.deliveryType === 'address' && !formData.address.trim()) {
      newErrors.address = 'Моля, въведете адрес';
    }

    if (formData.deliveryType === 'office' && !formData.office.trim()) {
      newErrors.office = 'Моля, изберете офис';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          city: formData.city,
          deliveryType: formData.deliveryType,
          courier: formData.courier,
          address: formData.address || undefined,
          office: formData.office || undefined,
          notes: formData.notes || undefined,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.error || 'Грешка при поръчката' });
        return;
      }

      setOrderNumber(data.orderNumber);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setErrors({ submit: 'Грешка при свързване със сървъра' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="container-custom py-16">
        <div className="max-w-md mx-auto text-center">
          <Package size={80} className="mx-auto text-[var(--muted-light)] mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Количката е празна
          </h1>
          <p className="text-slate-500 mb-6">
            Добавете продукти в количката, за да направите поръчка.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Към продуктите
          </Link>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="container-custom py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Поръчката е приета!
          </h1>
          <p className="text-slate-500 mb-4">
            Благодарим ви за поръчката. Ще се свържем с вас за потвърждение.
          </p>
          <div className="card p-6 mb-6">
            <p className="text-sm text-slate-500">Номер на поръчка</p>
            <p className="text-2xl font-bold text-[var(--primary)]">{orderNumber}</p>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Ще получите потвърждение на посочения имейл адрес.
            Очаквайте обаждане от наш представител.
          </p>
          <Link href="/" className="btn btn-primary btn-lg">
            Към началната страница
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-custom py-6 md:py-8">
      {/* Back link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-slate-500 hover:text-[var(--primary)] mb-6"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Обратно към количката
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
        Завършване на поръчката
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg" role="alert">
            {errors.submit}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <section className="card p-6" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-[var(--primary)]" aria-hidden="true" />
                Данни за контакт
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="label">
                    Име и фамилия <span className="text-red-500" aria-label="задължително">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Иван Иванов"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="label">
                    Телефон <span className="text-red-500" aria-label="задължително">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="0888 123 456"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">{errors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="label">
                    Имейл <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="ivan@example.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="card p-6" aria-labelledby="delivery-heading">
              <h2 id="delivery-heading" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-[var(--primary)]" aria-hidden="true" />
                Доставка
              </h2>

              {/* Courier selection */}
              <div className="mb-6">
                <p className="label">Куриер</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, courier: 'econt' }))}
                    className={`relative card p-4 cursor-pointer transition-all duration-200 text-center ${
                      formData.courier === 'econt'
                        ? 'border-[var(--primary)] border-2 bg-[var(--primary)]/10 scale-[1.02] shadow-md'
                        : 'hover:border-[var(--muted)] hover:bg-slate-50'
                    }`}
                  >
                    {formData.courier === 'econt' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className={`font-bold ${formData.courier === 'econt' ? 'text-[var(--primary)]' : 'text-slate-800'}`}>Еконт</div>
                    <div className="text-sm text-slate-500">1-3 работни дни</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, courier: 'speedy' }))}
                    className={`relative card p-4 cursor-pointer transition-all duration-200 text-center ${
                      formData.courier === 'speedy'
                        ? 'border-[var(--primary)] border-2 bg-[var(--primary)]/10 scale-[1.02] shadow-md'
                        : 'hover:border-[var(--muted)] hover:bg-slate-50'
                    }`}
                  >
                    {formData.courier === 'speedy' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className={`font-bold ${formData.courier === 'speedy' ? 'text-[var(--primary)]' : 'text-slate-800'}`}>Спиди</div>
                    <div className="text-sm text-slate-500">1-3 работни дни</div>
                  </button>
                </div>
              </div>

              {/* Delivery type */}
              <div className="mb-6">
                <p className="label">Начин на доставка</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'address' }))}
                    className={`relative card p-4 cursor-pointer transition-all duration-200 ${
                      formData.deliveryType === 'address'
                        ? 'border-[var(--primary)] border-2 bg-[var(--primary)]/10 scale-[1.02] shadow-md'
                        : 'hover:border-[var(--muted)] hover:bg-slate-50'
                    }`}
                  >
                    {formData.deliveryType === 'address' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin size={24} className={formData.deliveryType === 'address' ? 'text-[var(--primary)]' : 'text-slate-500'} aria-hidden="true" />
                      <div className="text-left">
                        <div className={`font-medium ${formData.deliveryType === 'address' ? 'text-[var(--primary)]' : ''}`}>До адрес</div>
                        <div className="text-sm text-slate-500">Доставка до врата</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'office' }))}
                    className={`relative card p-4 cursor-pointer transition-all duration-200 ${
                      formData.deliveryType === 'office'
                        ? 'border-[var(--primary)] border-2 bg-[var(--primary)]/10 scale-[1.02] shadow-md'
                        : 'hover:border-[var(--muted)] hover:bg-slate-50'
                    }`}
                  >
                    {formData.deliveryType === 'office' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Building2 size={24} className={formData.deliveryType === 'office' ? 'text-[var(--primary)]' : 'text-slate-500'} aria-hidden="true" />
                      <div className="text-left">
                        <div className={`font-medium ${formData.deliveryType === 'office' ? 'text-[var(--primary)]' : ''}`}>До офис</div>
                        <div className="text-sm text-slate-500">Вземете от офис</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Address fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="label">
                    Град <span className="text-red-500" aria-label="задължително">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    className={`input ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="София"
                    autoComplete="address-level2"
                  />
                  {errors.city && (
                    <p id="city-error" className="text-red-500 text-sm mt-1" role="alert">{errors.city}</p>
                  )}
                </div>

                {formData.deliveryType === 'address' ? (
                  <div>
                    <label htmlFor="address" className="label">
                      Адрес <span className="text-red-500" aria-label="задължително">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                      className={`input ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="ул. Примерна 123, ет. 4, ап. 56"
                      autoComplete="street-address"
                    />
                    {errors.address && (
                      <p id="address-error" className="text-red-500 text-sm mt-1" role="alert">{errors.address}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label htmlFor="office" className="label">
                      Офис на {formData.courier === 'econt' ? 'Еконт' : 'Спиди'} <span className="text-red-500" aria-label="задължително">*</span>
                    </label>
                    <input
                      type="text"
                      id="office"
                      name="office"
                      value={formData.office}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.office}
                      aria-describedby={errors.office ? 'office-error' : undefined}
                      className={`input ${errors.office ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Въведете адрес или номер на офис"
                    />
                    {errors.office && (
                      <p id="office-error" className="text-red-500 text-sm mt-1" role="alert">{errors.office}</p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Notes */}
            <section className="card p-6" aria-labelledby="notes-heading">
              <h2 id="notes-heading" className="text-lg font-bold text-slate-800 mb-4">
                Бележки към поръчката
              </h2>
              <label htmlFor="notes" className="sr-only">Бележки</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input resize-none"
                placeholder="Допълнителна информация за доставката (по избор)"
              />
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-1" aria-labelledby="summary-heading">
            <div className="card p-6 sticky top-24">
              <h2 id="summary-heading" className="text-lg font-bold text-slate-800 mb-4">
                Вашата поръчка
              </h2>

              {/* Items */}
              <ul className="space-y-3 mb-4" aria-label="Продукти в количката">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" role="img" aria-label={`Изображение на ${item.name}`}>
                          <Package size={24} className="text-slate-300" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} x {item.price.toFixed(2)} лв.
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.price * item.quantity).toFixed(2)} лв.
                    </div>
                  </li>
                ))}
              </ul>

              <hr className="border-[var(--border)] my-4" />

              {/* Totals */}
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Междинна сума</dt>
                  <dd>{total.toFixed(2)} лв.</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Доставка</dt>
                  <dd>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Безплатна</span>
                    ) : (
                      `${deliveryFee.toFixed(2)} лв.`
                    )}
                  </dd>
                </div>

                <hr className="border-[var(--border)] my-2" />

                <div className="flex justify-between text-lg font-bold">
                  <dt>Общо</dt>
                  <dd className="text-[var(--primary)]">{finalTotal.toFixed(2)} лв.</dd>
                </div>
              </dl>

              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm" role="note">
                <strong>Наложен платеж</strong> - плащате при получаване на пратката
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full mt-6"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin" aria-hidden="true">⏳</span>
                    Обработка...
                  </>
                ) : (
                  'Завърши поръчката'
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                С натискане на бутона се съгласявате с нашите{' '}
                <Link href="/terms" className="underline">общи условия</Link>
              </p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
