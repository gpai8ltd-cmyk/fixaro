"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./ChatPanel";

// ─── Rate limiting ──────────────────────────────────────────────────────────
const MAX_CONVERSATIONS_PER_DAY = 5;
const STORAGE_KEY = "fixaro-rl";

interface RLState { count: number; date: string; }

function getTodayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getRLState(): RLState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s: RLState = JSON.parse(raw);
      if (s.date === getTodayStr()) return s;
    }
  } catch { /* ignore */ }
  return { count: 0, date: getTodayStr() };
}

function incrementRL(): RLState {
  const s = { ...getRLState(), count: getRLState().count + 1 };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}
// ────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  "elektro-instrumenti": "Електроинструменти",
  "rachni-instrumenti": "Ръчни инструменти",
  "izmervatelnii-uredi": "Измервателни уреди",
  "gradinski-instrumenti": "Градински инструменти",
};

// Module-level helper — avoid re-creation on each render
function getCategoryContext(pathname: string): string | null {
  // Product detail page: /products/some-slug
  if (/^\/products\/[^/]+$/.test(pathname)) {
    return "product-detail";
  }
  return null;
}

function TeaserBubble({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-slate-200/60 px-4 py-2.5 max-w-[200px]"
    >
      <p className="text-sm text-slate-700 leading-snug">Нужна ви е помощ?</p>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 flex-shrink-0 p-0.5 rounded-full hover:bg-slate-100"
        aria-label="Затвори"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function FixaroWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const teaserDismissed = useRef(false);

  const pathname = usePathname();
  const categoryContext = getCategoryContext(pathname);

  // Show teaser after 2s delay; respect sessionStorage dismissal
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("fixaro-teaser-dismissed") === "1") {
      teaserDismissed.current = true;
      return;
    }
    const timer = setTimeout(() => {
      if (!teaserDismissed.current) {
        setShowTeaser(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTeaser = () => {
    setShowTeaser(false);
    teaserDismissed.current = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fixaro-teaser-dismissed", "1");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="fixaro-chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="w-[375px] rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden"
            style={{ maxHeight: "calc(100vh - 96px)" }}
          >
            {isLimited ? (
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#1e293b" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: "#84cc16" }}>
                    🔧
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">Fixaro Асистент</p>
                    <p className="text-xs text-slate-400">Онлайн поддръжка</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" aria-label="Затвори">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Limit message */}
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Дневен лимит достигнат</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Можете да водите до {MAX_CONVERSATIONS_PER_DAY} разговора на ден.<br />
                      Елате отново утре или се свържете с нас директно.
                    </p>
                  </div>
                  <a
                    href="/contact"
                    className="text-sm font-medium px-5 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#84cc16" }}
                    onClick={() => setIsOpen(false)}
                  >
                    Свържете се с нас
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-[540px]">
                <ChatPanel onClose={() => setIsOpen(false)} categoryContext={categoryContext} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB row: teaser bubble to the left, FAB to the right */}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showTeaser && !isOpen && (
            <TeaserBubble onDismiss={dismissTeaser} />
          )}
        </AnimatePresence>
        {/* FAB toggle button */}
        <motion.button
          onClick={() => {
            const opening = !isOpen;
            if (opening) {
              const rl = getRLState();
              if (rl.count >= MAX_CONVERSATIONS_PER_DAY) {
                setIsLimited(true);
                setIsOpen(true);
                dismissTeaser();
                return;
              }
              incrementRL();
              setIsLimited(false);
            }
            setIsOpen(prev => !prev);
            if (opening) dismissTeaser();
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ backgroundColor: "#84cc16" }}
          aria-label={isOpen ? "Затвори чат" : "Отвори чат"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.span>
            ) : (
              <motion.span
                key="open-icon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
