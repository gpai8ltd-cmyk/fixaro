'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2
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

interface Product {
  id: string;
  nameBg: string;
  nameEn: string;
  descriptionBg: string;
  descriptionEn: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Load product and categories
  useEffect(() => {
    async function loadData() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/categories?tree=true'),
        ]);

        if (!productRes.ok) {
          setError('Продуктът не е намерен');
          setIsLoading(false);
          return;
        }

        const product: Product = await productRes.json();
        const cats = await categoriesRes.json();

        setCategories(cats);
        setFormData({
          nameBg: product.nameBg,
          nameEn: product.nameEn || '',
          descriptionBg: product.descriptionBg,
          descriptionEn: product.descriptionEn || '',
          price: product.price.toString(),
          oldPrice: product.oldPrice?.toString() || '',
          stock: product.stock.toString(),
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        });

        try {
          const parsedImages = JSON.parse(product.images || '[]');
          setImages(Array.isArray(parsedImages) ? parsedImages : []);
        } catch {
          setImages([]);
        }
      } catch (err) {
        setError('Грешка при зареждане на данните');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

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
    setSuccess('');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameBg: formData.nameBg,
          nameEn: formData.nameEn || undefined,
          descriptionBg: formData.descriptionBg,
          descriptionEn: formData.descriptionEn || undefined,
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
        setError(data.error || 'Грешка при обновяване на продукта');
        return;
      }

      setSuccess('Продуктът е обновен успешно!');
      setTimeout(() => router.push('/admin/products'), 1500);
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
        <Link href="/admin/products" className="btn btn-primary">
          Обратно към продукти
        </Link>
      </div>
    );
  }

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
            Редактиране на продукт
          </h1>
          <p className="text-[var(--muted)]">
            {formData.nameBg}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
            {success}
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
                </div>

                <div>
                  <label className="label">Описание (BG) *</label>
                  <textarea
                    name="descriptionBg"
                    value={formData.descriptionBg}
                    onChange={handleChange}
                    rows={5}
                    className="input resize-none"
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
                  />
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
            </div>

            {/* Actions */}
            <div className="card p-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
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
