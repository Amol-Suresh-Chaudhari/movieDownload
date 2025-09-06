import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas
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

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Dummy data
const dummyMovies = [
  // Bollywood Movies
  {
    title: "Pathaan",
    slug: "pathaan-2023",
    description: "An exiled RAW agent partners with a Pakistani agent to take down a common enemy.",
    year: 2023,
    genre: ["Action", "Thriller", "Adventure"],
    category: "Bollywood",
    language: ["Hindi"],
    isDualAudio: false,
    poster: "https://image.tmdb.org/t/p/w500/qBED3iFuD1bOOsyOZiXCj8R8Yf5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    rating: 6.2,
    duration: "146 min",
    director: "Siddharth Anand",
    cast: ["Shah Rukh Khan", "Deepika Padukone", "John Abraham", "Dimple Kapadia"],
    downloadLinks: [
      {
        quality: "480p",
        size: "450MB",
        links: [
          { url: "https://example.com/pathaan-480p", server: "Server 1", type: "direct" },
          { url: "https://example.com/pathaan-480p-torrent", server: "Torrent", type: "torrent" }
        ]
      },
      {
        quality: "720p",
        size: "1.2GB",
        links: [
          { url: "https://example.com/pathaan-720p", server: "Server 1", type: "direct" },
          { url: "https://example.com/pathaan-720p-server2", server: "Server 2", type: "direct" }
        ]
      },
      {
        quality: "1080p",
        size: "2.8GB",
        links: [
          { url: "https://example.com/pathaan-1080p", server: "Server 1", type: "direct" }
        ]
      }
    ],
    streamingLinks: [
      { platform: "Prime Video", url: "https://primevideo.com/pathaan", embedCode: "" }
    ],
    isWebSeries: false,
    tags: ["spy", "action", "bollywood", "shah rukh khan"],
    isPublished: true,
    views: 125000,
    downloads: 45000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/qBED3iFuD1bOOsyOZiXCj8R8Yf5.jpg", type: "poster", alt: "Pathaan Poster" },
      { url: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg", type: "backdrop", alt: "Pathaan Backdrop" }
    ]
  },
  
  // Hollywood Movies
  {
    title: "Avatar: The Way of Water",
    slug: "avatar-the-way-of-water-2022",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    year: 2022,
    genre: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    category: "Hollywood",
    language: ["English"],
    isDualAudio: false,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    rating: 7.6,
    duration: "192 min",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
    downloadLinks: [
      {
        quality: "720p",
        size: "1.8GB",
        links: [
          { url: "https://example.com/avatar2-720p", server: "Server 1", type: "direct" }
        ]
      },
      {
        quality: "1080p",
        size: "4.2GB",
        links: [
          { url: "https://example.com/avatar2-1080p", server: "Server 1", type: "direct" },
          { url: "https://example.com/avatar2-1080p-torrent", server: "Torrent", type: "torrent" }
        ]
      },
      {
        quality: "4K",
        size: "12GB",
        links: [
          { url: "https://example.com/avatar2-4k", server: "Premium Server", type: "direct" }
        ]
      }
    ],
    streamingLinks: [
      { platform: "Disney+", url: "https://disneyplus.com/avatar2", embedCode: "" }
    ],
    isWebSeries: false,
    tags: ["sci-fi", "avatar", "james cameron", "pandora"],
    isPublished: true,
    views: 200000,
    downloads: 78000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", type: "poster", alt: "Avatar 2 Poster" }
    ]
  },

  // South Movies
  {
    title: "RRR",
    slug: "rrr-2022",
    description: "A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspirational path of freedom against the despotic rule.",
    year: 2022,
    genre: ["Action", "Drama", "Adventure"],
    category: "South",
    language: ["Telugu", "Tamil", "Malayalam", "Kannada"],
    isDualAudio: false,
    poster: "https://image.tmdb.org/t/p/w500/f0eZNkdAz2ofdPjWI1m8OKTZJvU.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
    rating: 8.8,
    duration: "187 min",
    director: "S.S. Rajamouli",
    cast: ["N.T. Rama Rao Jr.", "Ram Charan", "Ajay Devgn", "Alia Bhatt"],
    downloadLinks: [
      {
        quality: "480p",
        size: "650MB",
        links: [
          { url: "https://example.com/rrr-480p", server: "Server 1", type: "direct" }
        ]
      },
      {
        quality: "720p",
        size: "1.5GB",
        links: [
          { url: "https://example.com/rrr-720p", server: "Server 1", type: "direct" },
          { url: "https://example.com/rrr-720p-server2", server: "Server 2", type: "direct" }
        ]
      },
      {
        quality: "1080p",
        size: "3.2GB",
        links: [
          { url: "https://example.com/rrr-1080p", server: "Server 1", type: "direct" }
        ]
      }
    ],
    isWebSeries: false,
    tags: ["rajamouli", "period drama", "action", "telugu"],
    isPublished: true,
    views: 180000,
    downloads: 65000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/f0eZNkdAz2ofdPjWI1m8OKTZJvU.jpg", type: "poster", alt: "RRR Poster" }
    ]
  },

  // Web Series
  {
    title: "Scam 1992: The Harshad Mehta Story",
    slug: "scam-1992-harshad-mehta-story",
    description: "Set in 1980's & 90's Bombay, Scam 1992 follows the life of Harshad Mehta - a stockbroker who single-handedly took the stock market to dizzying heights & his catastrophic downfall.",
    year: 2020,
    genre: ["Drama", "Biography", "Crime"],
    category: "Web Series",
    language: ["Hindi"],
    isDualAudio: false,
    poster: "https://image.tmdb.org/t/p/w500/7VYaUzn8rZWYjqAO3TKHlnzOGSI.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xGexTKCJJVcKWJyOymuWUfkTRmK.jpg",
    rating: 9.5,
    duration: "50 min per episode",
    director: "Hansal Mehta",
    cast: ["Pratik Gandhi", "Shreya Dhanwanthary", "Hemant Kher", "Anjali Barot"],
    downloadLinks: [],
    streamingLinks: [
      { platform: "SonyLIV", url: "https://sonyliv.com/scam1992", embedCode: "" }
    ],
    isWebSeries: true,
    totalSeasons: 1,
    totalEpisodes: 10,
    episodes: [
      {
        episodeNumber: 1,
        title: "Dalal Street Ka Bachchan",
        description: "Harshad Mehta's journey from a small-time broker to the biggest bull of Dalal Street begins.",
        duration: "52 min",
        seasonNumber: 1,
        downloadLinks: [
          {
            quality: "720p",
            size: "350MB",
            links: [
              { url: "https://example.com/scam1992-s1e1-720p", server: "Server 1", type: "direct" }
            ]
          },
          {
            quality: "1080p",
            size: "800MB",
            links: [
              { url: "https://example.com/scam1992-s1e1-1080p", server: "Server 1", type: "direct" }
            ]
          }
        ],
        streamingLinks: [
          { platform: "SonyLIV", url: "https://sonyliv.com/scam1992/episode1", quality: "1080p" }
        ],
        thumbnail: "https://image.tmdb.org/t/p/w500/7VYaUzn8rZWYjqAO3TKHlnzOGSI.jpg",
        airDate: new Date("2020-10-09"),
        views: 45000,
        downloads: 12000
      },
      {
        episodeNumber: 2,
        title: "Of Brokers and Bankers",
        description: "Harshad discovers a loophole in the banking system and starts his money circulation scheme.",
        duration: "48 min",
        seasonNumber: 1,
        downloadLinks: [
          {
            quality: "720p",
            size: "340MB",
            links: [
              { url: "https://example.com/scam1992-s1e2-720p", server: "Server 1", type: "direct" }
            ]
          },
          {
            quality: "1080p",
            size: "780MB",
            links: [
              { url: "https://example.com/scam1992-s1e2-1080p", server: "Server 1", type: "direct" }
            ]
          }
        ],
        thumbnail: "https://image.tmdb.org/t/p/w500/7VYaUzn8rZWYjqAO3TKHlnzOGSI.jpg",
        airDate: new Date("2020-10-09"),
        views: 42000,
        downloads: 11500
      },
      {
        episodeNumber: 3,
        title: "Yeh Rishtey Hain Paison Ke",
        description: "Harshad's relationships with banks deepen as he becomes more influential in the market.",
        duration: "51 min",
        seasonNumber: 1,
        downloadLinks: [
          {
            quality: "720p",
            size: "360MB",
            links: [
              { url: "https://example.com/scam1992-s1e3-720p", server: "Server 1", type: "direct" }
            ]
          }
        ],
        thumbnail: "https://image.tmdb.org/t/p/w500/7VYaUzn8rZWYjqAO3TKHlnzOGSI.jpg",
        airDate: new Date("2020-10-16"),
        views: 40000,
        downloads: 11000
      }
    ],
    tags: ["scam", "stock market", "biography", "harshad mehta"],
    isPublished: true,
    views: 95000,
    downloads: 28000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/7VYaUzn8rZWYjqAO3TKHlnzOGSI.jpg", type: "poster", alt: "Scam 1992 Poster" }
    ]
  },

  // Another Web Series
  {
    title: "The Family Man",
    slug: "the-family-man",
    description: "A working man from the National Investigation Agency tries to protect the nation while keeping his family happy.",
    year: 2019,
    genre: ["Action", "Drama", "Thriller"],
    category: "Web Series",
    language: ["Hindi", "Tamil"],
    isDualAudio: false,
    poster: "https://image.tmdb.org/t/p/w500/dlfZjNhkOv6YNjYJCJcWKKnVGjY.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg",
    rating: 8.7,
    duration: "45 min per episode",
    director: "Raj Nidimoru, Krishna D.K.",
    cast: ["Manoj Bajpayee", "Samantha Ruth Prabhu", "Priyamani", "Sharib Hashmi"],
    downloadLinks: [],
    streamingLinks: [
      { platform: "Amazon Prime", url: "https://primevideo.com/familyman", embedCode: "" }
    ],
    isWebSeries: true,
    totalSeasons: 2,
    totalEpisodes: 19,
    episodes: [
      {
        episodeNumber: 1,
        title: "The Bomb",
        description: "Srikant Tiwari is a middle-class man who also serves as a world-class spy.",
        duration: "47 min",
        seasonNumber: 1,
        downloadLinks: [
          {
            quality: "720p",
            size: "380MB",
            links: [
              { url: "https://example.com/familyman-s1e1-720p", server: "Server 1", type: "direct" }
            ]
          },
          {
            quality: "1080p",
            size: "850MB",
            links: [
              { url: "https://example.com/familyman-s1e1-1080p", server: "Server 1", type: "direct" }
            ]
          }
        ],
        thumbnail: "https://image.tmdb.org/t/p/w500/dlfZjNhkOv6YNjYJCJcWKKnVGjY.jpg",
        airDate: new Date("2019-09-20"),
        views: 55000,
        downloads: 15000
      },
      {
        episodeNumber: 2,
        title: "The Cockroach Theory",
        description: "Srikant's mission gets complicated as he tries to balance his family life.",
        duration: "44 min",
        seasonNumber: 1,
        downloadLinks: [
          {
            quality: "720p",
            size: "370MB",
            links: [
              { url: "https://example.com/familyman-s1e2-720p", server: "Server 1", type: "direct" }
            ]
          }
        ],
        thumbnail: "https://image.tmdb.org/t/p/w500/dlfZjNhkOv6YNjYJCJcWKKnVGjY.jpg",
        airDate: new Date("2019-09-20"),
        views: 52000,
        downloads: 14500
      }
    ],
    tags: ["spy", "thriller", "manoj bajpayee", "action"],
    isPublished: true,
    views: 150000,
    downloads: 42000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/dlfZjNhkOv6YNjYJCJcWKKnVGjY.jpg", type: "poster", alt: "The Family Man Poster" }
    ]
  },

  // Dual Audio Movie
  {
    title: "Spider-Man: No Way Home",
    slug: "spider-man-no-way-home-2021",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    year: 2021,
    genre: ["Action", "Adventure", "Fantasy"],
    category: "Dual Audio",
    language: ["English", "Hindi"],
    isDualAudio: true,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    rating: 8.4,
    duration: "148 min",
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"],
    downloadLinks: [
      {
        quality: "480p",
        size: "500MB",
        links: [
          { url: "https://example.com/spiderman-nwh-480p-dual", server: "Server 1", type: "direct" }
        ]
      },
      {
        quality: "720p",
        size: "1.4GB",
        links: [
          { url: "https://example.com/spiderman-nwh-720p-dual", server: "Server 1", type: "direct" },
          { url: "https://example.com/spiderman-nwh-720p-dual-torrent", server: "Torrent", type: "torrent" }
        ]
      },
      {
        quality: "1080p",
        size: "3.5GB",
        links: [
          { url: "https://example.com/spiderman-nwh-1080p-dual", server: "Server 1", type: "direct" }
        ]
      }
    ],
    isWebSeries: false,
    tags: ["spider-man", "marvel", "superhero", "dual audio"],
    isPublished: true,
    views: 220000,
    downloads: 85000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", type: "poster", alt: "Spider-Man No Way Home Poster" }
    ]
  },

  // South Dubbed Movie
  {
    title: "Pushpa: The Rise",
    slug: "pushpa-the-rise-2021",
    description: "A labourer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling. However, violence erupts when the police attempt to bring down his illegal business.",
    year: 2021,
    genre: ["Action", "Crime", "Drama"],
    category: "South Dubbed",
    language: ["Hindi", "Telugu"],
    isDualAudio: true,
    poster: "https://image.tmdb.org/t/p/w500/pU4baeqHZTmNgUy3QkqUBUcuKaJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xGGinKRL8xYMIvz4FoMbNHWnROB.jpg",
    rating: 7.6,
    duration: "179 min",
    director: "Sukumar",
    cast: ["Allu Arjun", "Fahadh Faasil", "Rashmika Mandanna", "Jagapathi Babu"],
    downloadLinks: [
      {
        quality: "480p",
        size: "600MB",
        links: [
          { url: "https://example.com/pushpa-480p-hindi", server: "Server 1", type: "direct" }
        ]
      },
      {
        quality: "720p",
        size: "1.6GB",
        links: [
          { url: "https://example.com/pushpa-720p-hindi", server: "Server 1", type: "direct" }
        ]
      },
      {
        quality: "1080p",
        size: "3.8GB",
        links: [
          { url: "https://example.com/pushpa-1080p-hindi", server: "Server 1", type: "direct" }
        ]
      }
    ],
    isWebSeries: false,
    tags: ["pushpa", "allu arjun", "action", "south dubbed"],
    isPublished: true,
    views: 175000,
    downloads: 62000,
    images: [
      { url: "https://image.tmdb.org/t/p/w500/pU4baeqHZTmNgUy3QkqUBUcuKaJ.jpg", type: "poster", alt: "Pushpa Poster" }
    ]
  }
];

const dummyUsers = [
  {
    username: "admin",
    email: "admin@allmovieshub.com",
    password: "admin123",
    role: "admin"
  },
  {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    role: "user"
  }
];

async function generateDummyData() {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Movie.deleteMany({});
    await User.deleteMany({});

    // Create users
    console.log('Creating users...');
    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`Created user: ${userData.username}`);
    }

    // Create movies
    console.log('Creating movies and web series...');
    for (const movieData of dummyMovies) {
      const movie = new Movie(movieData);
      await movie.save();
      console.log(`Created: ${movieData.title} (${movieData.category})`);
    }

    console.log('\n✅ Dummy data generation completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users created: ${dummyUsers.length}`);
    console.log(`- Movies/Series created: ${dummyMovies.length}`);
    console.log(`- Web Series with episodes: ${dummyMovies.filter(m => m.isWebSeries).length}`);
    console.log(`- Regular movies: ${dummyMovies.filter(m => !m.isWebSeries).length}`);
    
    console.log('\n🎬 Categories breakdown:');
    const categories = {};
    dummyMovies.forEach(movie => {
      categories[movie.category] = (categories[movie.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`- ${category}: ${count}`);
    });

    console.log('\n🔐 Admin Login:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Admin URL: http://localhost:3000/admin-secret-dashboard-2024');

    process.exit(0);
  } catch (error) {
    console.error('Error generating dummy data:', error);
    process.exit(1);
  }
}

generateDummyData();
