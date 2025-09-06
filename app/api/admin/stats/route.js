import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb.js'
import Movie from '../../../../models/Movie.js'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    try {
      jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await dbConnect()

    // Get total movies count
    const totalMovies = await Movie.countDocuments()
    
    // Get published movies count
    const publishedMovies = await Movie.countDocuments({ isPublished: true })
    
    // Get pending movies count (needs review)
    const pendingMovies = await Movie.countDocuments({ needsReview: true, isPublished: false })
    
    // Get total downloads (sum of all movie downloads)
    const downloadStats = await Movie.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloads' } } }
    ])
    const totalDownloads = downloadStats[0]?.totalDownloads || 0
    
    // Get total views (sum of all movie views)
    const viewStats = await Movie.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ])
    const totalViews = viewStats[0]?.totalViews || 0
    
    // Get movies by category
    const categoryStats = await Movie.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentMovies = await Movie.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })
    
    // Get top movies by views
    const topMovies = await Movie.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views downloads')
    
    const stats = {
      totalMovies,
      publishedMovies,
      pendingMovies,
      totalDownloads,
      totalViews,
      recentMovies,
      categoryStats: categoryStats.reduce((acc, cat) => {
        acc[cat._id] = cat.count
        return acc
      }, {}),
      topMovies
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
