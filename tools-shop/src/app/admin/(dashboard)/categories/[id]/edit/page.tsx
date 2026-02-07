'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  nameBg: string;
  nameEn: string;
  description: string;
  parentId: string | null;
}

interface ParentCategory {
  id: string;
  nameBg: string;
  parentId: string | null;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);

  const [formData, setFormData] = useState({
    nameBg: '',
    nameEn: '',
    description: '',
    parentId: '',
  });

  // Load category and all categories for parent selection
  useEffect(() => {
    async function loadData() {
      try {
        const [categoryRes, categoriesRes] = await Promise.all([
          fetch(`/api/categories/${id}`),
          fetch('/api/categories'),
        ]);

        if (!categoryRes.ok) {
          setError('Категорията не е намерена');
          setIsLoading(false);
          return;
        }

        const category: Category = await categoryRes.json();
        const allCategories: ParentCategory[] = await categoriesRes.json();

        setFormData({
          nameBg: category.nameBg,
          nameEn: category.nameEn || '',
          description: category.description || '',
          parentId: category.parentId || '',
        });

        // Filter: only root categories, exclude self and own children
        const validParents = (Array.isArray(allCategories) ? allCategories : []).filter(
          (c: ParentCategory) => c.id !== id && !c.parentId
        );
        setParentCategories(validParents);
      } catch (err) {
        setError('Грешка при зареждане на данните');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Грешка при обновяване на категорията');
        return;
      }

      setSuccess('Категорията е обновена успешно!');
      setTimeout(() => router.push('/admin/categories'), 1500);
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  if (error && !formData.nameBg) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/categories" className="btn btn-primary">
          Обратно към категории
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Редактиране на категория
          </h1>
          <p className="text-[var(--muted)]">{formData.nameBg}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">{success}</div>
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
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Запазване...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Запази промените
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
