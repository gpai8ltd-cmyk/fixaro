'use client';

import { BarChart3 } from 'lucide-react';

export default function AdminStatsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Статистики
        </h1>
        <p className="text-[var(--muted)]">
          Преглед на продажбите и активността
        </p>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Все още няма статистики
        </h2>
        <p className="text-[var(--muted)]">
          Статистиките ще се появят когато има реални поръчки и продажби.
        </p>
      </div>
    </div>
  );
}
