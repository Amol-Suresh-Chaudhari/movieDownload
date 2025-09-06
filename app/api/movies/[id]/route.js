import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb.js'
import Movie from '../../../../models/Movie.js'
import jwt from 'jsonwebtoken'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const movie = await Movie.findById(params.id)
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }
    
    // Increment views
    await Movie.findByIdAndUpdate(params.id, { $inc: { views: 1 } })
    
    return NextResponse.json(movie)
  } catch (error) {
    console.error('Error fetching movie:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
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
    
    // Update slug if title changed
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    data.updatedAt = new Date()
    
    const movie = await Movie.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(movie)
  } catch (error) {
    console.error('Error updating movie:', error)
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
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
    
    const movie = await Movie.findByIdAndDelete(params.id)
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Movie deleted successfully' })
  } catch (error) {
    console.error('Error deleting movie:', error)
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    )
  }
}
