export type MessageSource = "user" | "ai";

export interface WidgetMessage {
  id: string;
  text: string;
  source: MessageSource;
  timestamp: Date;
}

export interface ChatPanelProps {
  onClose: () => void;
  categoryContext?: string | null;
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected";
