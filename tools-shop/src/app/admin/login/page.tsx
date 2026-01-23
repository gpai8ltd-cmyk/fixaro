'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Грешка при вход');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Грешка при свързване със сървъра');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--secondary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[var(--primary)]">Tools</span>Shop Admin
          </h1>
        </div>

        {/* Login form */}
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="label">Имейл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Парола</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <span>...</span>
              ) : (
                <LogIn size={20} />
              )}
              {isLoading ? 'Влизане...' : 'Вход'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
