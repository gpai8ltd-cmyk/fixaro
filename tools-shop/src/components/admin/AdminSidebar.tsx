'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { name: 'Табло', href: '/admin', icon: LayoutDashboard },
  { name: 'Продукти', href: '/admin/products', icon: Package },
  { name: 'Категории', href: '/admin/categories', icon: FolderTree },
  { name: 'Поръчки', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Клиенти', href: '/admin/customers', icon: Users },
  { name: 'Статистики', href: '/admin/stats', icon: BarChart3 },
  { name: 'AI Асистент', href: '/admin/assistant', icon: Bot },
  { name: 'Chatbot разходи', href: '/admin/chatbot-costs', icon: DollarSign },
  { name: 'Промоции', href: '/admin/promotions', icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Wrench className="text-white" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Fixaro</span>
            <span className="block text-xs text-slate-400">Админ панел</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Settings size={20} />
          <span>Виж сайта</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Изход</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-[var(--secondary)] text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--secondary-dark)] min-h-screen fixed left-0 top-0">
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--secondary-dark)] flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
