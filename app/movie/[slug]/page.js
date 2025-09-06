import { notFound } from 'next/navigation'
import MovieDetailsWrapper from './MovieDetailsWrapper.js'

async function getMovie(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/movies`, {
      cache: 'no-store'
    })
    const data = await response.json()
    
    if (response.ok && data.movies) {
      const foundMovie = data.movies.find(m => 
        m.slug === slug || 
        m._id === slug ||
        m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
      )
      return foundMovie
    }
  } catch (error) {
    console.error('Error fetching movie:', error)
  }
  return null
}

export async function generateMetadata({ params }) {
  const movie = await getMovie(params.slug)
  
  if (!movie) {
    return {
      title: 'Movie Not Found - AllMoviesHub',
      description: 'The requested movie could not be found.'
    }
  }

  const qualities = movie.downloadLinks?.map(link => link.quality).join(', ') || 'HD'
  const year = movie.year || new Date().getFullYear()
  
  return {
    title: `${movie.title} (${year}) - Download in ${qualities} - AllMoviesHub`,
    description: `Download ${movie.title} (${year}) ${movie.category} movie in ${qualities} quality. ${movie.isDualAudio ? 'Dual Audio available. ' : ''}Rating: ${movie.rating || 'N/A'}/10. ${movie.plot || movie.description || ''}`,
    keywords: `${movie.title}, ${movie.title} download, ${movie.category} movies, ${year} movies, ${qualities} movies, ${movie.isDualAudio ? 'dual audio movies, ' : ''}${movie.language || 'hindi'} movies`,
    openGraph: {
      title: `${movie.title} (${year}) - Download in HD`,
      description: `Download ${movie.title} (${year}) in HD quality. Rating: ${movie.rating || 'N/A'}/10`,
      type: 'video.movie',
      images: [
        {
          url: movie.poster || '/images/default-poster.webp',
          width: 400,
          height: 600,
          alt: `${movie.title} Poster`
        }
      ],
      releaseDate: movie.releaseDate || `${year}-01-01`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} (${year}) - Download in HD`,
      description: `Download ${movie.title} in HD quality. Rating: ${movie.rating || 'N/A'}/10`,
      images: [movie.poster || '/images/default-poster.webp'],
    },
    alternates: {
      canonical: `/movie/${movie.slug || params.slug}`,
    },
  }
}

export default async function MoviePage({ params }) {
  const movie = await getMovie(params.slug)

  if (!movie) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.plot || movie.description || `${movie.title} is a ${movie.category} movie released in ${movie.year || new Date().getFullYear()}`,
    "image": movie.poster || '/images/default-poster.webp',
    "datePublished": movie.releaseDate || `${movie.year || new Date().getFullYear()}-01-01`,
    "genre": movie.genre || movie.category,
    "contentRating": movie.rated || "Not Rated",
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "ratingCount": movie.ratingCount || 100,
      "bestRating": 10,
      "worstRating": 1
    } : undefined,
    "duration": movie.runtime || "PT120M",
    "director": movie.director ? {
      "@type": "Person",
      "name": movie.director
    } : undefined,
    "actor": movie.cast ? (Array.isArray(movie.cast) ? movie.cast : movie.cast.split(',')).map(actor => ({
      "@type": "Person",
      "name": typeof actor === 'string' ? actor.trim() : actor
    })) : undefined,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "category": "Digital Download"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-900">
        <MovieDetailsWrapper movie={movie} />
      </div>
    </>
  )
}

