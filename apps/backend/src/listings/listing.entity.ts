import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { City } from '../locations/city.entity';
import { District } from '../locations/district.entity';
import { ListingPhoto } from './listing-photo.entity';
import { Favorite } from '../favorites/favorite.entity';

export enum DealType {
  SALE = 'sale',
  RENT = 'rent',
  RENT_DAILY = 'rent_daily',
}

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  SOLD = 'sold',
  ARCHIVED = 'archived',
}

export enum PropertyCondition {
  NEW = 'new',
  GOOD = 'good',
  RENOVATION_NEEDED = 'renovation_needed',
  EURO = 'euro',
  DESIGN = 'design',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ nullable: true })
  currency: string; // KZT, USD

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area: number;

  @Column({ nullable: true })
  rooms: number;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  floorsTotal: number;

  @Column({ nullable: true })
  yearBuilt: number;

  @Column({ type: 'enum', enum: PropertyCondition, nullable: true })
  condition: PropertyCondition;

  @Column({ type: 'enum', enum: DealType })
  dealType: DealType;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.PENDING })
  status: ListingStatus;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number;

  @Column({ default: false })
  isNewBuilding: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  premiumUntil: Date;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactWhatsapp: string;

  @Column({ nullable: true })
  contactTelegram: string;

  @Column({ default: 0 })
  views: number;

  // Relations
  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (cat) => cat.listings)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => City, (city) => city.listings)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: string;

  @ManyToOne(() => District, (d) => d.listings, { nullable: true })
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column({ nullable: true })
  districtId: string;

  @OneToMany(() => ListingPhoto, (photo) => photo.listing, { cascade: true, eager: true })
  photos: ListingPhoto[];

  @OneToMany(() => Favorite, (fav) => fav.listing)
  favorites: Favorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
