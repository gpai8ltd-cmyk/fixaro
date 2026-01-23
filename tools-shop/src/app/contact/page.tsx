'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSuccess(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Контакти</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Свържете се с нас</h2>

            <div className="space-y-4">
              <a
                href="tel:+359888123456"
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[var(--primary)]" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Телефон</p>
                  <p className="text-[var(--primary)]">+359 888 123 456</p>
                  <p className="text-sm text-[var(--muted)]">Пон-Пет: 9:00 - 18:00</p>
                </div>
              </a>

              <a
                href="mailto:info@toolsshop.bg"
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[var(--primary)]" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Имейл</p>
                  <p className="text-[var(--primary)]">info@toolsshop.bg</p>
                  <p className="text-sm text-[var(--muted)]">Отговаряме до 24 часа</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-3">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[var(--primary)]" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Адрес</p>
                  <p className="text-[var(--muted)]">гр. София</p>
                  <p className="text-[var(--muted)]">бул. "Цариградско шосе" 100</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-[var(--primary)]" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Работно време</p>
                  <p className="text-[var(--muted)]">Понеделник - Петък</p>
                  <p className="text-[var(--muted)]">9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick contact options */}
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Бързи въпроси</h3>
            <div className="space-y-3">
              <a
                href="tel:+359888123456"
                className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Phone size={20} />
                <span className="font-medium">Обадете се сега</span>
              </a>
              <a
                href="mailto:info@toolsshop.bg"
                className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail size={20} />
                <span className="font-medium">Изпратете имейл</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-[var(--primary)]" size={24} />
              <h2 className="text-xl font-bold text-[var(--foreground)]">Изпратете съобщение</h2>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Съобщението е изпратено!
                </h3>
                <p className="text-[var(--muted)] mb-6">
                  Благодарим Ви! Ще се свържем с Вас възможно най-скоро.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn btn-primary"
                >
                  Изпрати ново съобщение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Име *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Вашето име"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Имейл *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+359 888 123 456"
                    />
                  </div>
                  <div>
                    <label className="label">Относно</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Изберете тема</option>
                      <option value="order">Въпрос за поръчка</option>
                      <option value="product">Въпрос за продукт</option>
                      <option value="delivery">Доставка</option>
                      <option value="return">Връщане/Рекламация</option>
                      <option value="other">Друго</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Съобщение *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="input resize-none"
                    placeholder="Напишете Вашето съобщение тук..."
                    required
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <input type="checkbox" id="privacy" required className="rounded" />
                  <label htmlFor="privacy">
                    Съгласен/а съм с{' '}
                    <a href="/privacy" className="text-[var(--primary)] hover:underline">
                      политиката за поверителност
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Изпращане...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Изпрати съобщение
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Къде се намираме</h2>
        <div className="card overflow-hidden">
          <div className="bg-slate-200 h-[400px] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-slate-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">
                гр. София, бул. "Цариградско шосе" 100
              </p>
              <a
                href="https://maps.google.com/?q=Sofia,Bulgaria"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-4"
              >
                Отвори в Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
