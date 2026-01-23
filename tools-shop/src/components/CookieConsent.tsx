'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Settings } from 'lucide-react';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptSelected = () => {
    saveConsent(preferences);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 pointer-events-auto"
        onClick={() => {}}
      />

      {/* Cookie Banner */}
      <div className="relative bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto animate-in slide-in-from-bottom duration-500">
        {/* Close button */}
        <button
          onClick={rejectAll}
          className="absolute top-4 right-4 p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Затвори"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
              <Cookie className="text-[var(--primary)]" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Използваме бисквитки
              </h2>
              <p className="text-sm text-[var(--muted)]">
                За по-добро потребителско изживяване
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[var(--muted)] text-sm mb-4">
            Използваме бисквитки, за да подобрим вашето изживяване на сайта, да анализираме трафика
            и да персонализираме съдържанието. Можете да изберете кои бисквитки да приемете.{' '}
            <Link href="/cookies" className="text-[var(--primary)] hover:underline">
              Научете повече
            </Link>
          </p>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-4 bg-[var(--card)] rounded-xl space-y-3">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Необходими</p>
                  <p className="text-xs text-[var(--muted)]">Задължителни за работата на сайта</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] cursor-not-allowed opacity-60"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Аналитични</p>
                  <p className="text-xs text-[var(--muted)]">Помагат ни да разберем как използвате сайта</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] cursor-pointer"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--foreground)]">Маркетингови</p>
                  <p className="text-xs text-[var(--muted)]">Използват се за персонализирани реклами</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn btn-outline flex-1 order-3 sm:order-1"
            >
              <Settings size={18} />
              {showSettings ? 'Скрий настройки' : 'Настройки'}
            </button>

            {showSettings ? (
              <button
                onClick={acceptSelected}
                className="btn btn-primary flex-1 order-1 sm:order-2"
              >
                Запази избора
              </button>
            ) : (
              <>
                <button
                  onClick={rejectAll}
                  className="btn btn-outline flex-1 order-2"
                >
                  Само необходими
                </button>
                <button
                  onClick={acceptAll}
                  className="btn btn-primary flex-1 order-1 sm:order-3"
                >
                  Приеми всички
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
