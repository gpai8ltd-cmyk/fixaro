'use client';

import { Users } from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Клиенти
        </h1>
        <p className="text-[var(--muted)]">
          Списък с всички клиенти
        </p>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <Users size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Все още няма клиенти
        </h2>
        <p className="text-[var(--muted)]">
          Когато клиентите се регистрират или направят поръчка, те ще се появят тук.
        </p>
      </div>
    </div>
  );
}
