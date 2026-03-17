import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { District } from './district.entity';

const KZ_CITIES = [
  { slug: 'almaty', nameRu: 'Алматы', nameKz: 'Алматы', nameEn: 'Almaty', region: 'Алматинская область', lat: 43.2220, lng: 76.8512 },
  { slug: 'astana', nameRu: 'Астана', nameKz: 'Астана', nameEn: 'Astana', region: 'Акмолинская область', lat: 51.1801, lng: 71.446 },
  { slug: 'shymkent', nameRu: 'Шымкент', nameKz: 'Шымкент', nameEn: 'Shymkent', region: 'Туркестанская область', lat: 42.3417, lng: 69.5901 },
  { slug: 'karaganda', nameRu: 'Қарағанды', nameKz: 'Қарағанды', nameEn: 'Karaganda', region: 'Карагандинская область', lat: 49.8028, lng: 73.0853 },
  { slug: 'aktobe', nameRu: 'Ақтөбе', nameKz: 'Ақтөбе', nameEn: 'Aktobe', region: 'Актюбинская область', lat: 50.2839, lng: 57.167 },
  { slug: 'taraz', nameRu: 'Тараз', nameKz: 'Тараз', nameEn: 'Taraz', region: 'Жамбылская область', lat: 42.9, lng: 71.3667 },
  { slug: 'pavlodar', nameRu: 'Павлодар', nameKz: 'Павлодар', nameEn: 'Pavlodar', region: 'Павлодарская область', lat: 52.2873, lng: 76.9674 },
  { slug: 'ust-kamenogorsk', nameRu: 'Өскемен', nameKz: 'Өскемен', nameEn: 'Ust-Kamenogorsk', region: 'ВКО', lat: 49.9481, lng: 82.6168 },
  { slug: 'semey', nameRu: 'Семей', nameKz: 'Семей', nameEn: 'Semey', region: 'ВКО', lat: 50.4112, lng: 80.2275 },
  { slug: 'atyrau', nameRu: 'Атырау', nameKz: 'Атырау', nameEn: 'Atyrau', region: 'Атырауская область', lat: 47.1167, lng: 51.8833 },
  { slug: 'kostanay', nameRu: 'Қостанай', nameKz: 'Қостанай', nameEn: 'Kostanay', region: 'Костанайская область', lat: 53.2198, lng: 63.6354 },
  { slug: 'petropavlovsk', nameRu: 'Петропавловск', nameKz: 'Петропавл', nameEn: 'Petropavlovsk', region: 'СКО', lat: 54.8654, lng: 69.1421 },
  { slug: 'kyzylorda', nameRu: 'Қызылорда', nameKz: 'Қызылорда', nameEn: 'Kyzylorda', region: 'Қызылординская область', lat: 44.853, lng: 65.509 },
  { slug: 'uralsk', nameRu: 'Орал', nameKz: 'Орал', nameEn: 'Uralsk', region: 'ЗКО', lat: 51.2333, lng: 51.3667 },
];

@Injectable()
export class LocationsService implements OnModuleInit {
  constructor(
    @InjectRepository(City) private citiesRepo: Repository<City>,
    @InjectRepository(District) private districtsRepo: Repository<District>,
  ) {}

  async onModuleInit() {
    for (const city of KZ_CITIES) {
      const exists = await this.citiesRepo.findOne({ where: { slug: city.slug } });
      if (!exists) await this.citiesRepo.save(this.citiesRepo.create(city));
    }
  }

  findAllCities() { return this.citiesRepo.find({ order: { nameRu: 'ASC' } }); }

  findCityBySlug(slug: string) { return this.citiesRepo.findOne({ where: { slug }, relations: ['districts'] }); }

  findDistrictsByCity(cityId: string) { return this.districtsRepo.find({ where: { cityId } }); }
}
