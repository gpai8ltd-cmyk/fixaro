'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditPromotionPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchPromotion();
  }, [params.id]);

  async function fetchPromotion() {
    try {
      const res = await fetch(`/api/promotions/${params.id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();

      setCode(data.code);
      setDiscountPercent(String(data.discountPercent));
      setDiscountAmount(data.discountAmount ? String(data.discountAmount) : '');
      setMinOrderAmount(data.minOrderAmount ? String(data.minOrderAmount) : '');
      setMaxUses(data.maxUses ? String(data.maxUses) : '');
      setValidUntil(data.validUntil ? data.validUntil.split('T')[0] : '');
      setActive(data.active);
    } catch {
      setError('Промоцията не е намерена');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/promotions/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountPercent,
          discountAmount: discountAmount || null,
          minOrderAmount: minOrderAmount || null,
          maxUses: maxUses || null,
          validUntil: validUntil || null,
          active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }

      setSuccess('Промоцията е обновена');
      setTimeout(() => router.push('/admin/promotions'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при обновяване');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !code) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600">{error}</p>
        <Link href="/admin/promotions" className="btn btn-secondary mt-4">
          Назад към промоциите
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/promotions" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Редактиране на промоция</h1>
          <p className="text-[var(--muted)]">Код: {code}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Промо код *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="input w-full font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Отстъпка (%) *
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                min="1"
                max="100"
                required
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Фиксирана сума (лв.)
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="По избор"
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Мин. стойност на поръчка (лв.)
              </label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Без ограничение"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Макс. използвания
              </label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
                placeholder="Неограничено"
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Валидна до
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="input w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm text-[var(--foreground)]">
              Активна промоция
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Запазване...' : 'Запази промените'}
          </button>
          <Link href="/admin/promotions" className="btn btn-secondary">
            Отказ
          </Link>
        </div>
      </form>
    </div>
  );
}
