'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locationsApi, categoriesApi } from '@/lib/api';
import { City, Category } from '@/types';

interface Props {
  initialValues?: {
    q?: string;
    cityId?: string;
    dealType?: string;
    categoryId?: string;
    priceMin?: string;
    priceMax?: string;
    rooms?: string;
  };
  variant?: 'hero' | 'sidebar';
  onSearch?: (params: URLSearchParams) => void;
}

export function SearchBar({ initialValues = {}, variant = 'hero', onSearch }: Props) {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState({
    q: initialValues.q || '',
    cityId: initialValues.cityId || '',
    dealType: initialValues.dealType || '',
    categoryId: initialValues.categoryId || '',
    priceMin: initialValues.priceMin || '',
    priceMax: initialValues.priceMax || '',
    rooms: initialValues.rooms || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([locationsApi.getCities(), categoriesApi.getAll()]).then(([c, cats]: any) => {
      setCities(c);
      setCategories(cats);
    });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (onSearch) {
      onSearch(params);
    } else {
      router.push(`/listings?${params.toString()}`);
    }
  };

  const set = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }));

  if (variant === 'sidebar') {
    return (
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Тип сделки</label>
          <select className="input" value={values.dealType} onChange={e => set('dealType', e.target.value)}>
            <option value="">Все</option>
            <option value="sale">Продажа</option>
            <option value="rent">Аренда</option>
            <option value="rent_daily">Посуточно</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Категория</label>
          <select className="input" value={values.categoryId} onChange={e => set('categoryId', e.target.value)}>
            <option value="">Все типы</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Город</label>
          <select className="input" value={values.cityId} onChange={e => set('cityId', e.target.value)}>
            <option value="">Все города</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Цена, ₸</label>
          <div className="flex gap-2">
            <input className="input" placeholder="от" type="number" value={values.priceMin} onChange={e => set('priceMin', e.target.value)} />
            <input className="input" placeholder="до" type="number" value={values.priceMax} onChange={e => set('priceMax', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Комнат</label>
          <div className="flex gap-2">
            {['1', '2', '3', '4', '5+'].map(r => (
              <button key={r} type="button"
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${values.rooms === (r === '5+' ? '5' : r) ? 'bg-[#00A661] text-white border-[#00A661]' : 'border-gray-200 hover:border-[#00A661]'}`}
                onClick={() => set('rooms', r === '5+' ? '5' : r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Найти
        </button>
      </form>
    );
  }

  // Hero variant
  return (
    <form onSubmit={handleSearch} className="w-full">
      {/* Deal type tabs */}
      <div className="flex gap-2 mb-4">
        {[{ v: '', l: 'Все' }, { v: 'sale', l: 'Купить' }, { v: 'rent', l: 'Арендовать' }].map(t => (
          <button key={t.v} type="button"
            onClick={() => set('dealType', t.v)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${values.dealType === t.v ? 'bg-white text-[#00A661] shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Main search row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex bg-white rounded-2xl overflow-hidden shadow-xl">
          {/* City select */}
          <select
            className="px-4 py-4 text-gray-700 border-r border-gray-100 bg-transparent text-sm outline-none min-w-[130px] cursor-pointer"
            value={values.cityId}
            onChange={e => set('cityId', e.target.value)}
          >
            <option value="">📍 Все города</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
          </select>

          {/* Text input */}
          <input
            type="text"
            placeholder="Поиск: квартира, дом, адрес..."
            className="flex-1 px-4 py-4 text-gray-900 outline-none text-sm bg-transparent"
            value={values.q}
            onChange={e => set('q', e.target.value)}
          />
        </div>

        <button type="submit"
          className="bg-[#00A661] hover:bg-[#008A50] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-sm shadow-xl hover:shadow-green-500/30 hover:shadow-2xl active:scale-95 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Найти
        </button>
      </div>

      {/* Additional filters toggle */}
      <button type="button" onClick={() => setShowFilters(!showFilters)}
        className="mt-3 text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors">
        <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Расширенный поиск
      </button>

      {showFilters && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
          <select className="input text-sm py-2.5" value={values.categoryId} onChange={e => set('categoryId', e.target.value)}>
            <option value="">Тип жилья</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
          </select>
          <select className="input text-sm py-2.5" value={values.rooms} onChange={e => set('rooms', e.target.value)}>
            <option value="">Комнат</option>
            {['1', '2', '3', '4', '5'].map(r => <option key={r} value={r}>{r}{r === '5' ? '+' : ''} комн.</option>)}
          </select>
          <input className="input text-sm py-2.5" type="number" placeholder="Цена от (₸)" value={values.priceMin} onChange={e => set('priceMin', e.target.value)} />
          <input className="input text-sm py-2.5" type="number" placeholder="Цена до (₸)" value={values.priceMax} onChange={e => set('priceMax', e.target.value)} />
        </div>
      )}
    </form>
  );
}
