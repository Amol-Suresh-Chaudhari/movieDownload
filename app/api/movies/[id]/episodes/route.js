import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Movie from '../../../../../models/Movie';
import jwt from 'jsonwebtoken';

// Verify admin token
function verifyToken(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// GET - Get all episodes for a movie
export async function GET(request, { params }) {
  try {
    await connectDB();
    const movie = await Movie.findById(params.id);
    
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ episodes: movie.episodes || [] });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}

// POST - Add new episode
export async function POST(request, { params }) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    const movie = await Movie.findById(params.id);
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    if (!movie.isWebSeries) {
      return NextResponse.json({ error: 'Movie is not a web series' }, { status: 400 });
    }

    // Create new episode
    const newEpisode = {
      episodeNumber: body.episodeNumber,
      title: body.title,
      description: body.description,
      duration: body.duration,
      seasonNumber: body.seasonNumber || 1,
      downloadLinks: body.downloadLinks || [],
      streamingLinks: body.streamingLinks || [],
      thumbnail: body.thumbnail,
      airDate: body.airDate ? new Date(body.airDate) : new Date(),
      views: 0,
      downloads: 0
    };

    movie.episodes.push(newEpisode);
    movie.totalEpisodes = movie.episodes.length;
    
    await movie.save();

    return NextResponse.json({ 
      message: 'Episode added successfully', 
      episode: movie.episodes[movie.episodes.length - 1] 
    });
  } catch (error) {
    console.error('Error adding episode:', error);
    return NextResponse.json({ error: 'Failed to add episode' }, { status: 500 });
  }
}
