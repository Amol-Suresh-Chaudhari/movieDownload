const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js').default;
const Movie = require('../models/Movie.js').default;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/allmovieshub';

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@allmovieshub.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Admin user created');
      console.log('   Username: admin');
      console.log('   Email: admin@allmovieshub.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Add sample movies
    const movieCount = await Movie.countDocuments();
    
    if (movieCount === 0) {
      const sampleMovies = [
        {
          title: 'Avengers: Endgame',
          slug: 'avengers-endgame-2019',
          description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
          year: 2019,
          genre: ['Action', 'Adventure', 'Drama'],
          category: 'Hollywood',
          language: ['English'],
          isDualAudio: true,
          poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
          backdrop: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
          rating: 8.4,
          duration: '181 min',
          director: 'Anthony Russo, Joe Russo',
          cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
          downloadLinks: [
            { quality: '480p', size: '450MB', url: 'https://example.com/download/480p', type: 'direct' },
            { quality: '720p', size: '1.2GB', url: 'https://example.com/download/720p', type: 'direct' },
            { quality: '1080p', size: '2.5GB', url: 'https://example.com/download/1080p', type: 'direct' }
          ],
          streamingLinks: [
            { platform: 'Netflix', url: 'https://netflix.com/watch/avengers-endgame' }
          ],
          tags: ['Marvel', 'Superhero', 'Action'],
          isPublished: true,
          views: 15420,
          downloads: 8932
        },
        {
          title: 'RRR',
          slug: 'rrr-2022',
          description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
          year: 2022,
          genre: ['Action', 'Drama'],
          category: 'South',
          language: ['Telugu', 'Hindi'],
          isDualAudio: true,
          poster: 'https://image.tmdb.org/t/p/w500/f4H7gsmMxXztsP5bJ2dOJ4LIbFt.jpg',
          backdrop: 'https://image.tmdb.org/t/p/w1280/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
          rating: 8.8,
          duration: '187 min',
          director: 'S.S. Rajamouli',
          cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
          downloadLinks: [
            { quality: '480p', size: '500MB', url: 'https://example.com/download/rrr-480p', type: 'direct' },
            { quality: '720p', size: '1.4GB', url: 'https://example.com/download/rrr-720p', type: 'direct' },
            { quality: '1080p', size: '3.2GB', url: 'https://example.com/download/rrr-1080p', type: 'direct' }
          ],
          tags: ['Rajamouli', 'Period Drama', 'Action'],
          isPublished: true,
          views: 23150,
          downloads: 12400
        },
        {
          title: '3 Idiots',
          slug: '3-idiots-2009',
          description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.',
          year: 2009,
          genre: ['Comedy', 'Drama'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
          backdrop: 'https://image.tmdb.org/t/p/w1280/3UBQGKS8c7UgOGD4YhQZhqCyJdN.jpg',
          rating: 8.4,
          duration: '170 min',
          director: 'Rajkumar Hirani',
          cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor'],
          downloadLinks: [
            { quality: '480p', size: '400MB', url: 'https://example.com/download/3idiots-480p', type: 'direct' },
            { quality: '720p', size: '1.1GB', url: 'https://example.com/download/3idiots-720p', type: 'direct' },
            { quality: '1080p', size: '2.8GB', url: 'https://example.com/download/3idiots-1080p', type: 'direct' }
          ],
          tags: ['Comedy', 'Bollywood', 'Aamir Khan'],
          isPublished: true,
          views: 18750,
          downloads: 9200
        },
        {
          title: 'Stranger Things',
          slug: 'stranger-things-season-4',
          description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
          year: 2022,
          genre: ['Drama', 'Fantasy', 'Horror'],
          category: 'Web Series',
          language: ['English'],
          isDualAudio: true,
          poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
          backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
          rating: 8.7,
          duration: '60 min/episode',
          director: 'The Duffer Brothers',
          cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
          downloadLinks: [
            { quality: '480p', size: '350MB/episode', url: 'https://example.com/download/st4-480p', type: 'direct' },
            { quality: '720p', size: '800MB/episode', url: 'https://example.com/download/st4-720p', type: 'direct' },
            { quality: '1080p', size: '1.5GB/episode', url: 'https://example.com/download/st4-1080p', type: 'direct' }
          ],
          streamingLinks: [
            { platform: 'Netflix', url: 'https://netflix.com/title/80057281' }
          ],
          tags: ['Netflix', 'Sci-Fi', 'Horror'],
          isPublished: true,
          views: 31200,
          downloads: 15600
        },
        {
          title: 'Spider-Man: No Way Home',
          slug: 'spider-man-no-way-home-2021',
          description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
          year: 2021,
          genre: ['Action', 'Adventure', 'Sci-Fi'],
          category: 'Hollywood',
          language: ['English'],
          isDualAudio: true,
          poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
          backdrop: 'https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
          rating: 8.2,
          duration: '148 min',
          director: 'Jon Watts',
          cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
          downloadLinks: [
            { quality: '480p', size: '420MB', url: 'https://example.com/download/spiderman-480p', type: 'direct' },
            { quality: '720p', size: '1.3GB', url: 'https://example.com/download/spiderman-720p', type: 'direct' },
            { quality: '1080p', size: '2.9GB', url: 'https://example.com/download/spiderman-1080p', type: 'direct' }
          ],
          tags: ['Marvel', 'Spider-Man', 'Action'],
          isPublished: true,
          views: 28900,
          downloads: 16700
        }
      ];

      await Movie.insertMany(sampleMovies);
      console.log(`✅ Added ${sampleMovies.length} sample movies`);
    } else {
      console.log(`ℹ️  Database already has ${movieCount} movies`);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Admin Login Details:');
    console.log('   URL: http://localhost:3000/admin-secret-dashboard-2024');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

setupAdmin();
