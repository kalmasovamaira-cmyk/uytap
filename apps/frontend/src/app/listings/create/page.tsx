'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listingsApi, locationsApi, categoriesApi } from '@/lib/api';
import { City, Category } from '@/types';

const STEPS = ['Тип и город', 'Детали', 'Описание', 'Контакты'];

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    categoryId: '',
    dealType: 'sale',
    cityId: '',
    districtId: '',
    title: '',
    description: '',
    price: '',
    currency: 'KZT',
    area: '',
    rooms: '',
    floor: '',
    floorsTotal: '',
    yearBuilt: '',
    condition: '',
    address: '',
    lat: '',
    lng: '',
    isNewBuilding: false,
    contactPhone: '',
    contactWhatsapp: '',
    contactTelegram: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    Promise.all([locationsApi.getCities(), categoriesApi.getAll()]).then(([c, cats]: any) => {
      setCities(c);
      setCategories(cats);
    });
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    if (!form.categoryId || !form.cityId || !form.title || !form.price) {
      setError('Заполните все обязательные поля');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        area: form.area ? Number(form.area) : undefined,
        rooms: form.rooms ? Number(form.rooms) : undefined,
        floor: form.floor ? Number(form.floor) : undefined,
        floorsTotal: form.floorsTotal ? Number(form.floorsTotal) : undefined,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        condition: form.condition || undefined,
        districtId: form.districtId || undefined,
      };
      const listing: any = await listingsApi.create(payload, token);
      router.push(`/listings/${listing.id}`);
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании объявления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Разместить объявление</h1>
      <p className="text-gray-500 text-sm mb-6">Бесплатно и быстро — займёт 2 минуты</p>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${i <= step ? 'bg-[#00A661] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#00A661]' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-[#00A661]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Step 0: Type & City */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Тип сделки *</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'sale', l: '🏷️ Продажа' }, { v: 'rent', l: '🔑 Аренда' }, { v: 'rent_daily', l: '📅 Посуточно' }].map(t => (
                  <button key={t.v} type="button" onClick={() => set('dealType', t.v)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${form.dealType === t.v ? 'border-[#00A661] bg-[#E6F7EF] text-[#00A661]' : 'border-gray-200 hover:border-gray-300'}`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Категория *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => set('categoryId', cat.id)}
                    className={`py-3 px-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${form.categoryId === cat.id ? 'border-[#00A661] bg-[#E6F7EF] text-[#00A661]' : 'border-gray-200 hover:border-gray-300'}`}>
                    {cat.nameRu}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Город *</label>
              <select className="input" value={form.cityId} onChange={e => set('cityId', e.target.value)} required>
                <option value="">Выберите город</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Адрес</label>
              <input className="input" placeholder="Улица, дом" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Заголовок объявления *</label>
              <input className="input" placeholder="Например: 2-комнатная квартира в центре" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Цена *</label>
                <input className="input" type="number" placeholder="15 000 000" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Валюта</label>
                <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
                  <option value="KZT">₸ Тенге</option>
                  <option value="USD">$ Доллар</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Площадь, м²</label>
                <input className="input" type="number" placeholder="50" value={form.area} onChange={e => set('area', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Комнат</label>
                <input className="input" type="number" placeholder="2" value={form.rooms} onChange={e => set('rooms', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Этаж</label>
                <input className="input" type="number" placeholder="5" value={form.floor} onChange={e => set('floor', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Этажей в доме</label>
                <input className="input" type="number" placeholder="9" value={form.floorsTotal} onChange={e => set('floorsTotal', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Год постройки</label>
                <input className="input" type="number" placeholder="2010" value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Состояние</label>
                <select className="input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                  <option value="">Выбрать</option>
                  <option value="new">Новое</option>
                  <option value="euro">Евроремонт</option>
                  <option value="good">Хорошее</option>
                  <option value="design">Дизайнерский</option>
                  <option value="renovation_needed">Требует ремонта</option>
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#00A661] rounded" checked={form.isNewBuilding} onChange={e => set('isNewBuilding', e.target.checked)} />
                <span className="text-sm font-medium text-gray-700">Новостройка</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Описание</label>
              <textarea
                className="input min-h-[180px] resize-y"
                placeholder="Расскажите подробнее: удобства, инфраструктура, состояние, особенности жилья..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Contacts */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Номер телефона</label>
              <input className="input" type="tel" placeholder="+7 700 123 45 67" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp</label>
              <input className="input" type="tel" placeholder="+7 700 123 45 67" value={form.contactWhatsapp} onChange={e => set('contactWhatsapp', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Telegram</label>
              <input className="input" placeholder="@username" value={form.contactTelegram} onChange={e => set('contactTelegram', e.target.value)} />
            </div>
            <div className="bg-[#E6F7EF] border border-[#00A661]/20 rounded-xl p-4">
              <p className="text-sm text-[#00A661] font-medium">✅ Размещение бесплатно!</p>
              <p className="text-xs text-gray-600 mt-1">Ваше объявление появится на сайте сразу после размещения.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1 justify-center">
            ← Назад
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 justify-center">
            Далее →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🚀 Разместить объявление'}
          </button>
        )}
      </div>
    </div>
  );
}
