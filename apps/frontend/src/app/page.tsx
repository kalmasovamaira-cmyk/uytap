'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ListingCard } from '@/components/listings/ListingCard';
import { listingsApi, locationsApi, categoriesApi, statsApi } from '@/lib/api';
import { Listing, City, Category } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  apartment: '🏠', house: '🏡', land: '🌿', commercial: '🏢',
  'new-buildings': '🏗️', garage: '🚗',
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listingsApi.getFeatured() as Promise<Listing[]>,
      locationsApi.getCities() as Promise<City[]>,
      categoriesApi.getAll() as Promise<Category[]>,
      statsApi.getPublic() as Promise<any>,
    ]).then(([f, c, cats, s]) => {
      setFeatured(f);
      setCities(c.slice(0, 8));
      setCategories(cats);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient min-h-[560px] flex items-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A661]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#00A661]/20 border border-[#00A661]/30 text-[#00A661] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#00A661] rounded-full animate-pulse"></span>
              Бесплатное размещение объявлений
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Найдите своё
              <span className="text-[#00A661]"> идеальное</span>
              <br />жильё в Казахстане
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Крупнейший бесплатный маркетплейс недвижимости. Сотни тысяч объявлений по всему Казахстану.
            </p>

            {/* Search */}
            <SearchBar variant="hero" />

            {/* Stats chips */}
            {stats && (
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-[#00A661] font-bold text-lg">{stats.totalListings?.toLocaleString()}</span>
                  <span>объявлений</span>
                </div>
                <div className="w-px h-4 bg-white/20 self-center" />
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-[#00A661] font-bold text-lg">14</span>
                  <span>городов</span>
                </div>
                <div className="w-px h-4 bg-white/20 self-center" />
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-[#00A661] font-bold text-lg">100%</span>
                  <span>бесплатно</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Категории недвижимости</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/listings?categoryId=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-[#00A661] hover:bg-[#E6F7EF] transition-all duration-200 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {CATEGORY_ICONS[cat.slug] || '🏘️'}
                </span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.nameRu}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Свежие объявления</h2>
              <p className="section-subtitle">Актуальная недвижимость со всего Казахстана</p>
            </div>
            <Link href="/listings" className="btn-secondary hidden sm:flex py-2 px-4 text-sm">
              Все объявления →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/listings" className="btn-primary inline-flex">
              Показать все объявления
            </Link>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Недвижимость по городам</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/listings?cityId=${city.id}`}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-[#00A661] opacity-0 group-hover:opacity-20 transition-opacity" />
                <h3 className="font-bold text-lg">{city.nameRu}</h3>
                <p className="text-white/60 text-sm mt-1">{city.region}</p>
                <div className="mt-4 flex items-center gap-1 text-[#00A661] text-sm font-medium">
                  Смотреть →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free placement CTA */}
      <section className="py-16 bg-[#00A661]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Разместите объявление бесплатно
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Продайте или сдайте недвижимость быстро. Миллионы покупателей и арендаторов ждут!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings/create" className="bg-white text-[#00A661] font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Разместить бесплатно
            </Link>
            <Link href="/auth/register" className="bg-white/20 border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-200 text-lg">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
