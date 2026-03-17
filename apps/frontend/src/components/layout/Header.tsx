'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-md' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#00A661] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg">Ү</span>
            </div>
            <span className="font-black text-xl text-gray-900">UyTap<span className="text-[#00A661]">.kz</span></span>
          </Link>

          {/* Nav links - desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/listings?dealType=sale" className="btn-ghost text-sm">Продажа</Link>
            <Link href="/listings?dealType=rent" className="btn-ghost text-sm">Аренда</Link>
            <Link href="/listings?categoryId=new-buildings" className="btn-ghost text-sm">Новостройки</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/listings/create"
              className="hidden sm:flex btn-primary text-sm py-2 px-4 animate-pulse-green"
            >
              <span className="text-lg">+</span>
              Разместить
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#00A661] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <Link href="/cabinet" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                      <span>🏠</span> Мой кабинет
                    </Link>
                    <Link href="/cabinet/listings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                      <span>📋</span> Мои объявления
                    </Link>
                    <Link href="/cabinet/favorites" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                      <span>❤️</span> Избранное
                    </Link>
                    <Link href="/cabinet/messages" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                      <span>💬</span> Сообщения
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-[#00A661] font-medium transition-colors">
                        <span>⚙️</span> Админ-панель
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition-colors">
                      <span>🚪</span> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">
                Войти
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
