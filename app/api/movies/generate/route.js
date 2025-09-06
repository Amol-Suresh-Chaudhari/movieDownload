import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import dbConnect from '../../../../lib/mongodb.js'
import Movie from '../../../../models/Movie.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sample movie titles for bulk generation
const sampleMovieTitles = {
  Hollywood: [
    'The Last Guardian', 'Shadow Protocol', 'Quantum Horizon', 'Steel Thunder', 'Night Falcon',
    'Code Red Alpha', 'Phoenix Rising', 'Dark Matter', 'Storm Breaker', 'Iron Legion',
    'Cyber Strike', 'Titan Force', 'Ghost Protocol', 'Lightning Strike', 'Fire Storm'
  ],
  Bollywood: [
    'Dil Ki Baat', 'Pyaar Ka Rang', 'Sapno Ka Raja', 'Mohabbat Zindabad', 'Ishq Wala Love',
    'Dil Se Dil Tak', 'Zindagi Ke Rang', 'Khushi Ka Ghar', 'Pyaar Ki Jeet', 'Dil Ki Awaaz',
    'Mohabbat Ki Kasam', 'Ishq Ka Jadoo', 'Dil Mein Hai Pyaar', 'Zindagi Ka Safar', 'Khwaabon Ka Raaja'
  ],
  South: [
    'Veer Simha', 'Rowdy Raja', 'Mass Maharaja', 'Tiger Zinda', 'Baahubali Returns',
    'KGF Legacy', 'Pushpa Returns', 'RRR Revolution', 'Arjun Reddy 2', 'Kabir Singh Returns',
    'Vikram Vedha', 'Master Plan', 'Beast Mode', 'Kaithi Returns', 'Lokesh Universe'
  ],
  'Web Series': [
    'Digital Crimes', 'Cyber City', 'The Investigation', 'Dark Web', 'Code Breakers',
    'Mumbai Underworld', 'Tech Titans', 'Crime Patrol', 'Digital Detective', 'Hacker Wars'
  ]
}

function generateMovieImages(title, category) {
  const encodedTitle = encodeURIComponent(title)
  const categoryColors = {
    Hollywood: { bg: '1a1a2e', text: 'ffffff', accent: '16213e' },
    Bollywood: { bg: 'ff6b6b', text: 'ffffff', accent: 'ee5a52' },
    South: { bg: '4ecdc4', text: '000000', accent: '44a08d' },
    'Web Series': { bg: '9b59b6', text: 'ffffff', accent: '8e44ad' }
  }
  
  const colors = categoryColors[category] || categoryColors.Hollywood
  
  return [
    {
      url: `https://via.placeholder.com/400x600/${colors.bg}/${colors.text}?text=${encodedTitle}+Poster`,
      type: 'poster',
      alt: `${title} Poster`
    },
    {
      url: `https://via.placeholder.com/1920x1080/${colors.accent}/${colors.text}?text=${encodedTitle}+Banner`,
      type: 'banner',
      alt: `${title} Banner`
    },
    {
      url: `https://via.placeholder.com/800x450/${colors.bg}/${colors.text}?text=${encodedTitle}+Backdrop`,
      type: 'backdrop',
      alt: `${title} Backdrop`
    }
  ]
}

const generateMovieData = (title, category, year, sourcePlatform) => {
  const genres = {
    Hollywood: ['Action', 'Adventure', 'Sci-Fi', 'Thriller', 'Drama'],
    Bollywood: ['Drama', 'Romance', 'Musical', 'Family', 'Comedy'],
    South: ['Action', 'Drama', 'Thriller', 'Romance', 'Comedy'],
    'Web Series': ['Crime', 'Thriller', 'Drama', 'Mystery', 'Action']
  }

  const languages = {
    Hollywood: ['English', 'Hindi'],
    Bollywood: ['Hindi'],
    South: ['Tamil', 'Telugu', 'Hindi', 'Kannada'],
    'Web Series': ['Hindi', 'English']
  }

  const directors = {
    Hollywood: ['Christopher Nolan', 'James Cameron', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino'],
    Bollywood: ['Rajkumar Hirani', 'Sanjay Leela Bhansali', 'Karan Johar', 'Zoya Akhtar', 'Anurag Kashyap'],
    South: ['S.S. Rajamouli', 'Prashanth Neel', 'Sukumar', 'Lokesh Kanagaraj', 'Trivikram Srinivas'],
    'Web Series': ['Anurag Kashyap', 'Vikramaditya Motwane', 'Zoya Akhtar', 'Neeraj Pandey', 'Hansal Mehta']
  }

  const randomGenres = genres[category] || genres.Hollywood
  const randomLanguages = languages[category] || languages.Hollywood
  const randomDirectors = directors[category] || directors.Hollywood

  // Helper functions
  const getRandomGenres = (cat) => {
    const genreList = randomGenres
    return genreList.slice(0, Math.floor(Math.random() * 3) + 2)
  }

  const getLanguages = (cat) => {
    const langList = randomLanguages
    return langList.slice(0, Math.floor(Math.random() * 2) + 1)
  }

  const getDuration = (cat) => {
    const durations = {
      'Web Series': () => `${Math.floor(Math.random() * 30) + 20} episodes`,
      default: () => `${Math.floor(Math.random() * 60) + 90} min`
    }
    return durations[cat] ? durations[cat]() : durations.default()
  }

  const getRandomDirector = (cat) => {
    const directorList = randomDirectors
    return directorList[Math.floor(Math.random() * directorList.length)]
  }

  const getRandomCast = (cat) => {
    const castOptions = {
      Hollywood: ['Chris Evans', 'Scarlett Johansson', 'Robert Downey Jr.', 'Tom Holland', 'Zendaya'],
      Bollywood: ['Shah Rukh Khan', 'Deepika Padukone', 'Ranveer Singh', 'Alia Bhatt', 'Ranbir Kapoor'],
      South: ['Prabhas', 'Allu Arjun', 'Yash', 'Vijay', 'Samantha Ruth Prabhu'],
      'Web Series': ['Nawazuddin Siddiqui', 'Pankaj Tripathi', 'Radhika Apte', 'Manoj Bajpayee', 'Konkona Sen']
    }
    const castList = castOptions[cat] || castOptions.Hollywood
    return castList.slice(0, Math.floor(Math.random() * 3) + 2)
  }

  const generateDownloadLinks = () => [
    { quality: '480p', size: '400MB', url: '#' },
    { quality: '720p', size: '800MB', url: '#' },
    { quality: '1080p', size: '1.5GB', url: '#' }
  ]

  const generateStreamingLinks = () => [
    { platform: 'Server 1', url: '#', embedCode: '' },
    { platform: 'Server 2', url: '#', embedCode: '' }
  ]

  const movieImages = generateMovieImages(title, category)
  
  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: `${title} is an exciting ${category.toLowerCase()} movie from ${year}. This thrilling story captivates audiences with its compelling narrative and outstanding performances.`,
    year: parseInt(year),
    genre: getRandomGenres(category),
    category,
    language: getLanguages(category),
    isDualAudio: category === 'Hollywood' || category === 'South',
    images: movieImages,
    poster: movieImages[0].url, // Extract poster URL for required field
    backdrop: movieImages[2].url, // Extract backdrop URL
    rating: (Math.random() * 2 + 7).toFixed(1), // Random rating between 7.0-9.0
    duration: getDuration(category),
    director: getRandomDirector(category),
    cast: getRandomCast(category),
    downloadLinks: generateDownloadLinks(),
    streamingLinks: sourcePlatform ? [
      { platform: sourcePlatform, url: '#', embedCode: '' }
    ] : generateStreamingLinks(),
    tags: [
      title.split(' ')[0],
      category,
      ...randomGenres.slice(0, 2),
      '480p', '720p', '1080p',
      category !== 'Bollywood' ? 'Dual Audio' : 'Hindi',
      'HD Quality'
    ],
    views: Math.floor(Math.random() * 100000),
    downloads: Math.floor(Math.random() * 50000),
    isAIGenerated: true,
    needsReview: true,
    isPublished: false
  }
}

export async function POST(request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    try {
      const jwt = require('jsonwebtoken')
      jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { title, category = 'Hollywood', year = new Date().getFullYear(), count = 1, sourcePlatform } = await request.json()

    // Bulk generation mode
    if (count > 1) {
      if (count > 50) {
        return NextResponse.json({ message: 'Maximum 50 movies can be generated at once' }, { status: 400 })
      }

      await dbConnect()

      const categoryTitles = sampleMovieTitles[category] || sampleMovieTitles.Hollywood
      const movies = []

      for (let i = 0; i < count; i++) {
        const movieTitle = categoryTitles[i % categoryTitles.length] + ` ${Math.floor(Math.random() * 1000)}`
        const movieData = generateMovieData(movieTitle, category, year, sourcePlatform)
        
        try {
          const movie = new Movie(movieData)
          const savedMovie = await movie.save()
          movies.push(savedMovie)
        } catch (error) {
          console.error(`Error saving movie ${movieTitle}:`, error)
        }
      }

      return NextResponse.json({ 
        message: `${movies.length} movies generated successfully`,
        movies 
      })
    }

    // Single movie generation mode
    if (!title) {
      return NextResponse.json({ message: 'Movie title is required for single generation' }, { status: 400 })
    }

    await dbConnect()

    const movieData = generateMovieData(title, category, year, sourcePlatform)
    
    try {
      const movie = new Movie(movieData)
      const savedMovie = await movie.save()
      
      return NextResponse.json({
        success: true,
        movie: savedMovie
      })
    } catch (error) {
      console.error('Error saving movie:', error)
      return NextResponse.json({ message: 'Failed to save movie' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating movie content:', error)
    return NextResponse.json(
      { error: 'Failed to generate movie content' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    
    const movieData = await request.json()
    
    const movie = new Movie(movieData)
    await movie.save()
    
    return NextResponse.json({
      success: true,
      message: 'Movie saved successfully',
      movie
    })
  } catch (error) {
    console.error('Error saving generated movie:', error)
    return NextResponse.json(
      { error: 'Failed to save movie' },
      { status: 500 }
    )
  }
}
