import { Bot, DollarSign, Clock, MessageSquare, TrendingUp } from 'lucide-react';

const AGENT_ID = 'agent_0701khxj4n4herstwkr9dmjnhdrj';

const BG_MONTHS = [
  'Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни',
  'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек',
];

function formatDate(unix: number): string {
  const d = new Date(unix * 1000);
  return `${d.getDate()} ${BG_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDuration(secs: number): string {
  if (secs < 60) return `${secs}с`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}м ${s}с` : `${m}м`;
}

interface ConvSummary {
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  message_count: number;
  status: string;
}

interface ConvDetail {
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  message_count: number;
  status: string;
  el_credits: number;
  llm_usd: number;
  llm_credits: number;
  call_credits: number;
  input_tokens: number;
  output_tokens: number;
}

async function fetchCostData(): Promise<{ conversations: ConvDetail[] } | { error: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return { error: 'NO_KEY' };

  try {
    const listRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=100`,
      { headers: { 'xi-api-key': apiKey }, next: { revalidate: 120 } }
    );
    if (!listRes.ok) return { error: `LIST_${listRes.status}` };
    const { conversations: list }: { conversations: ConvSummary[] } = await listRes.json();

    // Fetch details in parallel (batch to avoid rate limits)
    const BATCH = 10;
    const details: ConvDetail[] = [];
    for (let i = 0; i < Math.min(list.length, 100); i += BATCH) {
      const batch = list.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map(async (c) => {
          const r = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversations/${c.conversation_id}`,
            { headers: { 'xi-api-key': apiKey }, next: { revalidate: 120 } }
          );
          if (!r.ok) return null;
          const d = await r.json();
          const charging = d.metadata?.charging ?? {};
          const gpt4o = charging.llm_usage?.irreversible_generation?.model_usage?.['gpt-4o'] ?? {};
          return {
            conversation_id: c.conversation_id,
            start_time_unix_secs: d.metadata?.start_time_unix_secs ?? c.start_time_unix_secs,
            call_duration_secs: d.metadata?.call_duration_secs ?? c.call_duration_secs,
            message_count: c.message_count,
            status: d.status ?? c.status,
            el_credits: d.metadata?.cost ?? 0,
            llm_usd: charging.llm_price ?? 0,
            llm_credits: charging.llm_charge ?? 0,
            call_credits: charging.call_charge ?? 0,
            input_tokens: (gpt4o.input?.tokens ?? 0) + (gpt4o.input_cache_read?.tokens ?? 0),
            output_tokens: gpt4o.output_total?.tokens ?? 0,
          } as ConvDetail;
        })
      );
      details.push(...results.filter(Boolean) as ConvDetail[]);
    }

    return { conversations: details.sort((a, b) => b.start_time_unix_secs - a.start_time_unix_secs) };
  } catch {
    return { error: 'FETCH_FAILED' };
  }
}

export default async function ChatbotCostsPage() {
  const result = await fetchCostData();

  if ('error' in result) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <DollarSign size={28} className="text-[var(--primary)]" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Разходи — AI Чатбот</h1>
        </div>
        <div className="card p-8 text-center">
          <p className="text-[var(--muted)]">Грешка: {result.error}</p>
        </div>
      </div>
    );
  }

  const { conversations } = result;
  const now = new Date();

  // Totals
  const totalLlmUsd = conversations.reduce((s, c) => s + c.llm_usd, 0);
  const totalDuration = conversations.reduce((s, c) => s + c.call_duration_secs, 0);
  const totalLlmCredits = conversations.reduce((s, c) => s + c.llm_credits, 0);
  const totalCallCredits = conversations.reduce((s, c) => s + c.call_credits, 0);

  // This month
  const thisMonth = conversations.filter((c) => {
    const d = new Date(c.start_time_unix_secs * 1000);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthUsd = thisMonth.reduce((s, c) => s + c.llm_usd, 0);

  const avgUsd = conversations.length > 0 ? totalLlmUsd / conversations.length : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <DollarSign size={28} className="text-[var(--primary)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Разходи — AI Чатбот</h1>
          <p className="text-[var(--muted)]">ElevenLabs кредити и LLM разходи по разговор</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-[var(--muted)]">Обща цена (LLM)</p>
          </div>
          <p className="text-3xl font-bold text-green-700">${totalLlmUsd.toFixed(3)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Този месец: ${thisMonthUsd.toFixed(3)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-[var(--muted)]">EL абонамент кредити</p>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{totalLlmCredits + totalCallCredits}</p>
          <p className="text-xs text-[var(--muted)] mt-1">GPT-4o: {totalLlmCredits} + Глас: {totalCallCredits}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-[var(--muted)]">Разговори общо</p>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{conversations.length}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Този месец: {thisMonth.length} · {formatDuration(totalDuration)} общо</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <p className="text-sm text-[var(--muted)]">Средна цена / разговор</p>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">${avgUsd.toFixed(4)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">само LLM (GPT-4o)</p>
        </div>
      </div>

      {/* Table */}
      {conversations.length === 0 ? (
        <div className="card p-12 text-center">
          <Bot size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-[var(--muted)]">Все още няма разговори</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-[var(--foreground)]">По разговор</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Дата</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--muted)]">Продължителност</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--muted)]">EL кредити</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--muted)]">LLM крeдити</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--muted)]">Разговор кр.</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--muted)]">GPT-4o $</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--muted)]">Токени (in/out)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {conversations.map((conv) => (
                  <tr key={conv.conversation_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-[var(--foreground)]">
                      {formatDate(conv.start_time_unix_secs)}
                    </td>
                    <td className="px-6 py-3 text-[var(--foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        {formatDuration(conv.call_duration_secs)}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-[var(--foreground)]">
                      {conv.el_credits}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--primary)]">
                      {conv.llm_credits}
                    </td>
                    <td className="px-6 py-3 text-right text-orange-600">
                      {conv.call_credits}
                    </td>
                    <td className="px-6 py-3 text-right text-green-700 font-medium">
                      ${conv.llm_usd.toFixed(4)}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-500 text-xs">
                      {conv.input_tokens.toLocaleString()} / {conv.output_tokens.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals row */}
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                  <td className="px-6 py-3 text-[var(--foreground)]">Общо ({conversations.length} разг.)</td>
                  <td className="px-6 py-3 text-[var(--muted)]">{formatDuration(totalDuration)}</td>
                  <td className="px-6 py-3 text-right text-[var(--foreground)]">{(totalLlmCredits + totalCallCredits).toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-[var(--primary)]">{totalLlmCredits.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-orange-600">{totalCallCredits.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-green-700">${totalLlmUsd.toFixed(3)}</td>
                  <td className="px-6 py-3 text-right text-slate-500 text-xs">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
