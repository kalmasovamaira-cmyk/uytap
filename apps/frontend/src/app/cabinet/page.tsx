'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingsApi, statsApi } from '@/lib/api';
import { Listing } from '@/types';

export default function CabinetPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!token || !u) { router.push('/auth/login'); return; }
    const parsedUser = JSON.parse(u);
    setUser(parsedUser);

    Promise.all([
      listingsApi.getMy(token) as Promise<Listing[]>,
      statsApi.getMy(token),
    ]).then(([l, s]: any) => {
      setListings(l);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Удалить это объявление?')) return;
    const token = localStorage.getItem('token')!;
    await listingsApi.delete(id, token);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#00A661] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
          <p className="text-gray-500 text-sm">Добро пожаловать, {user?.name}!</p>
        </div>
        <Link href="/listings/create" className="btn-primary text-sm">
          + Разместить объявление
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Объявлений', value: stats?.totalListings || listings.length, icon: '📋', color: 'bg-blue-50 text-blue-600' },
          { label: 'Активных', value: stats?.activeListings || listings.filter(l => l.status === 'active').length, icon: '✅', color: 'bg-green-50 text-green-600' },
          { label: 'Просмотров', value: stats?.totalViews || 0, icon: '👁', color: 'bg-purple-50 text-purple-600' },
          { label: 'Избранное', value: '—', icon: '❤️', color: 'bg-red-50 text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="text-2xl font-black text-gray-900">{String(s.value)}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/cabinet/listings', label: 'Мои объявления', icon: '📋' },
          { href: '/cabinet/favorites', label: 'Избранное', icon: '❤️' },
          { href: '/cabinet/messages', label: 'Сообщения', icon: '💬' },
          { href: '/cabinet/profile', label: 'Профиль', icon: '👤' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-[#00A661] hover:shadow-md transition-all duration-200 text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
            <div className="text-sm font-medium text-gray-700">{item.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Мои объявления</h2>
          <Link href="/cabinet/listings" className="text-sm text-[#00A661] hover:underline">Все →</Link>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 mb-4">У вас пока нет объявлений</p>
            <Link href="/listings/create" className="btn-primary inline-flex text-sm">Разместить объявление</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {listings.slice(0, 5).map(listing => {
              const mainPhoto = listing.photos?.find(p => p.isMain) || listing.photos?.[0];
              return (
                <div key={listing.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {mainPhoto ? <img src={mainPhoto.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/listings/${listing.id}`} className="text-sm font-medium text-gray-900 hover:text-[#00A661] line-clamp-1">{listing.title}</Link>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm font-bold text-[#00A661]">{Number(listing.price).toLocaleString()} ₸</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${listing.status === 'active' ? 'badge-active' : listing.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                        {listing.status === 'active' ? 'Активно' : listing.status === 'pending' ? 'На проверке' : listing.status}
                      </span>
                      <span className="text-xs text-gray-400">{listing.views} просм.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/listings/${listing.id}/edit`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>
                    <button onClick={() => handleDeleteListing(listing.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
