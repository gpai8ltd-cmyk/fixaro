'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface ParentCategory {
  id: string;
  nameBg: string;
  parentId: string | null;
}

function NewCategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedParentId = searchParams.get('parentId') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [parentName, setParentName] = useState('');

  const [formData, setFormData] = useState({
    nameBg: '',
    nameEn: '',
    description: '',
    parentId: preselectedParentId,
  });

  // Load existing categories for parent selection
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        // Only show root categories as potential parents (no nested subcategories)
        const roots = (Array.isArray(data) ? data : []).filter(
          (c: ParentCategory) => !c.parentId
        );
        setParentCategories(roots);
        // Set parent name for subtitle
        if (preselectedParentId) {
          const parent = roots.find((c: ParentCategory) => c.id === preselectedParentId);
          if (parent) setParentName(parent.nameBg);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, [preselectedParentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {parentName ? 'Нова подкатегория' : 'Нова категория'}
          </h1>
          <p className="text-[var(--muted)]">
            {parentName ? `Подкатегория на "${parentName}"` : 'Добавете нова категория'}
          </p>
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
              <label className="label">Родителска категория</label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Loader2 size={16} className="animate-spin" />
                  Зареждане...
                </div>
              ) : (
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Без (основна категория)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBg}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-[var(--muted)] mt-1">
                Оставете празно за основна категория или изберете родител за подкатегория
              </p>
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

export default function NewCategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    }>
      <NewCategoryForm />
    </Suspense>
  );
}
