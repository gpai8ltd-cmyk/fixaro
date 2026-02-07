'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface CategoryChild {
  id: string;
  nameBg: string;
  slug: string;
}

interface Category {
  id: string;
  nameBg: string;
  slug: string;
  parentId: string | null;
  children?: CategoryChild[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nameBg: '',
    nameEn: '',
    descriptionBg: '',
    descriptionEn: '',
    price: '',
    oldPrice: '',
    stock: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
  });

  // Load categories (tree structure for hierarchical display)
  useEffect(() => {
    fetch('/api/categories?tree=true')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameBg: formData.nameBg,
          nameEn: formData.nameEn,
          descriptionBg: formData.descriptionBg,
          descriptionEn: formData.descriptionEn,
          price: parseFloat(formData.price) || 0,
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
          stock: parseInt(formData.stock) || 0,
          categoryId: formData.categoryId,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          images: images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Грешка при създаване на продукта');
        return;
      }

      router.push('/admin/products');
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Нов продукт
          </h1>
          <p className="text-[var(--muted)]">
            Добавете нов продукт в магазина
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Основна информация
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Име (BG) *</label>
                    <input
                      type="text"
                      name="nameBg"
                      value={formData.nameBg}
                      onChange={handleChange}
                      className="input"
                      placeholder="Акумулаторен винтоверт 18V"
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
                      placeholder="Cordless Drill 18V"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Описание (BG) *</label>
                  <textarea
                    name="descriptionBg"
                    value={formData.descriptionBg}
                    onChange={handleChange}
                    rows={5}
                    className="input resize-none"
                    placeholder="Подробно описание на продукта..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Описание (EN)</label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={5}
                    className="input resize-none"
                    placeholder="Detailed product description..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Снимки
              </h2>

              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
              />
            </div>

            {/* Pricing */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Цена и наличност
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Цена (лв.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="189.99"
                    required
                  />
                </div>
                <div>
                  <label className="label">Стара цена (лв.)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="249.99"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    За показване на намаление
                  </p>
                </div>
                <div>
                  <label className="label">Наличност (бр.)</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="input"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Статус
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-[var(--primary)]"
                  />
                  <div>
                    <span className="font-medium">Активен</span>
                    <p className="text-sm text-[var(--muted)]">
                      Продуктът ще се вижда в сайта
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-[var(--primary)]"
                  />
                  <div>
                    <span className="font-medium">Препоръчан</span>
                    <p className="text-sm text-[var(--muted)]">
                      Ще се показва на началната страница
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Категория
              </h2>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Избери категория</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.nameBg}>
                    <option value={cat.id}>
                      {cat.nameBg} (всички)
                    </option>
                    {cat.children && cat.children.map((child) => (
                      <option key={child.id} value={child.id}>
                        ── {child.nameBg}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <Link
                href="/admin/categories/new"
                className="text-sm text-[var(--primary)] hover:underline mt-2 inline-block"
              >
                + Добави нова категория
              </Link>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? (
                  'Запазване...'
                ) : (
                  <>
                    <Save size={18} />
                    Запази продукта
                  </>
                )}
              </button>

              <Link
                href="/admin/products"
                className="btn btn-ghost w-full mt-2 text-[var(--muted)]"
              >
                Отказ
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
