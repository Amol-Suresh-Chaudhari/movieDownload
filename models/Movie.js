import mongoose from 'mongoose';

const downloadLinkSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['480p', '720p', '1080p', '4K']
  },
  size: String,
  links: [{
    url: String,
    server: String,
    type: {
      type: String,
      enum: ['direct', 'torrent', 'streaming'],
      default: 'direct'
    }
  }]
});

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['poster', 'backdrop', 'screenshot', 'banner'],
    default: 'poster'
  },
  cloudinaryId: String,
  alt: String
});

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: String,
  seasonNumber: {
    type: Number,
    default: 1
  },
  downloadLinks: [downloadLinkSchema],
  streamingLinks: [{
    platform: String,
    url: String,
    quality: String
  }],
  thumbnail: String,
  airDate: Date,
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Bollywood', 'Hollywood', 'South', 'South Dubbed', 'Dual Audio', 'Web Series', 'TV Shows']
  },
  language: [{
    type: String,
    required: true
  }],
  isDualAudio: {
    type: Boolean,
    default: false
  },
  images: [imageSchema],
  poster: {
    type: String,
    required: true
  },
  backdrop: String,
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  duration: String,
  director: String,
  cast: [String],
  downloadLinks: [downloadLinkSchema],
  streamingLinks: [{
    platform: String,
    url: String,
    embedCode: String
  }],
  // Web Series specific fields
  isWebSeries: {
    type: Boolean,
    default: false
  },
  totalSeasons: {
    type: Number,
    default: 1
  },
  totalEpisodes: {
    type: Number,
    default: 0
  },
  episodes: [episodeSchema],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  needsReview: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.index({ category: 1, year: -1 });
movieSchema.index({ isPublished: 1, createdAt: -1 });
movieSchema.index({ title: 1 });
movieSchema.index({ slug: 1 });

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
