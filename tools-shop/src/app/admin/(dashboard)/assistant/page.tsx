import Link from 'next/link';
import { Bot, MessageSquare, Clock, Eye, AlertTriangle } from 'lucide-react';

const AGENT_ID = 'agent_0701khxj4n4herstwkr9dmjnhdrj';

interface Conversation {
  conversation_id: string;
  agent_id: string;
  status: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  message_count: number;
  has_audio: boolean;
  has_transcript: boolean;
}

interface ElevenLabsResponse {
  conversations: Conversation[];
  next_cursor: string | null;
}

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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}м ${s}с` : `${m}м`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Завършен
      </span>
    );
  }
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        В момента
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
      {status}
    </span>
  );
}

async function fetchConversations(): Promise<
  { data: ElevenLabsResponse } | { error: string }
> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return { error: 'NO_KEY' };
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=100`,
      {
        headers: { 'xi-api-key': apiKey },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return { error: `API_ERROR_${res.status}` };
    }

    const data: ElevenLabsResponse = await res.json();
    return { data };
  } catch {
    return { error: 'FETCH_FAILED' };
  }
}

export default async function AssistantPage() {
  const result = await fetchConversations();

  // No API key configured
  if ('error' in result && result.error === 'NO_KEY') {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Bot size={28} className="text-[var(--primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Асистент — Разговори</h1>
            <p className="text-[var(--muted)]">История на разговорите с клиенти</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="text-amber-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              API ключът не е конфигуриран
            </h2>
            <p className="text-[var(--muted)] mb-3">
              За да се зареждат разговорите, добавете вашия ElevenLabs API ключ в{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">.env</code>:
            </p>
            <pre className="bg-slate-900 text-green-400 rounded-lg p-4 text-sm font-mono overflow-x-auto">
              {'ELEVENLABS_API_KEY="ваш_ключ_тук"'}
            </pre>
            <p className="text-[var(--muted)] text-sm mt-3">
              Ключът се намира в{' '}
              <span className="font-medium">ElevenLabs Dashboard → Profile → API Keys</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // API error
  if ('error' in result) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Bot size={28} className="text-[var(--primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Асистент — Разговори</h1>
            <p className="text-[var(--muted)]">История на разговорите с клиенти</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">Грешка при зареждане</h2>
          <p className="text-[var(--muted)]">
            Неуспешна връзка с ElevenLabs API.{' '}
            <span className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded">{result.error}</span>
          </p>
        </div>
      </div>
    );
  }

  const { conversations } = result.data;

  // Stats
  const total = conversations.length;
  const now = new Date();
  const thisMonth = conversations.filter((c) => {
    if (!c.start_time_unix_secs) return false;
    const d = new Date(c.start_time_unix_secs * 1000);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const avgDuration =
    total > 0
      ? Math.round(conversations.reduce((sum, c) => sum + c.call_duration_secs, 0) / total)
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Bot size={28} className="text-[var(--primary)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Асистент — Разговори</h1>
          <p className="text-[var(--muted)]">История на разговорите с клиенти</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Total разговори</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bot className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Този месец</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Средна продължителност</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {total > 0 ? formatDuration(avgDuration) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Все още няма разговори
          </h2>
          <p className="text-[var(--muted)]">
            Разговорите ще се появят тук след като клиенти се свържат с AI асистента.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Дата/Час</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Продължителност</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Съобщения</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Статус</th>
                  <th className="text-center px-6 py-3 font-medium text-[var(--muted)]">Детайли</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {conversations.map((conv) => (
                  <tr key={conv.conversation_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-[var(--foreground)]">
                      {formatDate(conv.start_time_unix_secs)}
                    </td>
                    <td className="px-6 py-4 text-[var(--foreground)]">
                      {formatDuration(conv.call_duration_secs)}
                    </td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{conv.message_count}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={conv.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/assistant/${conv.conversation_id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[var(--primary)] hover:bg-blue-50 transition-colors"
                        title="Виж транскрипт"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
