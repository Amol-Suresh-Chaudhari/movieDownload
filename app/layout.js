import './globals.css'
import { Inter } from 'next/font/google'
import ConditionalLayout from '../components/ConditionalLayout'
import { Toaster } from 'react-hot-toast'
import ContextProvider from '../providers/ContextProvider'
import ReduxProvider from '../providers/ReduxProvider'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AllMoviesHub - Download Latest Bollywood, Hollywood & South Movies in HD',
  description: 'Download latest Bollywood, Hollywood, South Indian movies and web series in 480p, 720p, 1080p HD quality. Free movie downloads with dual audio support.',
  keywords: 'movies download, bollywood movies, hollywood movies, south movies, web series, HD movies, 480p movies, 720p movies, 1080p movies, dual audio movies, latest movies 2024',
  authors: [{ name: 'AllMoviesHub' }],
  creator: 'AllMoviesHub',
  publisher: 'AllMoviesHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AllMoviesHub - Download Latest Bollywood, Hollywood & South Movies in HD',
    description: 'Download latest Bollywood, Hollywood, South Indian movies and web series in 480p, 720p, 1080p HD quality. Free movie downloads with dual audio support.',
    siteName: 'AllMoviesHub',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AllMoviesHub - Latest Movies Download',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AllMoviesHub - Download Latest Movies in HD',
    description: 'Download latest Bollywood, Hollywood, South movies and web series in HD quality.',
    images: ['/images/og-image.jpg'],
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AllMoviesHub",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "description": "Download latest Bollywood, Hollywood, South Indian movies and web series in HD quality",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <ContextProvider>
            <ErrorBoundary>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#374151',
                    color: '#fff',
                  },
                }}
              />
            </ErrorBoundary>
          </ContextProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
