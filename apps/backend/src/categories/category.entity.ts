import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from '../listings/listing.entity';

@Entity('categories')
export class Category {
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
  icon: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Listing, (l) => l.category)
  listings: Listing[];
}
