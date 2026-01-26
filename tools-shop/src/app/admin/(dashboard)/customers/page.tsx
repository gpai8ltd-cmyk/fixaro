'use client';

import { useEffect, useState } from 'react';
import { Users, AlertCircle, Search } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  city: string | null;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCustomers(data);
    } catch {
      setError('Грешка при зареждане на клиентите');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Клиенти</h1>
          <p className="text-[var(--muted)]">Списък с всички клиенти</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Търсене..."
            className="input pl-10 w-full sm:w-64"
          />
        </div>
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
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {search ? 'Няма намерени клиенти' : 'Все още няма клиенти'}
          </h2>
          <p className="text-[var(--muted)]">
            Когато клиентите направят поръчка, те ще се появят тук.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Име</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Телефон</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Град</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Поръчки</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Общо</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Регистриран</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">{customer.name}</td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{customer.phone}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{customer.email || '-'}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{customer.city || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded-full text-sm">{customer.ordersCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {customer.totalSpent.toFixed(2)} лв.
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] text-sm">{formatDate(customer.createdAt)}</td>
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
