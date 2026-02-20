"use client";
import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Send, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { VoiceIndicator } from "./VoiceIndicator";
import type { ChatPanelProps, WidgetMessage } from "./widget.types";

const AGENT_ID = "agent_0701khxj4n4herstwkr9dmjnhdrj";

const BG = {
  agentName: "Fixaro Асистент",
  tagline: "Онлайн поддръжка",
  statusOnline: "● Онлайн",
  statusConnecting: "Свързване...",
  inputPlaceholder: "Изпратете съобщение...",
  inputPlaceholderConnecting: "Свързване...",
  startButton: "Започнете разговор",
  enableVoice: "Включи гласов режим",
  disableVoice: "Изключи микрофона",
  connectionError: "Грешка при свързване. Моля, опитайте отново.",
} as const;

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [micMuted, setMicMuted] = useState(true); // Start muted (text-first per CONTEXT.md)
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }, []),
    onError: useCallback((message: string) => {
      console.error("Fixaro widget error:", message);
      setError(BG.connectionError);
    }, []),
  });

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up on panel close
  useEffect(() => {
    return () => {
      conversation.endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    try {
      await conversation.startSession({ agentId: AGENT_ID, connectionType: "webrtc" });
      setSessionStarted(true);
      setError(null);
    } catch (err) {
      console.error("Fixaro widget: startSession failed:", err);
      setError(BG.connectionError);
    }
  };

  const handleSend = () => {
    if (!input.trim() || conversation.status !== "connected") return;
    conversation.sendUserActivity();
    conversation.sendUserMessage(input.trim());
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
    setMicMuted(!next); // micMuted(true) = muted
  };

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";
  const statusText = isConnected
    ? BG.statusOnline
    : isConnecting
    ? BG.statusConnecting
    : BG.tagline;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      {/* Header — navy background with Fixaro identity */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: "#1e293b" }}
      >
        {/* Avatar: wrench emoji in lime circle — reflects Fixaro home services identity */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: "#84cc16" }}
        >
          🔧
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{BG.agentName}</p>
          <p className="text-xs text-slate-400 truncate">{statusText}</p>
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
        {messages.length === 0 && !sessionStarted && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: "#84cc161A" }}
            >
              🏠
            </div>
            <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
              Свържете се с нашия асистент за бързи отговори за ремонт и поддръжка на дома.
            </p>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {error && (
          <p className="text-xs text-red-500 text-center py-2">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice indicator (when mic is active) */}
      {sessionStarted && voiceEnabled && (
        <div className="px-4 py-1.5 flex justify-center border-t border-slate-100">
          <VoiceIndicator
            isListening={isConnected && voiceEnabled}
            isSpeaking={conversation.isSpeaking}
          />
        </div>
      )}

      {/* Input area */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-100 bg-white flex-shrink-0">
        {!sessionStarted ? (
          <button
            onClick={handleStart}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
            style={{ backgroundColor: "#84cc16" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#65a30d";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#84cc16";
            }}
          >
            {BG.startButton}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Voice toggle button */}
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
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
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
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
        )}
      </div>
    </div>
  );
}
