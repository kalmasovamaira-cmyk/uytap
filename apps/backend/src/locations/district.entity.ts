import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { Listing } from '../listings/listing.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slug: string;

  @Column()
  nameRu: string;

  @Column()
  nameKz: string;

  @Column()
  nameEn: string;

  @ManyToOne(() => City, (city) => city.districts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: string;

  @OneToMany(() => Listing, (l) => l.district)
  listings: Listing[];
}
