'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingsApi, favoritesApi } from '@/lib/api';
import { Listing } from '@/types';

function formatPrice(price: number, currency = 'KZT') {
  if (currency === 'KZT') {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} млн ₸`;
    return `${price.toLocaleString()} ₸`;
  }
  return `$${price.toLocaleString()}`;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    listingsApi.getOne(id).then((data: any) => {
      setListing(data);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    await favoritesApi.toggle(id, token);
    setIsFavorited(!isFavorited);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="skeleton h-10 w-3/4 rounded mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 skeleton aspect-video rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">Объявление не найдено</h1>
        <Link href="/listings" className="btn-primary inline-flex mt-4">← Вернуться к объявлениям</Link>
      </div>
    );
  }

  const photos = listing.photos || [];
  const mainPhoto = photos[activePhoto];

  const conditionLabels: Record<string, string> = {
    new: 'Новое', good: 'Хорошее', renovation_needed: 'Требует ремонта', euro: 'Евроремонт', design: 'Дизайнерский'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#00A661]">Главная</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-[#00A661]">Объявления</Link>
        {listing.city && <><span>/</span><Link href={`/listings?cityId=${listing.cityId}`} className="hover:text-[#00A661]">{listing.city.nameRu}</Link></>}
        {listing.category && <><span>/</span><span>{listing.category.nameRu}</span></>}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Photo gallery + details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main photo */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video relative group">
            {mainPhoto ? (
              <img src={mainPhoto.url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
            )}
            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <button onClick={() => setActivePhoto(p => Math.max(0, p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ‹
                </button>
                <button onClick={() => setActivePhoto(p => Math.min(photos.length - 1, p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ›
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-md">
              {activePhoto + 1}/{Math.max(photos.length, 1)}
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo, i) => (
                <button key={photo.id} onClick={() => setActivePhoto(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activePhoto ? 'border-[#00A661]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & basic info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${listing.dealType === 'sale' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {listing.dealType === 'sale' ? 'Продажа' : listing.dealType === 'rent' ? 'Аренда' : 'Посуточно'}
                  </span>
                  {listing.isNewBuilding && <span className="bg-[#E6F7EF] text-[#00A661] text-xs font-semibold px-2.5 py-1 rounded-md">Новостройка</span>}
                  {listing.isPremium && <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-md">⭐ ТОП</span>}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                {listing.address && (
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                    <svg className="w-4 h-4 text-[#00A661]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {listing.address}{listing.city ? `, ${listing.city.nameRu}` : ''}
                  </p>
                )}
              </div>
              <button onClick={toggleFavorite}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isFavorited ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}>
                <svg className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="text-3xl font-black text-gray-900 mb-1">
              {formatPrice(listing.price, listing.currency)}
              {listing.dealType !== 'sale' && <span className="text-gray-400 text-base font-normal">/мес</span>}
            </div>
            {listing.area && <p className="text-gray-500 text-sm">{(listing.price / listing.area).toFixed(0)} ₸/м²</p>}
          </div>

          {/* Properties grid */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Характеристики</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Площадь', value: listing.area ? `${listing.area} м²` : null, icon: '📐' },
                { label: 'Комнат', value: listing.rooms ? `${listing.rooms}` : null, icon: '🛏' },
                { label: 'Этаж', value: listing.floor && listing.floorsTotal ? `${listing.floor} из ${listing.floorsTotal}` : listing.floor ? `${listing.floor}` : null, icon: '🏢' },
                { label: 'Год постройки', value: listing.yearBuilt ? `${listing.yearBuilt}` : null, icon: '📅' },
                { label: 'Состояние', value: listing.condition ? conditionLabels[listing.condition] : null, icon: '✨' },
                { label: 'Тип', value: listing.category?.nameRu || null, icon: '🏘️' },
              ].filter(p => p.value).map(prop => (
                <div key={prop.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xl mb-1">{prop.icon}</div>
                  <div className="text-xs text-gray-500">{prop.label}</div>
                  <div className="font-semibold text-gray-900 text-sm">{prop.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-3">Описание</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          )}

          {/* Map placeholder */}
          {listing.lat && listing.lng && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-3">На карте</h2>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">🗺️</div>
                  <p className="text-sm">Координаты: {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}</p>
                  <a
                    href={`https://yandex.kz/maps/?pt=${listing.lng},${listing.lat}&z=15&l=map`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00A661] hover:underline text-sm mt-1 inline-block"
                  >
                    Открыть в Яндекс.Картах →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Contact sidebar */}
        <div className="space-y-4">
          {/* Contact card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            {listing.user && (
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-[#00A661] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {listing.user.name?.[0]?.toUpperCase() || 'А'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{listing.user.name || 'Владелец'}</p>
                  <p className="text-xs text-gray-500">Частное лицо</p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {listing.views} просмотров
              </span>
              <span>•</span>
              <span>{new Date(listing.createdAt).toLocaleDateString('ru-KZ')}</span>
            </div>

            {/* Phone button */}
            {listing.contactPhone && (
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="btn-primary w-full justify-center mb-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {showPhone ? listing.contactPhone : 'Показать номер телефона'}
              </button>
            )}

            {/* WhatsApp button */}
            {listing.contactWhatsapp && (
              <a
                href={`https://wa.me/${listing.contactWhatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm mb-3"
              >
                <span>📱</span> WhatsApp
              </a>
            )}

            {/* Telegram button */}
            {listing.contactTelegram && (
              <a
                href={`https://t.me/${listing.contactTelegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#229ED9] hover:bg-[#1a8abf] text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm mb-3"
              >
                <span>✈️</span> Telegram
              </a>
            )}

            <Link href={`/cabinet/messages?listingId=${listing.id}&userId=${listing.userId}`}
              className="btn-secondary w-full justify-center text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Написать сообщение
            </Link>
          </div>

          {/* Safety tips */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <h4 className="font-semibold text-amber-800 text-sm mb-2">⚠️ Советы по безопасности</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Не переводите деньги заранее</li>
              <li>• Встречайтесь в публичных местах</li>
              <li>• Проверяйте документы на недвижимость</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
