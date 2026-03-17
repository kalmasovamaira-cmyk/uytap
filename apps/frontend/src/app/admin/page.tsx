'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Listing, User } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!token || !u) { router.push('/auth/login'); return; }
    
    const parsedUser = JSON.parse(u);
    if (parsedUser.role !== 'admin') {
      router.push('/cabinet');
      return;
    }
    setUser(parsedUser);
    fetchData(activeTab, token);
  }, [activeTab]);

  const fetchData = async (tab: string, token: string) => {
    setLoading(true);
    try {
      if (tab === 'listings') {
        const res: any = await apiFetch('/admin/listings', { token });
        setData(res.items || res);
      } else if (tab === 'users') {
        const res: any = await apiFetch('/admin/users', { token });
        setData(res.items || res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleListingStatus = async (id: string, status: string) => {
    if (!confirm(`Изменить статус на ${status}?`)) return;
    const token = localStorage.getItem('token')!;
    await apiFetch(`/admin/listings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
    fetchData(activeTab, token);
  };

  const handleUserRole = async (id: string, role: string) => {
    if (!confirm(`Изменить роль на ${role}?`)) return;
    const token = localStorage.getItem('token')!;
    await apiFetch(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
      token,
    });
    fetchData(activeTab, token);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Админ-панель
          </h1>
          <p className="text-gray-500 text-sm mt-1">Управление платформой</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'listings', label: 'Объявления' },
          { id: 'users', label: 'Пользователи' },
          { id: 'categories', label: 'Категории' },
          { id: 'cities', label: 'Города' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === t.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'listings' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID / Название</th>
                <th className="px-6 py-4">Пользователь</th>
                <th className="px-6 py-4">Цена</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((l: any) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-xs">{l.title}</div>
                    <div className="text-xs text-gray-500">{l.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{l.user?.name || l.userId}</div>
                    <div className="text-xs text-gray-500">{l.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{l.price} {l.currency}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.status === 'active' ? 'bg-green-100 text-green-700' : l.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {l.status === 'pending' && (
                      <button onClick={() => handleListingStatus(l.id, 'active')} className="text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg font-medium">Одобрить</button>
                    )}
                    {(l.status === 'pending' || l.status === 'active') && (
                      <button onClick={() => handleListingStatus(l.id, 'rejected')} className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg font-medium">Отклонить</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'users' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Пользователь</th>
                <th className="px-6 py-4">Контакты</th>
                <th className="px-6 py-4">Дата регистрации</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-500">ID: {u.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{u.email}</div>
                    {u.phone && <div className="text-xs text-gray-500">{u.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="border-gray-300 rounded-lg text-sm py-1.5 px-3"
                      value={u.role}
                      onChange={(e) => handleUserRole(u.id, e.target.value)}
                      disabled={u.id === user.id}
                    >
                      <option value="user">User</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Этот раздел находится в разработке
          </div>
        )}
      </div>
    </div>
  );
}
