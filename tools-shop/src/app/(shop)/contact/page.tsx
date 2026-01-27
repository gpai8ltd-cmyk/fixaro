'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Loader2, ExternalLink } from 'lucide-react';

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

  const channelCards = [
    {
      icon: Phone,
      title: 'Телефон',
      value: '+359 87 9696506',
      subtext: 'Пон-Пет: 9:00 - 18:00',
      action: 'Обадете се',
      href: 'tel:+359879696506',
      color: 'emerald',
    },
    {
      icon: Mail,
      title: 'Имейл',
      value: 'fixaroshop@gmail.com',
      subtext: 'Отговаряме до 24 часа',
      action: 'Изпратете имейл',
      href: 'mailto:fixaroshop@gmail.com',
      color: 'blue',
    },
    {
      icon: MapPin,
      title: 'Адрес',
      value: 'бул. "Цариградско шосе" 100',
      subtext: 'гр. София',
      action: 'Виж на карта',
      href: 'https://maps.google.com/?q=Sofia,Bulgaria',
      color: 'amber',
    },
    {
      icon: Clock,
      title: 'Работно време',
      value: 'Понеделник - Петък',
      subtext: '9:00 - 18:00',
      action: null,
      href: null,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; iconBg: string; text: string; btnBg: string; btnHover: string }> = {
      emerald: {
        bg: 'bg-emerald-50',
        iconBg: 'bg-emerald-100',
        text: 'text-emerald-600',
        btnBg: 'bg-emerald-600',
        btnHover: 'hover:bg-emerald-700',
      },
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        text: 'text-blue-600',
        btnBg: 'bg-blue-600',
        btnHover: 'hover:bg-blue-700',
      },
      amber: {
        bg: 'bg-amber-50',
        iconBg: 'bg-amber-100',
        text: 'text-amber-600',
        btnBg: 'bg-amber-600',
        btnHover: 'hover:bg-amber-700',
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        text: 'text-purple-600',
        btnBg: 'bg-purple-600',
        btnHover: 'hover:bg-purple-700',
      },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Контакти</h1>

      {/* Contact Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {channelCards.map((card) => {
          const IconComponent = card.icon;
          const colors = getColorClasses(card.color);
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent className={colors.text} size={24} />
              </div>
              <h3 className="font-semibold text-white mb-1">{card.title}</h3>
              <p className="text-white font-medium text-sm mb-0.5">{card.value}</p>
              <p className="text-slate-300 text-sm mb-4">{card.subtext}</p>
              {card.action && card.href && (
                <a
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${colors.text} hover:underline`}
                >
                  {card.action}
                  {card.href.startsWith('http') && <ExternalLink size={14} />}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-10">
        <h3 className="font-semibold text-white mb-4">Бързи въпроси</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="tel:+359879696506"
            className="flex items-center justify-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
          >
            <Phone size={20} />
            <span>Обадете се сега</span>
          </a>
          <a
            href="mailto:fixaroshop@gmail.com"
            className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            <Mail size={20} />
            <span>Изпратете имейл</span>
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-[var(--primary)]" size={22} />
          </div>
          <h2 className="text-xl font-bold text-white">Изпратете съобщение</h2>
        </div>

        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Съобщението е изпратено!
            </h3>
            <p className="text-slate-300 mb-6">
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Име *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                  placeholder="Вашето име"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Имейл *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                  placeholder="+359 888 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Относно</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
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
              <label className="block text-sm font-medium text-white mb-2">Съобщение *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
                placeholder="Напишете Вашето съобщение тук..."
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" id="privacy" required className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
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
              className="btn btn-primary w-full md:w-auto px-8"
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

      {/* Map Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Къде се намираме</h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-[350px] flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MapPin size={32} className="text-[var(--primary)]" />
              </div>
              <p className="text-white font-medium text-lg mb-1">
                гр. София
              </p>
              <p className="text-slate-300 mb-6">
                бул. "Цариградско шосе" 100
              </p>
              <a
                href="https://maps.google.com/?q=Sofia,Bulgaria"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <MapPin size={18} />
                Отвори в Google Maps
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
