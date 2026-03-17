import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

const DEFAULT_CATEGORIES = [
  { slug: 'apartment', nameRu: 'Квартиры', nameKz: 'Пәтерлер', nameEn: 'Apartments', icon: '🏠', order: 1 },
  { slug: 'house', nameRu: 'Дома', nameKz: 'Үйлер', nameEn: 'Houses', icon: '🏡', order: 2 },
  { slug: 'land', nameRu: 'Земельные участки', nameKz: 'Жер телімдері', nameEn: 'Land Plots', icon: '🌿', order: 3 },
  { slug: 'commercial', nameRu: 'Коммерческая', nameKz: 'Коммерциялық', nameEn: 'Commercial', icon: '🏢', order: 4 },
  { slug: 'new-buildings', nameRu: 'Новостройки', nameKz: 'Жаңа үйлер', nameEn: 'New Buildings', icon: '🏗️', order: 5 },
  { slug: 'garage', nameRu: 'Гаражи', nameKz: 'Гараждар', nameEn: 'Garages', icon: '🚗', order: 6 },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    for (const cat of DEFAULT_CATEGORIES) {
      const exists = await this.categoriesRepo.findOne({ where: { slug: cat.slug } });
      if (!exists) await this.categoriesRepo.save(this.categoriesRepo.create(cat));
    }
  }

  findAll() {
    return this.categoriesRepo.find({ order: { order: 'ASC' } });
  }

  findBySlug(slug: string) {
    return this.categoriesRepo.findOne({ where: { slug } });
  }
}
