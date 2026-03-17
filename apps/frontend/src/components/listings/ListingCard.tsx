import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';

interface Props {
  listing: Listing;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

function formatPrice(price: number, currency = 'KZT'): string {
  if (currency === 'KZT') {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} млн ₸`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)} тыс ₸`;
    return `${price.toLocaleString()} ₸`;
  }
  return `$${price.toLocaleString()}`;
}

function getDealLabel(dealType: string): string {
  return dealType === 'sale' ? 'Продажа' : dealType === 'rent' ? 'Аренда' : 'Посуточно';
}

export function ListingCard({ listing, onFavorite, isFavorited }: Props) {
  const mainPhoto = listing.photos?.find((p) => p.isMain) || listing.photos?.[0];

  return (
    <div className="card group cursor-pointer">
      {/* Photo */}
      <Link href={`/listings/${listing.id}`} className="listing-photo-hover block aspect-[4/3] bg-gray-100 relative">
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${listing.dealType === 'sale' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
            {getDealLabel(listing.dealType)}
          </span>
          {listing.isNewBuilding && (
            <span className="bg-[#00A661] text-white text-xs font-semibold px-2 py-0.5 rounded-md">Новостройка</span>
          )}
          {listing.isPremium && (
            <span className="bg-amber-400 text-white text-xs font-semibold px-2 py-0.5 rounded-md">⭐ ТОП</span>
          )}
        </div>

        {/* Photos count */}
        {listing.photos?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            {listing.photos.length}
          </div>
        )}

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onFavorite(listing.id); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <svg className={`w-4 h-4 transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </Link>

      {/* Content */}
      <Link href={`/listings/${listing.id}`} className="block p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</span>
          {listing.area && (
            <span className="text-sm text-gray-500">{(listing.price / listing.area).toFixed(0)} ₸/м²</span>
          )}
        </div>

        {/* Details row */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
          {listing.rooms && (
            <span className="flex items-center gap-1">
              <span className="text-[#00A661]">🛏</span> {listing.rooms} комн.
            </span>
          )}
          {listing.area && (
            <span className="flex items-center gap-1">
              <span className="text-[#00A661]">📐</span> {listing.area} м²
            </span>
          )}
          {listing.floor && listing.floorsTotal && (
            <span className="flex items-center gap-1">
              <span className="text-[#00A661]">🏢</span> {listing.floor}/{listing.floorsTotal} эт.
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{listing.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3 h-3 text-[#00A661]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="line-clamp-1">
            {listing.city?.nameRu}{listing.district ? `, ${listing.district.nameRu}` : ''}
          </span>
          <span className="ml-auto flex items-center gap-0.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {listing.views}
          </span>
        </div>
      </Link>
    </div>
  );
}
