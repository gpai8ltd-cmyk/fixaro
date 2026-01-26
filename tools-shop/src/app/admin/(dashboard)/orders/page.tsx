'use client';

import { useEffect, useState } from 'react';
import { Package, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/orders?status=${statusFilter}` : '/api/orders';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data);
    } catch {
      setError('Грешка при зареждане на поръчките');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Поръчки</h1>
          <p className="text-[var(--muted)]">Управлявайте поръчките от клиенти</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">Всички статуси</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Зареждане...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {statusFilter ? 'Няма поръчки с този статус' : 'Все още няма поръчки'}
          </h2>
          <p className="text-[var(--muted)]">
            Когато клиентите направят поръчки, те ще се появят тук.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Номер</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Клиент</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Телефон</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Дата</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Статус</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Сума</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{order.customerName}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{order.customerPhone}</td>
                    <td className="px-4 py-3 text-[var(--muted)] text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {order.total.toFixed(2)} лв.
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
                      >
                        <Eye size={16} />
                        Преглед
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
