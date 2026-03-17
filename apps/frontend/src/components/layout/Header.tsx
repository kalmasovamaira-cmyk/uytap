'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  FileText, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  PlusCircle
} from 'lucide-react';

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
    <header className={`sticky top-0 transition-all duration-300 z-[100] ${scrolled ? 'glass shadow-lg py-2' : 'bg-white border-b border-slate-100 py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">Ү</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none text-slate-900 tracking-tight">UyTap<span className="text-primary">.kz</span></span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Real Estate App</span>
            </div>
          </Link>

          {/* Nav links - desktop */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/listings?dealType=sale" className="btn-ghost text-sm font-semibold text-slate-600 hover:text-primary">Продажа</Link>
            <Link href="/listings?dealType=rent" className="btn-ghost text-sm font-semibold text-slate-600 hover:text-primary">Аренда</Link>
            <Link href="/listings?categoryId=new-buildings" className="btn-ghost text-sm font-semibold text-slate-600 hover:text-primary">Новостройки</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/listings/create"
              className="hidden md:flex btn-primary text-sm py-2.5 px-5 shadow-lg shadow-primary/25 active:shadow-none"
            >
              <PlusCircle size={18} />
              Разместить
            </Link>

            {user ? (
              <div className="relative group/menu">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                    <User size={18} />
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-slate-700">{user.name}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-fade-in divide-y divide-slate-50">
                    <div className="px-4 py-3 mb-1">
                      <p className="text-xs text-slate-400 font-medium uppercase">Личный кабинет</p>
                    </div>
                    <div>
                      <Link href="/cabinet" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors">
                        <LayoutDashboard size={18} className="text-slate-400" /> Мой кабинет
                      </Link>
                      <Link href="/cabinet/listings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors">
                        <FileText size={18} className="text-slate-400" /> Мои объявления
                      </Link>
                      <Link href="/cabinet/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors">
                        <Heart size={18} className="text-slate-400" /> Избранное
                      </Link>
                      <Link href="/cabinet/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors">
                        <MessageSquare size={18} className="text-slate-400" /> Сообщения
                      </Link>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-[13px] font-bold text-primary transition-colors">
                        <Settings size={18} /> Админ-панель
                      </Link>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-[13px] font-bold text-red-500 transition-colors text-left">
                      <LogOut size={18} /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-secondary text-sm py-2.5 px-6 border border-primary/20 hover:border-primary">
                Войти
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-2 animate-fade-in shadow-xl">
          <Link href="/listings?dealType=sale" className="block p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">Продажа</Link>
          <Link href="/listings?dealType=rent" className="block p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">Аренда</Link>
          <Link href="/listings?categoryId=new-buildings" className="block p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">Новостройки</Link>
          <hr className="border-slate-100" />
          <Link href="/listings/create" className="flex items-center gap-2 p-3 rounded-xl bg-primary text-white font-bold justify-center">
            <PlusCircle size={18} /> Разместить
          </Link>
        </div>
      )}
    </header>
  );
}
