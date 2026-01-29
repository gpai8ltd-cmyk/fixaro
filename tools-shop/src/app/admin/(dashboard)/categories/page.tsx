'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Category {
  id: string;
  nameBg: string;
  nameEn: string;
  slug: string;
  _count: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        setError('Грешка при зареждане на категориите');
        setLoading(false);
      });
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const deleteCategory = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази категория?')) return;

    setError('');
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
        setSuccess('Категорията е изтрита успешно');
      } else {
        setError(data.error || 'Грешка при изтриване на категорията');
      }
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    }
    setOpenMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Категории</h1>
          <p className="text-[var(--muted)]">Организирайте продуктите в категории ({categories.length})</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          <Plus size={18} />
          Добави категория
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
          {success}
        </div>
      )}

      <div className="card">
        <div className="p-4 border-b border-[var(--border)] bg-slate-50">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-[var(--muted)]">
            <div className="col-span-8 sm:col-span-5">Категория</div>
            <div className="col-span-3 hidden sm:block">Slug</div>
            <div className="col-span-2 hidden sm:block">Продукти</div>
            <div className="col-span-4 sm:col-span-2 text-right">Действия</div>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {categories.map((category) => (
            <div key={category.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-8 sm:col-span-5">
                  <div className="flex items-center gap-3">
                    <FolderTree size={20} className="text-[var(--primary)]" />
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{category.nameBg}</p>
                      {category.nameEn && (
                        <p className="text-sm text-[var(--muted)]">{category.nameEn}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 hidden sm:block">
                  <code className="text-sm text-[var(--muted)] bg-slate-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </div>
                <div className="col-span-2 hidden sm:block">
                  <span className="text-sm text-[var(--foreground)]">
                    {category._count.products}
                  </span>
                </div>
                <div className="col-span-4 sm:col-span-2 text-right">
                  <div className="relative inline-block" ref={openMenu === category.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenu(openMenu === category.id ? null : category.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                      aria-expanded={openMenu === category.id}
                      aria-haspopup="menu"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenu === category.id && (
                      <div
                        className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[160px] z-10"
                        role="menu"
                      >
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                          role="menuitem"
                        >
                          <Edit size={16} />
                          Редактирай
                        </Link>
                        <hr className="my-1 border-[var(--border)]" />
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          role="menuitem"
                        >
                          <Trash2 size={16} />
                          Изтрий
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="p-8 text-center">
            <FolderTree size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[var(--muted)]">Няма създадени категории</p>
            <Link href="/admin/categories/new" className="btn btn-primary mt-4">
              <Plus size={18} />
              Добави първата категория
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
