'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Phone,
  Wrench,
  ChevronDown,
  Instagram,
  Facebook,
  Loader2
} from 'lucide-react';
import { useCart } from '@/store/cart';
import CartSidebar from './CartSidebar';

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  image: string;
}

interface CategoryChild {
  id: string;
  nameBg: string;
  slug: string;
}

interface CategoryItem {
  id: string;
  nameBg: string;
  slug: string;
  parentId: string | null;
  children?: CategoryChild[];
}

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { totalItems, openCart } = useCart();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent hydration mismatch + fetch categories
  useEffect(() => {
    setMounted(true);
    fetch('/api/categories?tree=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
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

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/products/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle keyboard navigation in suggestions
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      router.push(`/products/${selected.slug}`);
      setShowSuggestions(false);
      setSearchQuery('');
      setSearchOpen(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setShowSuggestions(false);
    setSearchQuery('');
    setSearchOpen(false);
  };

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
            <Link href="/" className="flex items-center" aria-label="Fixaro - Начало">
              {/* Mobile: smaller logo */}
              <Image
                src="/images/logo.png"
                alt="Fixaro"
                width={150}
                height={100}
                className="sm:hidden"
              />
              {/* Desktop: larger logo */}
              <Image
                src="/images/logo.png"
                alt="Fixaro"
                width={220}
                height={146}
                className="hidden sm:block"
              />
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
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-2 min-w-[220px]">
                    {categories.map((category) => (
                      <div key={category.slug}>
                        <Link
                          href={`/products?category=${category.slug}`}
                          role="menuitem"
                          className="block px-4 py-2 text-[var(--foreground)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] transition-colors font-medium"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {category.nameBg}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <div className="ml-3 border-l-2 border-[var(--border)]">
                            {category.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={`/products?category=${child.slug}`}
                                role="menuitem"
                                className="block px-4 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] transition-colors"
                                onClick={() => setCategoriesOpen(false)}
                              >
                                {child.nameBg}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
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
                  href="https://www.instagram.com/fixaroshop?igsh=MWNxNzBjZ2xrZDdtMA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.facebook.com/share/1Apq8MJgrz/?mibextid=wwXIfr"
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

          {/* Search bar - expandable with autocomplete */}
          {searchOpen && (
            <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-200" ref={searchContainerRef}>
              <form action="/products" className="relative" role="search" id="search-form">
                <label htmlFor="search-input" className="sr-only">Търсене на продукти</label>
                <input
                  ref={searchInputRef}
                  type="search"
                  id="search-input"
                  name="q"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Търси продукти..."
                  className="input pr-12"
                  aria-label="Търсене на продукти"
                  aria-expanded={showSuggestions}
                  aria-controls="search-suggestions"
                  aria-autocomplete="list"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Търси"
                >
                  {isSearching ? (
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Search size={20} aria-hidden="true" />
                  )}
                </button>

                {/* Autocomplete suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    id="search-suggestions"
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        role="option"
                        aria-selected={index === selectedIndex}
                        onClick={() => handleSuggestionClick(suggestion.slug)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-[var(--card-hover)]'
                            : 'hover:bg-[var(--card-hover)]'
                        }`}
                      >
                        <div className="w-12 h-12 bg-[var(--card-hover)] rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={suggestion.image}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-sm">
                            <span className="text-[var(--primary)] font-semibold">
                              {suggestion.price.toFixed(2)} лв.
                            </span>
                            {suggestion.oldPrice && (
                              <span className="ml-2 text-[var(--muted)] line-through text-xs">
                                {suggestion.oldPrice.toFixed(2)} лв.
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    ))}
                    <Link
                      href={`/products?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchOpen(false);
                      }}
                      className="block w-full p-3 text-center text-sm text-[var(--primary)] hover:bg-[var(--card-hover)] border-t border-[var(--border)] transition-colors"
                    >
                      Виж всички резултати за &quot;{searchQuery}&quot;
                    </Link>
                  </div>
                )}
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
              <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/images/logo.png"
                  alt="Fixaro"
                  width={160}
                  height={106}
                />
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
                    <div key={category.slug} role="listitem">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="flex-1 py-2 pl-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.nameBg}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => setExpandedMobileCategory(
                              expandedMobileCategory === category.id ? null : category.id
                            )}
                            className="p-2 text-[var(--muted)] hover:text-[var(--primary)]"
                            aria-label={`Покажи подкатегории на ${category.nameBg}`}
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${expandedMobileCategory === category.id ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                      {category.children && category.children.length > 0 && expandedMobileCategory === category.id && (
                        <div className="ml-4 border-l-2 border-[var(--border)] space-y-1 pb-1">
                          {category.children.map((child) => (
                            <Link
                              key={child.slug}
                              href={`/products?category=${child.slug}`}
                              className="block py-1.5 pl-3 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.nameBg}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
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
              <a href="tel:+359879696506" className="flex items-center gap-2 text-[var(--foreground)] mb-3">
                <Phone size={18} className="text-[var(--primary)]" aria-hidden="true" />
                <span>+359 87 9696506</span>
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/fixaroshop?igsh=MWNxNzBjZ2xrZDdtMA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[var(--card-hover)] rounded-lg flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.facebook.com/share/1Apq8MJgrz/?mibextid=wwXIfr"
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
