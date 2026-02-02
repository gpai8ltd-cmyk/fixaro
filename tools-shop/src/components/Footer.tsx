import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Clock,
  Truck,
  Shield,
  CreditCard,
  Award
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--secondary)] text-white">
      {/* Trust badges section */}
      <div className="border-b border-slate-700">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                <Truck className="text-[var(--primary)]" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Безплатна доставка</p>
                <p className="text-sm text-slate-400">За поръчки над 100 лв.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                <Shield className="text-[var(--primary)]" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">2 години гаранция</p>
                <p className="text-sm text-slate-400">На всички продукти</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                <CreditCard className="text-[var(--primary)]" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Наложен платеж</p>
                <p className="text-sm text-slate-400">Плащане при доставка</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center">
                <Award className="text-[var(--primary)]" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Оригинални продукти</p>
                <p className="text-sm text-slate-400">100% качество</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="Fixaro"
                width={200}
                height={133}
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Вашият надежден партньор за качествени инструменти.
              Предлагаме широка гама от електроинструменти и ръчни инструменти
              на достъпни цени.
            </p>
            {/* Newsletter */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Абонирайте се за оферти</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Вашият имейл"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[var(--primary)]"
                />
                <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-lg text-sm font-medium transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Бързи връзки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Всички продукти
                </Link>
              </li>
              <li>
                <Link href="/products?sale=true" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Намаления
                </Link>
              </li>
              <li>
                <Link href="/products?category=elektro-instrumenti" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Електроинструменти
                </Link>
              </li>
              <li>
                <Link href="/products?category=rachni-instrumenti" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Ръчни инструменти
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Общи условия
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Политика за поверителност
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Политика за бисквитки
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Условия за доставка
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Право на връщане
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Контакти</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+359879696506" className="flex items-center gap-2 text-slate-400 hover:text-[var(--primary)] transition-colors">
                  <Phone size={18} />
                  <span>+359 87 9696506</span>
                </a>
              </li>
              <li>
                <a href="mailto:fixaroshop@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-[var(--primary)] transition-colors">
                  <Mail size={18} />
                  <span>fixaroshop@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>гр. София, бул. "Цариградско шосе" 100</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Clock size={18} />
                <span>Пон-Пет: 9:00 - 18:00</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.facebook.com/share/1Apq8MJgrz/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-[var(--primary)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/fixaroshop?igsh=MWNxNzBjZ2xrZDdtMA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-[var(--primary)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="container-custom py-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Fixaro. Всички права запазени.
          </p>
        </div>
      </div>

      {/* Powered by */}
      <div className="bg-slate-900 py-3">
        <div className="container-custom text-center">
          <p className="text-slate-500 text-xs">
            Powered by <a href="https://www.gpailtd.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] font-semibold hover:underline">GPAI</a>
          </p>
          <p className="text-slate-600 text-xs mt-1">
            <a href="https://www.gpailtd.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors">www.gpailtd.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
