'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nameBg: '',
    nameEn: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Грешка при създаване на категорията');
        return;
      }

      router.push('/admin/categories');
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Нова категория</h1>
          <p className="text-[var(--muted)]">Добавете нова категория</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}

        <div className="card p-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="label">Име (BG) *</label>
              <input
                type="text"
                name="nameBg"
                value={formData.nameBg}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Име (EN)</label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Запазване...' : (
                  <>
                    <Save size={18} />
                    Запази категорията
                  </>
                )}
              </button>
              <Link href="/admin/categories" className="btn btn-ghost text-[var(--muted)]">
                Отказ
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
