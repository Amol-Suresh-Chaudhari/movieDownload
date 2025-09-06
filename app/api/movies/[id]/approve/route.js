import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../../lib/mongodb.js'
import Movie from '../../../../../models/Movie.js'

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { action } = await request.json()
    
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

    const movie = await Movie.findById(id)
    if (!movie) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 })
    }

    if (action === 'approve') {
      // Approve the movie
      movie.needsReview = false
      movie.isPublished = true
      // Remove approvedBy field assignment since we don't have a proper user ObjectId
      movie.approvedAt = new Date()
      
      await movie.save()
      
      return NextResponse.json({ 
        message: 'Movie approved successfully',
        movie 
      })
    } else if (action === 'reject') {
      // Delete the rejected movie
      await Movie.findByIdAndDelete(id)
      
      return NextResponse.json({ 
        message: 'Movie rejected and removed successfully'
      })
    } else if (action === 'pending') {
      // Set movie to pending review status
      movie.needsReview = true
      movie.isPublished = false
      
      await movie.save()
      
      return NextResponse.json({ 
        message: 'Movie saved for review',
        movie 
      })
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in movie approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
