import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb.js'
import Movie from '../../../models/Movie.js'
import jwt from 'jsonwebtoken'
import logger from '../../../lib/logger.js'

export async function GET(request) {
  const startTime = Date.now()
  try {
    logger.info('Movies API GET request started', {
      url: request.url,
      userAgent: request.headers.get('user-agent')
    })
    
    await dbConnect()
    logger.database('CONNECT', 'movies', { operation: 'fetch' })
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const genre = searchParams.get('genre')
    const quality = searchParams.get('quality')
    const isDualAudio = searchParams.get('isDualAudio')
    const needsReview = searchParams.get('needsReview')
    
    // Build query
    let query = {}
    
    // For admin requests with needsReview filter
    if (needsReview === 'true') {
      query.needsReview = true
    } else {
      // For public requests, only show published movies
      query.isPublished = true
    }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $in: [new RegExp(search, 'i')] } },
        { cast: { $in: [new RegExp(search, 'i')] } },
        { director: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (year) {
      query.year = parseInt(year)
    }
    
    if (genre) {
      query.genre = { $in: [genre] }
    }
    
    if (isDualAudio === 'true') {
      query.isDualAudio = true
    }
    
    if (quality) {
      query['downloadLinks.quality'] = quality
    }
    
    // Calculate skip
    const skip = (page - 1) * limit
    
    // Get movies with pagination
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
    
    // Get total count for pagination
    const total = await Movie.countDocuments(query)
    
    const responseTime = Date.now() - startTime
    logger.performance('movies_fetch', responseTime, 'ms', {
      moviesCount: movies.length,
      totalMovies: total,
      page,
      limit
    })
    
    logger.info('Movies API GET request completed', {
      moviesReturned: movies.length,
      totalMovies: total,
      responseTime
    })

    return NextResponse.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    logger.error('Error fetching movies', error, {
      responseTime,
      url: request.url
    })
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
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
      jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    await dbConnect()
    
    const data = await request.json()
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const movie = new Movie({
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    await movie.save()
    
    return NextResponse.json({ movie, message: 'Movie created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating movie:', error)
    return NextResponse.json(
      { error: 'Failed to create movie', message: error.message },
      { status: 500 }
    )
  }
}
