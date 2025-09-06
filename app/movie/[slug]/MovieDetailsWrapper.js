'use client'
import MovieDetails from '../../../components/MovieDetails.js'
import RelatedMovies from '../../../components/RelatedMovies.js'

export default function MovieDetailsWrapper({ movie }) {
  return (
    <>
      <MovieDetails movie={movie} />
      <div className="hidden md:block">
        <RelatedMovies currentMovie={movie} />
      </div>
    </>
  )
}
