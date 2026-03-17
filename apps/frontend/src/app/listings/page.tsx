'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { SearchBar } from '@/components/search/SearchBar';
import { listingsApi } from '@/lib/api';
import { Listing, PaginatedResult } from '@/types';

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedResult<Listing> | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get('sort') || 'date_desc');

  const fetchListings = async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const result = await listingsApi.getAll(params) as PaginatedResult<Listing>;
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    fetchListings(params);
  }, [searchParams, sort]);

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/listings?${params.toString()}`);
  };

  const handleSearch = (params: URLSearchParams) => {
    router.push(`/listings?${params.toString()}`);
  };

  const initialValues = {
    q: searchParams.get('q') || '',
    cityId: searchParams.get('cityId') || '',
    dealType: searchParams.get('dealType') || '',
    categoryId: searchParams.get('categoryId') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    rooms: searchParams.get('rooms') || '',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Фильтры</h3>
            <SearchBar variant="sidebar" initialValues={initialValues} onSearch={handleSearch} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {data ? `${data.total.toLocaleString()} объявлений` : 'Объявления'}
              </h1>
              {searchParams.get('q') && (
                <p className="text-sm text-gray-500">По запросу: «{searchParams.get('q')}»</p>
              )}
            </div>
            <select
              className="input w-auto text-sm py-2"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="date_desc">Сначала новые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
            </select>
          </div>

          {/* Listings grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
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
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data?.items.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    disabled={data.page === 1}
                    onClick={() => changePage(data.page - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Назад
                  </button>
                  {Array.from({ length: Math.min(data.pages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${data.page === p ? 'bg-[#00A661] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    disabled={data.page === data.pages}
                    onClick={() => changePage(data.page + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#00A661] border-t-transparent rounded-full animate-spin" /></div>}>
      <ListingsContent />
    </Suspense>
  );
}
