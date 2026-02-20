"use client";

interface VoiceIndicatorProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export function VoiceIndicator({ isListening, isSpeaking }: VoiceIndicatorProps) {
  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-50 border border-lime-200">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" />
      </span>
      <span className="text-xs text-lime-700 font-medium">
        {isSpeaking ? "Говори..." : "Слушам..."}
      </span>
    </div>
  );
}
