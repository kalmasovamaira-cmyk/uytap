import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { District } from './district.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  nameRu: string;

  @Column()
  nameKz: string;

  @Column()
  nameEn: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number;

  @Column({ default: 0 })
  listingsCount: number;

  @OneToMany(() => District, (d) => d.city)
  districts: District[];

  @OneToMany(() => Listing, (l) => l.city)
  listings: Listing[];
}
