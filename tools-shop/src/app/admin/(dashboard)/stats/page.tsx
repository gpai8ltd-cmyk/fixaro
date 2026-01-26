'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, ShoppingCart } from 'lucide-react';

interface StatsData {
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  topProducts: { name: string; count: number }[];
  totalOrders: number;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Изчакващи',
  CONFIRMED: 'Потвърдени',
  PROCESSING: 'Обработват се',
  SHIPPED: 'Изпратени',
  DELIVERED: 'Доставени',
  CANCELLED: 'Отказани',
  RETURNED: 'Върнати',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-blue-500',
  PROCESSING: 'bg-indigo-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  RETURNED: 'bg-gray-500',
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();

        if (!Array.isArray(orders)) {
          setStats({ totalRevenue: 0, ordersByStatus: {}, topProducts: [], totalOrders: 0 });
          return;
        }

        // Calculate total revenue (only delivered orders)
        const totalRevenue = orders
          .filter((o: { status: string }) => o.status === 'DELIVERED')
          .reduce((sum: number, o: { total: number }) => sum + o.total, 0);

        // Orders by status
        const ordersByStatus: Record<string, number> = {};
        orders.forEach((o: { status: string }) => {
          ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
        });

        // Top products by order count
        const productCounts: Record<string, number> = {};
        orders.forEach((o: { items: { productName: string; quantity: number }[] }) => {
          o.items?.forEach((item) => {
            productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
          });
        });

        const topProducts = Object.entries(productCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        setStats({
          totalRevenue,
          ordersByStatus,
          topProducts,
          totalOrders: orders.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!stats || stats.totalOrders === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Статистики</h1>
          <p className="text-[var(--muted)]">Преглед на продажбите и активността</p>
        </div>
        <div className="card p-12 text-center">
          <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Все още няма данни
          </h2>
          <p className="text-[var(--muted)]">
            Статистиките ще се появят когато има поръчки.
          </p>
        </div>
      </div>
    );
  }

  const maxStatusCount = Math.max(...Object.values(stats.ordersByStatus), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Статистики</h1>
        <p className="text-[var(--muted)]">Преглед на продажбите и активността</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Общ приход</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {stats.totalRevenue.toFixed(2)} лв.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Общо поръчки</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Доставени</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {stats.ordersByStatus.DELIVERED || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Поръчки по статус</h2>
          <div className="space-y-3">
            {Object.entries(STATUS_LABELS).map(([status, label]) => {
              const count = stats.ordersByStatus[status] || 0;
              const percentage = (count / maxStatusCount) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--foreground)]">{label}</span>
                    <span className="text-[var(--muted)]">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${STATUS_COLORS[status]} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Топ 5 продукти</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-[var(--muted)] text-center py-4">Няма данни</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-sm font-medium text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] truncate">{product.name}</p>
                  </div>
                  <span className="text-[var(--muted)]">{product.count} бр.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
