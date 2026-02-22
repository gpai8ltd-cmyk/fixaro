"use client";
import { useConversation, type DisconnectionDetails } from "@elevenlabs/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Send, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { VoiceIndicator } from "./VoiceIndicator";
import type { ChatPanelProps, WidgetMessage } from "./widget.types";

const BG = {
  agentName: "Fixaro Асистент",
  tagline: "Онлайн поддръжка",
  statusOnline: "● Онлайн",
  statusConnecting: "Свързване...",
  statusError: "Грешка при свързване",
  inputPlaceholder: "Изпратете съобщение...",
  inputPlaceholderConnecting: "Свързване...",
  enableVoice: "Включи гласов режим",
  disableVoice: "Изключи микрофона",
  connectionError: "Грешка при свързване. Моля, опитайте отново.",
} as const;

export function ChatPanel({ onClose, categoryContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [micMuted, setMicMuted] = useState(true); // text-first: mic off by default
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentContext = useRef(false);

  const conversation = useConversation({
    micMuted,
    onMessage: useCallback(({ message, source }: { message: string; source: "user" | "ai" }) => {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), text: message, source, timestamp: new Date() },
      ]);
    }, []),
    onConnect: useCallback(({ conversationId }: { conversationId: string }) => {
      console.log("Fixaro widget connected:", conversationId);
      setError(null);
      setConnectionFailed(false);
    }, []),
    onError: useCallback((message: string) => {
      console.error("Fixaro widget error:", message);
      setError(BG.connectionError);
    }, []),
    onDisconnect: useCallback((details: DisconnectionDetails) => {
      console.log("Fixaro widget disconnected:", details);
    }, []),
  });

  const startSession = useCallback(async () => {
    try {
      const res = await fetch("/api/elevenlabs/signed-url");
      if (!res.ok) throw new Error(`signed-url ${res.status}`);
      const { signedUrl } = await res.json();
      await conversation.startSession({
        signedUrl,
        connectionType: "websocket",
        overrides: { conversation: { textOnly: true } },
      });
    } catch (err) {
      console.error("Fixaro widget: startSession failed:", err);
      setError(BG.connectionError);
      setConnectionFailed(true);
    }
  }, [conversation]);

  // Auto-connect when panel mounts (panel only renders when isOpen=true in FixaroWidget)
  useEffect(() => {
    if (conversation.status === "disconnected") {
      startSession();
    }

    return () => {
      conversation.endSession().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send category context when connection is established
  useEffect(() => {
    if (conversation.status === "connected" && categoryContext && !hasSentContext.current) {
      hasSentContext.current = true;
      const contextMsg = categoryContext === "product-detail"
        ? "Клиентът разглежда страница с конкретен продукт. Бъди готов да помогнеш с детайли, цена и наличност."
        : `Клиентът разглежда категория: ${categoryContext}. Насочи препоръките към тази категория.`;
      conversation.sendContextualUpdate(contextMsg);
    }
    // Reset flag on disconnect so it can fire again if reconnected
    if (conversation.status === "disconnected") {
      hasSentContext.current = false;
    }
  }, [conversation.status, conversation, categoryContext]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || conversation.status !== "connected") return;
    const text = input.trim();
    setMessages(prev => [...prev, { id: crypto.randomUUID(), text, source: "user", timestamp: new Date() }]);
    conversation.sendUserActivity();
    conversation.sendUserMessage(text);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    setMicMuted(!next);
  };

  const isConnected = conversation.status === "connected";
  const isConnecting =
    !connectionFailed &&
    (conversation.status === "connecting" || conversation.status === "disconnected");
  const hasError = error !== null && !isConnected && !isConnecting;

  const statusText = isConnected
    ? BG.statusOnline
    : hasError
    ? BG.statusError
    : BG.statusConnecting;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: "#1e293b" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: "#84cc16" }}
        >
          🔧
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{BG.agentName}</p>
          <p
            className={`text-xs truncate ${
              isConnected
                ? "text-lime-400"
                : hasError
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {statusText}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Затвори чат"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: "#84cc161A" }}
            >
              🏠
            </div>
            <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
              {isConnecting
                ? "Свързване с асистента..."
                : "Свържете се с нашия асистент за бързи отговори за ремонт и поддръжка на дома."}
            </p>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {error && isConnected === false && !isConnecting && (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-xs text-red-500 text-center">{error}</p>
            {connectionFailed && (
              <button
                onClick={() => {
                  setConnectionFailed(false);
                  startSession();
                }}
                className="text-xs px-3 py-1.5 rounded-lg text-white transition-colors"
                style={{ backgroundColor: "#84cc16" }}
              >
                Опитай отново
              </button>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice indicator (when mic is active and connected) */}
      {voiceEnabled && isConnected && (
        <div className="px-4 py-1.5 flex justify-center border-t border-slate-100">
          <VoiceIndicator
            isListening={isConnected && voiceEnabled}
            isSpeaking={conversation.isSpeaking}
          />
        </div>
      )}

      {/* Input area — always visible */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Voice toggle button */}
          <button
            onClick={toggleVoice}
            disabled={!isConnected}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
              voiceEnabled
                ? "bg-lime-100 text-lime-700 hover:bg-lime-200"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
            title={voiceEnabled ? BG.disableVoice : BG.enableVoice}
            aria-label={voiceEnabled ? BG.disableVoice : BG.enableVoice}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Text input */}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? BG.inputPlaceholder : BG.inputPlaceholderConnecting}
            disabled={!isConnected}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-800 placeholder:text-slate-400"
            aria-label={BG.inputPlaceholder}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
            className="p-2 rounded-xl text-white transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#84cc16" }}
            aria-label="Изпрати"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
