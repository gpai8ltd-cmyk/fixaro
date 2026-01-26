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

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Изчакваща',
  CONFIRMED: 'Потвърдена',
  PROCESSING: 'Обработва се',
  SHIPPED: 'Изпратена',
  DELIVERED: 'Доставена',
  CANCELLED: 'Отказана',
  RETURNED: 'Върната',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, ordersRes, customersRes] = await Promise.all([
          fetch('/api/products?active=all'),
          fetch('/api/categories'),
          fetch('/api/orders'),
          fetch('/api/customers'),
        ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const orders = await ordersRes.json();
        const customers = await customersRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          customers: Array.isArray(customers) ? customers.length : 0,
        });

        // Get last 5 orders
        if (Array.isArray(orders)) {
          setRecentOrders(orders.slice(0, 5));
        }
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Добре дошли в админ панела
        </h1>
        <p className="text-[var(--muted)]">
          Управлявайте вашия магазин от тук.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Последни поръчки
            </h2>
            <Link href="/admin/orders" className="text-sm text-[var(--primary)] hover:underline">
              Виж всички
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded"></div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-[var(--muted)] text-center py-4">Няма поръчки</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{order.orderNumber}</p>
                    <p className="text-sm text-[var(--muted)]">{order.customerName} • {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total.toFixed(2)} лв.</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
