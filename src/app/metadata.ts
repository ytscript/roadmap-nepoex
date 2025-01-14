import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Kod Günlüğü - Yazılım Dünyasından İçgörüler',
    template: '%s | Kod Günlüğü'
  },
  description: 'Modern web teknolojileri, yazılım geliştirme ve teknoloji dünyasından güncel içerikler.',
  keywords: ['yazılım', 'programlama', 'web geliştirme', 'javascript', 'react', 'nextjs', 'typescript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Kod Günlüğü - Yazılım Dünyasından İçgörüler',
    description: 'Modern web teknolojileri, yazılım geliştirme ve teknoloji dünyasından güncel içerikler.',
    url: 'https://your-domain.com',
    siteName: 'Kod Günlüğü',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kod Günlüğü - Yazılım Dünyasından İçgörüler',
    description: 'Modern web teknolojileri, yazılım geliştirme ve teknoloji dünyasından güncel içerikler.',
    creator: '@yourtwitterhandle',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}; 