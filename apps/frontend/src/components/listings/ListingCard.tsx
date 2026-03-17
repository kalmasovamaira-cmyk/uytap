import Link from 'next/link';
import { 
  BedDouble, 
  Maximize, 
  Building2, 
  MapPin, 
  Eye, 
  Star,
  Heart,
  ImageIcon
} from 'lucide-react';
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
    <div className="card group">
      {/* Photo */}
      <Link href={`/listings/${listing.id}`} className="listing-photo-hover block aspect-[4/3] bg-slate-100 relative">
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt={listing.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <ImageIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg backdrop-blur-md ${listing.dealType === 'sale' ? 'bg-blue-600/90 text-white' : 'bg-orange-600/90 text-white'}`}>
            {getDealLabel(listing.dealType)}
          </span>
          {listing.isNewBuilding && (
            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-lg shadow-primary/20">НОВОСТРОЙКА</span>
          )}
          {listing.isPremium && (
            <span className="bg-amber-400 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-lg shadow-amber-400/20 flex items-center gap-1">
              <Star size={10} fill="currentColor" /> ТОП
            </span>
          )}
        </div>

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onFavorite(listing.id); }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10"
          >
            <Heart size={18} className={`transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/listings/${listing.id}`}>
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-black text-slate-900 tracking-tight">{formatPrice(listing.price, listing.currency)}</span>
            {listing.area && (
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {(listing.price / listing.area).toFixed(0)} ₸/м²
              </span>
            )}
          </div>

          {/* Details row */}
          <div className="flex items-center gap-4 text-[13px] text-slate-600 font-bold mb-4">
            {listing.rooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={16} className="text-primary" /> {listing.rooms} к
              </span>
            )}
            {listing.area && (
              <span className="flex items-center gap-1.5">
                <Maximize size={16} className="text-primary" /> {listing.area} м²
              </span>
            )}
            {listing.floor && (
              <span className="flex items-center gap-1.5">
                <Building2 size={16} className="text-primary" /> {listing.floor} эт.
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-3 group-hover:text-primary transition-colors tracking-tight">
            {listing.title}
          </h3>

          <hr className="border-slate-50 mb-3" />

          {/* Location */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1 max-w-[70%]">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">
                {listing.city?.nameRu}{listing.district ? `, ${listing.district.nameRu}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Eye size={12} />
              {listing.views}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
