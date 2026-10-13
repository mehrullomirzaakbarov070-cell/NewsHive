import localFont from 'next/font/local';
import './globals.css';
import { ThemeScript } from '../components/ThemeScript';

const inter = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/inter-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/inter-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'YangiliklarUz | So\'ngi yangiliklar',
    template: '%s | YangiliklarUz',
  },
  description:
    'YangiliklarUz — biznes, texnologiya, sport, fan, sog\'liq va ko\'ngilochar sohalaridagi eng so\'nggi yangiliklar.',
  keywords: [
    'yangiliklar',
    'uzbekistan',
    'biznes',
    'texnologiya',
    'sport',
    'fan',
    'sog\'liq',
    'ko\'ngilochar',
    'news',
  ],
  authors: [{ name: 'YangiliklarUz' }],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: '/',
    languages: {
      'uz-UZ': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'YangiliklarUz',
    locale: 'uz_UZ',
    title: 'YangiliklarUz',
    description:
      'YangiliklarUz — biznes, texnologiya, sport, fan, sog\'liq va ko\'ngilochar sohalaridagi eng so\'nggi yangiliklar.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'YangiliklarUz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YangiliklarUz',
    description:
      'YangiliklarUz — biznes, texnologiya, sport, fan, sog\'liq va ko\'ngilochar sohalaridagi eng so\'nggi yangiliklar.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  themeColor: '#0b1220',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
