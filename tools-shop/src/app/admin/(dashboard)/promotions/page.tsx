'use client';

import { useEffect, useState } from 'react';
import { Tag, Plus, AlertCircle, CheckCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  discountAmount: number | null;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  validUntil: string | null;
  active: boolean;
  createdAt: string;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function fetchPromotions() {
    try {
      const res = await fetch('/api/promotions');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPromotions(data);
    } catch {
      setError('Грешка при зареждане на промоциите');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази промоция?')) return;

    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPromotions(promotions.filter((p) => p.id !== id));
      setSuccess('Промоцията е изтрита');
    } catch {
      setError('Грешка при изтриване');
    }
    setOpenMenu(null);
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setPromotions(promotions.map((p) => (p.id === id ? updated : p)));
    } catch {
      setError('Грешка при обновяване');
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Промоции</h1>
          <p className="text-[var(--muted)]">Управлявайте промо кодовете</p>
        </div>
        <Link href="/admin/promotions/new" className="btn btn-primary">
          <Plus size={18} />
          Нова промоция
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError('')} className="ml-auto">&times;</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Зареждане...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="card p-12 text-center">
          <Tag size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Все още няма промоции
          </h2>
          <p className="text-[var(--muted)] mb-4">
            Създайте първата си промоция.
          </p>
          <Link href="/admin/promotions/new" className="btn btn-primary">
            <Plus size={18} />
            Създай промоция
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Код</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Отстъпка</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Използвания</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Валидност</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Статус</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[var(--primary)]">{promo.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{promo.discountPercent}%</span>
                      {promo.discountAmount && (
                        <span className="text-[var(--muted)] text-sm ml-1">
                          (или {promo.discountAmount.toFixed(2)} лв.)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      {promo.validUntil ? (
                        <span className={isExpired(promo.validUntil) ? 'text-red-500' : 'text-[var(--muted)]'}>
                          {formatDate(promo.validUntil)}
                          {isExpired(promo.validUntil) && ' (изтекла)'}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">Неограничена</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(promo.id, promo.active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          promo.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {promo.active ? 'Активна' : 'Неактивна'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === promo.id ? null : promo.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {openMenu === promo.id && (
                        <div className="absolute right-4 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                          <Link
                            href={`/admin/promotions/${promo.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-[var(--foreground)]"
                          >
                            <Edit size={16} />
                            Редактирай
                          </Link>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-red-600 w-full"
                          >
                            <Trash2 size={16} />
                            Изтрий
                          </button>
                        </div>
                      )}
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
