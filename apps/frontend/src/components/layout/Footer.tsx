import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#00A661] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">Ү</span>
              </div>
              <span className="font-black text-xl text-white">UyTap<span className="text-[#00A661]">.kz</span></span>
            </Link>
            <p className="text-sm leading-relaxed">
              Крупнейший бесплатный маркетплейс недвижимости Казахстана. Найдите свой идеальный дом.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A661] transition-colors">
                <span className="text-sm">TG</span>
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A661] transition-colors">
                <span className="text-sm">IN</span>
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A661] transition-colors">
                <span className="text-sm">YT</span>
              </a>
            </div>
          </div>

          {/* Недвижимость */}
          <div>
            <h4 className="text-white font-semibold mb-4">Недвижимость</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings?dealType=sale" className="hover:text-[#00A661] transition-colors">Продажа квартир</Link></li>
              <li><Link href="/listings?dealType=rent" className="hover:text-[#00A661] transition-colors">Аренда квартир</Link></li>
              <li><Link href="/listings?categoryId=house" className="hover:text-[#00A661] transition-colors">Дома</Link></li>
              <li><Link href="/listings?categoryId=commercial" className="hover:text-[#00A661] transition-colors">Коммерческая</Link></li>
              <li><Link href="/listings?isNewBuilding=true" className="hover:text-[#00A661] transition-colors">Новостройки</Link></li>
              <li><Link href="/listings?categoryId=land" className="hover:text-[#00A661] transition-colors">Земельные участки</Link></li>
            </ul>
          </div>

          {/* Города */}
          <div>
            <h4 className="text-white font-semibold mb-4">Города</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings?city=almaty" className="hover:text-[#00A661] transition-colors">Алматы</Link></li>
              <li><Link href="/listings?city=astana" className="hover:text-[#00A661] transition-colors">Астана</Link></li>
              <li><Link href="/listings?city=shymkent" className="hover:text-[#00A661] transition-colors">Шымкент</Link></li>
              <li><Link href="/listings?city=karaganda" className="hover:text-[#00A661] transition-colors">Қарағанды</Link></li>
              <li><Link href="/listings?city=aktobe" className="hover:text-[#00A661] transition-colors">Ақтөбе</Link></li>
              <li><Link href="/listings?city=atyrau" className="hover:text-[#00A661] transition-colors">Атырау</Link></li>
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#00A661] transition-colors">О нас</Link></li>
              <li><Link href="/listings/create" className="hover:text-[#00A661] transition-colors">Разместить объявление</Link></li>
              <li><Link href="/help" className="hover:text-[#00A661] transition-colors">Помощь</Link></li>
              <li><Link href="/privacy" className="hover:text-[#00A661] transition-colors">Конфиденциальность</Link></li>
              <li><Link href="/terms" className="hover:text-[#00A661] transition-colors">Условия использования</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 UyTap.kz — Все права защищены</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-[#00A661] rounded-full animate-pulse"></span>
            <span>Бесплатное размещение объявлений</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
