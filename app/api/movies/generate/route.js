import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import dbConnect from '../../../../lib/mongodb.js'
import Movie from '../../../../models/Movie.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Realistic movie titles based on actual popular movies
const sampleMovieTitles = {
  Hollywood: [
    'Avengers: Endgame', 'Spider-Man: No Way Home', 'The Batman', 'Top Gun: Maverick', 'Black Panther',
    'Doctor Strange', 'Thor: Love and Thunder', 'Fast X', 'John Wick 4', 'Mission Impossible 7',
    'Jurassic World Dominion', 'The Matrix Resurrections', 'Dune', 'No Time to Die', 'Venom 2'
  ],
  Bollywood: [
    'Pathaan', 'Jawan', 'Dangal', 'Baahubali 2', 'KGF Chapter 2',
    'RRR', 'Pushpa', '83', 'Sooryavanshi', 'War',
    'Tiger Zinda Hai', 'Sanju', 'Padmaavat', 'Sultan', 'Bajrangi Bhaijaan'
  ],
  South: [
    'KGF Chapter 2', 'RRR', 'Pushpa', 'Baahubali 2', 'Master',
    'Beast', 'Vikram', 'Kaithi', 'Bigil', 'Sarkar',
    'Arjun Reddy', 'Geetha Govindam', 'Ala Vaikunthapurramuloo', 'Sarileru Neekevvaru', 'F2'
  ],
  'Web Series': [
    'Sacred Games', 'Mirzapur', 'The Family Man', 'Scam 1992', 'Mumbai Diaries 26/11',
    'Arya', 'Special Ops', 'Rocket Boys', 'SonyLIV Originals', 'Delhi Crime'
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
  
  // Generate detailed description based on category and genre
  const generateDetailedDescription = (title, category, genres) => {
    const plotTemplates = {
      Hollywood: [
        `${title} is a spectacular ${genres[0].toLowerCase()} blockbuster that takes audiences on an unforgettable journey. With cutting-edge visual effects and heart-pounding action sequences, this film delivers non-stop entertainment. The story follows compelling characters as they face extraordinary challenges, featuring stellar performances from A-list actors and masterful direction that brings every scene to life.`,
        `In this thrilling ${category.toLowerCase()} production, ${title} combines intense drama with breathtaking cinematography. The film explores themes of heroism, sacrifice, and redemption while delivering edge-of-your-seat excitement. With its innovative storytelling and spectacular production values, this movie sets new standards for modern cinema.`
      ],
      Bollywood: [
        `${title} is a captivating Bollywood masterpiece that beautifully weaves together romance, drama, and spectacular musical sequences. This emotionally rich film showcases the finest of Indian cinema with its colorful storytelling, memorable songs, and powerful performances. The narrative explores family values, love, and tradition while delivering entertainment that resonates with audiences across generations.`,
        `A heartwarming tale of love and relationships, ${title} brings together stellar performances, soul-stirring music, and vibrant cinematography. This Bollywood gem celebrates the essence of Indian culture while telling a universal story of human emotions, dreams, and aspirations.`
      ],
      South: [
        `${title} is an action-packed South Indian blockbuster that combines high-octane sequences with compelling storytelling. Known for its larger-than-life characters and spectacular action choreography, this film delivers the perfect blend of entertainment and emotion. The movie features stunning visuals, powerful dialogues, and performances that have redefined regional cinema.`,
        `This South Indian masterpiece, ${title}, showcases the rich cultural heritage and cinematic excellence of regional filmmaking. With its unique narrative style, breathtaking action sequences, and memorable characters, the film has garnered critical acclaim and massive popular appeal.`
      ],
      'Web Series': [
        `${title} is a gripping web series that explores complex characters and intricate storylines across multiple episodes. This digital masterpiece combines stellar writing with exceptional performances, creating a binge-worthy experience that keeps viewers on the edge of their seats. The series delves deep into contemporary issues while maintaining high production values and engaging narratives.`,
        `An innovative web series, ${title} represents the new age of digital entertainment with its bold storytelling and character-driven plots. Each episode builds upon the last, creating a compelling narrative arc that showcases the best of streaming content.`
      ]
    }
    
    const templates = plotTemplates[category] || plotTemplates.Hollywood
    return templates[Math.floor(Math.random() * templates.length)]
  }

  const selectedGenres = getRandomGenres(category)
  
  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: generateDetailedDescription(title, category, selectedGenres),
    year: parseInt(year),
    genre: selectedGenres,
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
      ...selectedGenres.slice(0, 2),
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

      // Check for existing movies to avoid duplicates
      const existingMovies = await Movie.find({ 
        title: { $in: categoryTitles },
        category: category 
      }).select('title')
      
      const existingTitles = new Set(existingMovies.map(movie => movie.title))

      for (let i = 0; i < count; i++) {
        let movieTitle = categoryTitles[i % categoryTitles.length]
        
        // If movie already exists, skip or modify title
        if (existingTitles.has(movieTitle)) {
          movieTitle = `${movieTitle} (${year})`
          // Double check this modified title doesn't exist
          const modifiedExists = await Movie.findOne({ title: movieTitle, category: category })
          if (modifiedExists) {
            console.log(`Skipping duplicate movie: ${movieTitle}`)
            continue
          }
        }
        
        const movieData = generateMovieData(movieTitle, category, year, sourcePlatform)
        
        try {
          const movie = new Movie(movieData)
          const savedMovie = await movie.save()
          movies.push(savedMovie)
          existingTitles.add(movieTitle) // Add to set to avoid duplicates in this batch
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

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ 
      title: title, 
      category: category 
    })
    
    if (existingMovie) {
      return NextResponse.json({ 
        message: 'Movie with this title already exists in this category',
        error: 'Duplicate movie title'
      }, { status: 400 })
    }

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
