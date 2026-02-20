"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./ChatPanel";

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
            className="w-[375px] h-[540px] rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden"
            style={{ maxHeight: "calc(100vh - 96px)" }}
          >
            <ChatPanel onClose={() => setIsOpen(false)} categoryContext={categoryContext} />
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
