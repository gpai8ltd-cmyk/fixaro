'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  courier: string;
  courierOffice: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string | null;
  adminNotes: string | null;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Изчакваща', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMED', label: 'Потвърдена', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'Обработва се', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'SHIPPED', label: 'Изпратена', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'DELIVERED', label: 'Доставена', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Отказана', color: 'bg-red-100 text-red-800' },
  { value: 'RETURNED', label: 'Върната', color: 'bg-gray-100 text-gray-800' },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.trackingNumber || '');
      setAdminNotes(data.adminNotes || '');
    } catch {
      setError('Поръчката не е намерена');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, adminNotes }),
      });

      if (!res.ok) throw new Error('Failed to update');

      const updated = await res.json();
      setOrder(updated);
      setSuccess('Поръчката е обновена успешно');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Грешка при запазване');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600">{error}</p>
        <Link href="/admin/orders" className="btn btn-secondary mt-4">
          Назад към поръчките
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Поръчка {order.orderNumber}
            </h1>
            <p className="text-[var(--muted)]">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {saving ? 'Запазване...' : 'Запази'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Продукти ({order.items.length})
            </h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{item.productName}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {item.quantity} x {item.productPrice.toFixed(2)} лв.
                    </p>
                  </div>
                  <p className="font-medium">{item.subtotal.toFixed(2)} лв.</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Междинна сума</span>
                <span>{order.subtotal.toFixed(2)} лв.</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Доставка</span>
                <span>{order.deliveryFee === 0 ? 'Безплатна' : `${order.deliveryFee.toFixed(2)} лв.`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Общо</span>
                <span>{order.total.toFixed(2)} лв.</span>
              </div>
            </div>
          </div>

          {/* Customer notes */}
          {order.notes && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-2">Бележка от клиента</h2>
              <p className="text-[var(--muted)]">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right column - Info & Actions */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Статус</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Клиент
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Име:</span> {order.customerName}</p>
              <p><span className="text-[var(--muted)]">Телефон:</span> {order.customerPhone}</p>
              {order.customerEmail && (
                <p><span className="text-[var(--muted)]">Email:</span> {order.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Delivery */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck size={20} />
              Доставка
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Куриер:</span> {order.courier}</p>
              <p><span className="text-[var(--muted)]">Град:</span> {order.deliveryCity}</p>
              <p><span className="text-[var(--muted)]">Адрес:</span> {order.deliveryAddress}</p>
              {order.courierOffice && (
                <p><span className="text-[var(--muted)]">Офис:</span> {order.courierOffice}</p>
              )}
            </div>
          </div>

          {/* Tracking */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Проследяване</h2>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Номер за проследяване"
              className="input w-full"
            />
          </div>

          {/* Admin notes */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Вътрешни бележки</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Бележки за екипа..."
              rows={3}
              className="input w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
