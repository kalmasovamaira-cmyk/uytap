'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  Trees, 
  Store, 
  Construction, 
  Warehouse, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  PlusCircle,
  Users
} from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { ListingCard } from '@/components/listings/ListingCard';
import { listingsApi, locationsApi, categoriesApi, statsApi } from '@/lib/api';
import { Listing, City, Category } from '@/types';

const CATEGORY_ICONS: Record<string, any> = {
  apartment: Home, 
  house: Trees, 
  land: Zap, 
  commercial: Store,
  'new-buildings': Construction, 
  garage: Warehouse,
};

const CITY_IMAGES: Record<string, string> = {
  'almaty': '/cities/almaty.png',
  'astana': '/cities/astana.png',
  'shymkent': '/cities/shymkent.png',
  'karaganda': '/cities/karaganda.png',
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
      setFeatured(f.slice(0, 8));
      setCities(c.slice(0, 8));
      setCategories(cats);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient min-h-[600px] flex items-center relative overflow-hidden py-20">
        <div className="hero-overlay absolute inset-0 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest mb-10 animate-fade-in">
              <ShieldCheck size={14} className="text-primary" />
              Бесплатное размещение объявлений №1
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight animate-fade-in">
              Ваш новый дом <br className="hidden md:block" /> 
              начинается <span className="text-primary relative inline-block">
                здесь
                <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-primary/30 rounded-full blur-sm" />
              </span>
            </h1>
            
            <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium animate-fade-in delay-100">
              Самый быстрый способ найти, купить или арендовать <br className="hidden md:block" /> недвижимость в любом городе Казахстана.
            </p>

            {/* Search */}
            <div className="animate-fade-in delay-200">
              <SearchBar variant="hero" />
            </div>

            {/* Stats chips */}
            {stats && (
              <div className="flex flex-wrap justify-center items-center gap-6 mt-12 animate-fade-in delay-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <CheckCircle2 size={18} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg leading-none">{stats.totalListings?.toLocaleString()}+</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Объявлений</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Trees size={18} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg leading-none">14</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Городов</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg leading-none">100%</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Бесплатно</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Категории недвижимости</h2>
              <p className="text-slate-400 font-medium mt-2">Выберите наиболее подходящий тип жилья</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Home;
              return (
                <Link
                  key={cat.id}
                  href={`/listings?categoryId=${cat.id}`}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-slate-100 hover:border-primary/30 hover:bg-emerald-50 transition-all duration-300 group shadow-sm hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-inner group-hover:shadow-md">
                    <Icon size={28} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-center tracking-tight">{cat.nameRu}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Свежие объявления</h2>
              <p className="text-slate-400 font-medium mt-1">Лучшие предложения, добавленные недавно</p>
            </div>
            <Link href="/listings" className="btn-secondary py-2.5 px-6 text-sm font-bold flex items-center gap-2 group">
              Смотреть все <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-4">
                    <div className="skeleton h-6 w-1/2" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Популярные города</h2>
            <p className="text-slate-400 font-medium font-lg">Начните поиск недвижимости в крупнейших мегаполисах Казахстана</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/listings?cityId=${city.id}`}
                className="relative h-[280px] rounded-[32px] overflow-hidden group shadow-lg"
              >
                {/* City Background Image */}
                <div className="absolute inset-0 bg-slate-900">
                  <img 
                    src={CITY_IMAGES[city.slug] || '/cities/almaty.png'} 
                    alt={city.nameRu}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                  />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 city-card-overlay flex flex-col justify-end p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-black text-2xl text-white mb-1 tracking-tight">{city.nameRu}</h3>
                    <p className="text-white/60 text-sm font-medium mb-4">{city.region}</p>
                    <div className="h-0 group-hover:h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-primary font-bold text-sm">
                      Посмотреть объекты <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900 mx-4 sm:mx-8 lg:mx-12 rounded-[48px] my-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-8 border border-primary/20">
            <PlusCircle size={48} className="text-primary animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Хотите продать или <br /> сдать недвижимость?
          </h2>
          <p className="text-white/50 text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium">
            Разместите объявление прямо сейчас. Мы помогаем сотням людей находить жильё каждый день абсолютно бесплатно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings/create" className="btn-primary py-4 px-10 text-lg shadow-2xl shadow-primary/30 active:scale-95">
              Разместить объявление
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
