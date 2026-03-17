import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_photos')
export class ListingPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isMain: boolean;

  @ManyToOne(() => Listing, (listing) => listing.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @Column()
  listingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
