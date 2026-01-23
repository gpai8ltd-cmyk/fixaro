'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  products: number;
  categories: number;
  orders: number;
  customers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?active=all'),
          fetch('/api/categories'),
        ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          orders: 0,
          customers: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsCards = [
    {
      name: 'Продукти',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
    },
    {
      name: 'Категории',
      value: stats.categories,
      icon: FolderOpen,
      href: '/admin/categories',
    },
    {
      name: 'Поръчки',
      value: stats.orders,
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    {
      name: 'Клиенти',
      value: stats.customers,
      icon: Users,
      href: '/admin/customers',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Добре дошли в админ панела
        </h1>
        <p className="text-[var(--muted)]">
          Управлявайте вашия магазин от тук.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <stat.icon className="text-[var(--primary)]" size={24} />
              </div>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </p>
              )}
              <p className="text-sm text-[var(--muted)]">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
          Бързи действия
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn btn-primary">
            <Package size={18} />
            Добави продукт
          </Link>
          <Link href="/admin/categories/new" className="btn btn-secondary">
            <FolderOpen size={18} />
            Добави категория
          </Link>
        </div>
      </div>

      {/* Info message */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Забележка:</strong> Поръчките и клиентите ще се показват когато магазинът е активен и има реални данни.
        </p>
      </div>
    </div>
  );
}
