'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Phone,
  Wrench,
  ChevronDown,
  Instagram,
  Facebook
} from 'lucide-react';
import { useCart } from '@/store/cart';
import CartSidebar from './CartSidebar';

const categories = [
  { name: 'Електроинструменти', slug: 'elektro-instrumenti' },
  { name: 'Ръчни инструменти', slug: 'rachni-instrumenti' },
  { name: 'Измервателни уреди', slug: 'izmervatelnii-uredi' },
  { name: 'Градински инструменти', slug: 'gradinski-instrumenti' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems, openCart } = useCart();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const itemCount = mounted ? totalItems() : 0;

  return (
    <>
      {/* Top bar */}
      <div className="bg-[var(--secondary)] text-white text-sm py-2 hidden sm:block">
        <div className="container-custom flex justify-center items-center">
          <span className="text-[var(--primary)] font-medium">Безплатна доставка над 100 лв.</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Отвори меню"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={24} aria-hidden="true" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="ToolsShop - Начало">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wrench className="text-white" size={24} aria-hidden="true" />
              </div>
              <span className="text-xl font-bold hidden sm:block">
                <span className="text-gradient">Tools</span>
                <span className="text-[var(--secondary)]">Shop</span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Основна навигация">
              <Link
                href="/products"
                className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-colors"
              >
                Всички продукти
              </Link>

              <div className="relative" ref={categoriesRef}>
                <button
                  className="flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-colors"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  onMouseEnter={() => setCategoriesOpen(true)}
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                  aria-controls="categories-menu"
                  id="categories-button"
                >
                  Категории
                  <ChevronDown size={16} aria-hidden="true" />
                </button>

                <div
                  id="categories-menu"
                  role="menu"
                  aria-labelledby="categories-button"
                  className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                    categoriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-2 min-w-[200px]">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        role="menuitem"
                        className="block px-4 py-2 text-[var(--foreground)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] transition-colors"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/products?sale=true"
                className="text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Намаления
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Social links */}
              <div className="hidden sm:flex items-center gap-1">
                <a
                  href="https://instagram.com/toolsshop.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://facebook.com/toolsshop.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} aria-hidden="true" />
                </a>
              </div>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                aria-label={searchOpen ? 'Затвори търсене' : 'Отвори търсене'}
                aria-expanded={searchOpen}
                aria-controls="search-form"
              >
                <Search size={22} aria-hidden="true" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                aria-label={`Количка${itemCount > 0 ? `, ${itemCount} ${itemCount === 1 ? 'продукт' : 'продукта'}` : ''}`}
              >
                <ShoppingCart size={22} aria-hidden="true" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar - expandable */}
          {searchOpen && (
            <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <form action="/products" className="relative" role="search" id="search-form">
                <label htmlFor="search-input" className="sr-only">Търсене на продукти</label>
                <input
                  ref={searchInputRef}
                  type="search"
                  id="search-input"
                  name="q"
                  placeholder="Търси продукти..."
                  className="input pr-12"
                  aria-label="Търсене на продукти"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Търси"
                >
                  <Search size={20} aria-hidden="true" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Навигационно меню"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[var(--background)] mobile-menu-enter">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Wrench className="text-white" size={18} aria-hidden="true" />
                </div>
                <span className="text-lg font-bold">
                  <span className="text-gradient">Tools</span>
                  <span className="text-[var(--secondary)]">Shop</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                aria-label="Затвори меню"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <nav className="p-4" aria-label="Мобилна навигация">
              <Link
                href="/products"
                className="block py-3 text-lg font-medium text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--border)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Всички продукти
              </Link>

              <div className="py-3 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--muted)] uppercase tracking-wide" id="mobile-categories-label">Категории</span>
                <div className="mt-2 space-y-1" role="list" aria-labelledby="mobile-categories-label">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="block py-2 pl-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                      onClick={() => setMobileMenuOpen(false)}
                      role="listitem"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/products?sale=true"
                className="block py-3 text-lg font-medium text-red-500 hover:text-red-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Намаления
              </Link>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)] bg-[var(--card)]">
              <a href="tel:+359888123456" className="flex items-center gap-2 text-[var(--foreground)] mb-3">
                <Phone size={18} className="text-[var(--primary)]" aria-hidden="true" />
                <span>+359 888 123 456</span>
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/toolsshop.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[var(--card-hover)] rounded-lg flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://facebook.com/toolsshop.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[var(--card-hover)] rounded-lg flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart sidebar */}
      <CartSidebar />
    </>
  );
}
