'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  nameBg: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  isActive: boolean;
  images: string;
  category: {
    nameBg: string;
  } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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
    fetch('/api/products?active=all')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError('Грешка при зареждане на продуктите');
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

  const filteredProducts = products.filter(p =>
    p.nameBg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този продукт?')) return;

    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setSuccess('Продуктът е изтрит успешно');
      } else {
        setError(data.error || 'Грешка при изтриване на продукта');
      }
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    }
    setOpenMenu(null);
  };

  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return parsed[0] || null;
    } catch {
      return null;
    }
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Продукти</h1>
          <p className="text-[var(--muted)]">Управлявайте вашите продукти ({products.length})</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={18} />
          Добави продукт
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

      <div className="card p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Търси продукти..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="card p-4 mb-4 bg-[var(--primary)]/5 border-[var(--primary)]">
          <div className="flex items-center justify-between">
            <span className="text-sm">Избрани: <strong>{selectedProducts.length}</strong> продукта</span>
            <button
              onClick={() => setSelectedProducts([])}
              className="btn btn-sm btn-outline"
            >
              Отмени
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-[var(--border)]">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300"
                    aria-label="Избери всички"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-[var(--muted)]">Продукт</th>
                <th className="p-4 text-left text-sm font-medium text-[var(--muted)] hidden md:table-cell">Категория</th>
                <th className="p-4 text-left text-sm font-medium text-[var(--muted)]">Цена</th>
                <th className="p-4 text-left text-sm font-medium text-[var(--muted)] hidden sm:table-cell">Наличност</th>
                <th className="p-4 text-left text-sm font-medium text-[var(--muted)] hidden sm:table-cell">Статус</th>
                <th className="p-4 text-right text-sm font-medium text-[var(--muted)]">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProducts.map((product) => {
                const image = getFirstImage(product.images);
                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-slate-300"
                        aria-label={`Избери ${product.nameBg}`}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {image ? (
                            <Image src={image} alt={product.nameBg} width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--foreground)] truncate">{product.nameBg}</p>
                          <p className="text-sm text-[var(--muted)] md:hidden">{product.category?.nameBg || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-[var(--foreground)]">{product.category?.nameBg || '-'}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-[var(--foreground)]">{product.price.toFixed(2)} лв.</span>
                        {product.oldPrice && (
                          <span className="text-sm text-[var(--muted)] line-through ml-2">{product.oldPrice.toFixed(2)} лв.</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${
                        product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock} бр.
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`badge ${product.isActive ? 'badge-success' : 'bg-slate-100 text-slate-600'}`}>
                        {product.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative" ref={openMenu === product.id ? menuRef : null}>
                        <button
                          onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                          aria-expanded={openMenu === product.id}
                          aria-haspopup="menu"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === product.id && (
                          <div
                            className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[160px] z-10"
                            role="menu"
                          >
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                              role="menuitem"
                            >
                              <Edit size={16} />
                              Редактирай
                            </Link>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                              role="menuitem"
                            >
                              <Eye size={16} />
                              Виж в сайта
                            </Link>
                            <hr className="my-1 border-[var(--border)]" />
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              role="menuitem"
                            >
                              <Trash2 size={16} />
                              Изтрий
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[var(--muted)]">
              {products.length === 0 ? 'Няма добавени продукти' : 'Няма намерени продукти'}
            </p>
            {products.length === 0 && (
              <Link href="/admin/products/new" className="btn btn-primary mt-4">
                <Plus size={18} />
                Добави първия продукт
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
