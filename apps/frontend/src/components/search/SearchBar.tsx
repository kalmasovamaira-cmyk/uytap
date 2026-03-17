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
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      {/* Deal type tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { v: '', l: 'Все' }, 
          { v: 'sale', l: 'Купить' }, 
          { v: 'rent', l: 'Арендовать' }
        ].map(t => (
          <button key={t.v} type="button"
            onClick={() => set('dealType', t.v)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${values.dealType === t.v ? 'search-tab-active' : 'search-tab-inactive'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Main search row */}
      <div className="relative group/search">
        <div className="flex flex-col md:flex-row gap-0 bg-white rounded-2xl md:rounded-[24px] overflow-hidden shadow-2xl border border-white/20">
          {/* City select */}
          <div className="flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 min-w-[160px] hover:bg-slate-50 transition-colors">
            <span className="text-[#00A661]">📍</span>
            <select
              className="flex-1 py-4 px-2 text-slate-700 bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none"
              value={values.cityId}
              onChange={e => set('cityId', e.target.value)}
            >
              <option value="">Все города</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
            </select>
          </div>

          {/* Text input */}
          <div className="flex-1 flex items-center px-4 hover:bg-slate-50 transition-colors">
            <input
              type="text"
              placeholder="Поиск по названию, адресу или ЖК..."
              className="flex-1 py-4 text-slate-900 outline-none text-sm font-medium bg-transparent placeholder:text-slate-400"
              value={values.q}
              onChange={e => set('q', e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-black px-10 py-4 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            <svg className="w-5 h-5 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="md:inline">Найти</span>
          </button>
        </div>
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
