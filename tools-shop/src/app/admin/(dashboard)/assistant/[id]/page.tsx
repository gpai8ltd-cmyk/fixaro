import Link from 'next/link';
import { ArrowLeft, Bot, User, MessageSquare } from 'lucide-react';

const AGENT_ID = 'agent_0701khxj4n4herstwkr9dmjnhdrj';

const BG_MONTHS = [
  'Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни',
  'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек',
];

function formatDate(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return '—';
  const d = new Date(unixSeconds * 1000);
  const day = d.getDate();
  const month = BG_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}м ${s}с` : `${m}м`;
}

interface TranscriptEntry {
  role: 'agent' | 'user';
  message: string;
  time_in_call_secs: number | null;
}

interface ConversationDetail {
  conversation_id: string;
  agent_id: string;
  status: string;
  metadata: {
    start_time_unix_secs: number | null;
    call_duration_secs: number | null;
  };
  transcript: TranscriptEntry[];
}

async function fetchConversation(
  id: string,
): Promise<{ data: ConversationDetail } | { error: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return { error: 'NO_KEY' };
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${id}`,
      {
        headers: { 'xi-api-key': apiKey },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return { error: `API_ERROR_${res.status}` };
    }

    const data: ConversationDetail = await res.json();
    return { data };
  } catch {
    return { error: 'FETCH_FAILED' };
  }
}

export default async function TranscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchConversation(id);

  const backLink = (
    <Link
      href="/admin/assistant"
      className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6"
    >
      <ArrowLeft size={16} />
      Назад към разговори
    </Link>
  );

  if ('error' in result) {
    return (
      <div>
        {backLink}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Грешка при зареждане
          </h2>
          <p className="text-[var(--muted)]">
            Неуспешна връзка с ElevenLabs API.{' '}
            <span className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded">
              {result.error}
            </span>
          </p>
        </div>
      </div>
    );
  }

  const { data } = result;
  const transcript = data.transcript ?? [];
  const startTime = data.metadata?.start_time_unix_secs;
  const duration = data.metadata?.call_duration_secs;
  const messageCount = transcript.length;

  return (
    <div>
      {backLink}

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Bot size={28} className="text-[var(--primary)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Транскрипт на разговора</h1>
          <p className="text-[var(--muted)] text-sm font-mono">{id}</p>
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Дата/Час</p>
          <p className="text-base font-semibold text-[var(--foreground)]">{formatDate(startTime)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Продължителност</p>
          <p className="text-base font-semibold text-[var(--foreground)]">{formatDuration(duration)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Съобщения</p>
          <p className="text-base font-semibold text-[var(--foreground)]">{messageCount}</p>
        </div>
      </div>

      {/* Transcript */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-5">Разговор</h2>

        {transcript.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-[var(--muted)]">Няма запис на разговора</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transcript.map((entry, idx) => {
              const isAgent = entry.role === 'agent';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} className="text-slate-500" />
                    </div>
                  )}

                  <div className={`max-w-[75%] ${isAgent ? '' : 'items-end flex flex-col'}`}>
                    <p className={`text-xs font-medium mb-1 ${isAgent ? 'text-slate-500' : 'text-slate-500 text-right'}`}>
                      {isAgent ? 'Fixaro Асистент' : 'Клиент'}
                      {entry.time_in_call_secs != null && (
                        <span className="ml-2 text-slate-400 font-normal">{entry.time_in_call_secs}с</span>
                      )}
                    </p>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                          : 'bg-[#84cc16] text-white rounded-tr-sm'
                      }`}
                    >
                      {entry.message}
                    </div>
                  </div>

                  {!isAgent && (
                    <div className="w-8 h-8 rounded-full bg-[#84cc16] flex items-center justify-center shrink-0 mt-1">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* External link at bottom */}
      <div className="mt-4 text-right">
        <a
          href={`https://elevenlabs.io/app/conversational-ai/${AGENT_ID}/conversations/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
        >
          Виж в ElevenLabs &rarr;
        </a>
      </div>
    </div>
  );
}
