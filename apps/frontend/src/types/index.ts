export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'agent' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  icon?: string;
}

export interface City {
  id: string;
  slug: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  region?: string;
  lat?: number;
  lng?: number;
}

export interface District {
  id: string;
  slug: string;
  nameRu: string;
  cityId: string;
}

export interface ListingPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isMain: boolean;
  order: number;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  area?: number;
  rooms?: number;
  floor?: number;
  floorsTotal?: number;
  yearBuilt?: number;
  condition?: string;
  dealType: 'sale' | 'rent' | 'rent_daily';
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'sold' | 'archived';
  address?: string;
  lat?: number;
  lng?: number;
  isNewBuilding: boolean;
  isPremium: boolean;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactTelegram?: string;
  views: number;
  userId: string;
  user?: User;
  cityId: string;
  city?: City;
  districtId?: string;
  district?: District;
  categoryId: string;
  category?: Category;
  photos: ListingPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FilterParams {
  cityId?: string;
  districtId?: string;
  categoryId?: string;
  dealType?: string;
  priceMin?: string;
  priceMax?: string;
  areaMin?: string;
  areaMax?: string;
  rooms?: string;
  isNewBuilding?: string;
  withPhotos?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
