import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'UyTap — Недвижимость в Казахстане', template: '%s | UyTap' },
  description: 'Крупнейший маркетплейс недвижимости Казахстана. Продажа и аренда квартир, домов, коммерческой недвижимости. Бесплатное размещение объявлений.',
  keywords: ['недвижимость', 'казахстан', 'квартиры', 'дома', 'аренда', 'продажа', 'алматы', 'астана'],
  openGraph: {
    title: 'UyTap — Недвижимость в Казахстане',
    description: 'Крупнейший бесплатный маркетплейс недвижимости Казахстана',
    type: 'website',
    locale: 'ru_KZ',
    siteName: 'UyTap',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "UyTap",
            "url": "https://uytap.kz",
            "description": "Маркетплейс недвижимости Казахстана",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://uytap.kz/listings?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
