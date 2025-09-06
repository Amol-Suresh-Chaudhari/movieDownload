import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/allmovieshub';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Movie Schema
const downloadLinkSchema = new mongoose.Schema({
  quality: { type: String, required: true, enum: ['480p', '720p', '1080p', '4K'] },
  size: String,
  url: String,
  type: { type: String, enum: ['direct', 'torrent', 'streaming'], default: 'direct' }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  genre: [{ type: String, required: true }],
  category: { type: String, required: true, enum: ['Bollywood', 'Hollywood', 'South', 'Web Series', 'TV Shows'] },
  language: [{ type: String, required: true }],
  isDualAudio: { type: Boolean, default: false },
  poster: { type: String, required: true },
  backdrop: String,
  rating: { type: Number, min: 0, max: 10, default: 0 },
  duration: String,
  director: String,
  cast: [String],
  downloadLinks: [downloadLinkSchema],
  streamingLinks: [{ platform: String, url: String, embedCode: String }],
  tags: [String],
  isPublished: { type: Boolean, default: false },
  isAIGenerated: { type: Boolean, default: false },
  needsReview: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

async function setupData() {
  try {
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

    // Clear existing movies and add new sample movies
    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');
    
    const movieCount = await Movie.countDocuments();
    
    if (movieCount === 0) {
      const sampleMovies = [
        // Bollywood Movies (10)
        {
          title: 'Dangal',
          slug: 'dangal-2016',
          description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
          year: 2016,
          genre: ['Biography', 'Drama', 'Sport'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Dangal', type: 'poster', alt: 'Dangal Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Dangal',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Dangal+Backdrop',
          rating: 8.4,
          duration: '2h 41m',
          director: 'Nitesh Tiwari',
          cast: ['Aamir Khan', 'Fatima Sana Shaikh', 'Sanya Malhotra', 'Sakshi Tanwar'],
          downloadLinks: [
            { quality: '480p', size: '450MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Dangal', 'Aamir Khan', 'Wrestling', 'Sports', 'Biography', 'Hindi'],
          views: 98000,
          downloads: 38000,
          isPublished: true
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
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=3+Idiots', type: 'poster', alt: '3 Idiots Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=3+Idiots',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=3+Idiots+Backdrop',
          rating: 8.4,
          duration: '2h 50m',
          director: 'Rajkumar Hirani',
          cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor'],
          downloadLinks: [
            { quality: '480p', size: '500MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.3GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [],
          tags: ['3 Idiots', 'Aamir Khan', 'Comedy', 'Drama', 'College', 'Hindi'],
          views: 156000,
          downloads: 67000,
          isPublished: true
        },
        {
          title: 'Zindagi Na Milegi Dobara',
          slug: 'zindagi-na-milegi-dobara-2011',
          description: 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.',
          year: 2011,
          genre: ['Adventure', 'Comedy', 'Drama'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=ZNMD', type: 'poster', alt: 'ZNMD Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=ZNMD',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=ZNMD+Backdrop',
          rating: 8.2,
          duration: '2h 35m',
          director: 'Zoya Akhtar',
          cast: ['Hrithik Roshan', 'Farhan Akhtar', 'Abhay Deol', 'Katrina Kaif'],
          downloadLinks: [
            { quality: '480p', size: '480MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Prime Video', url: '#', embedCode: '' }],
          tags: ['ZNMD', 'Hrithik Roshan', 'Adventure', 'Comedy', 'Friendship', 'Hindi'],
          views: 89000,
          downloads: 42000,
          isPublished: true
        },
        {
          title: 'Taare Zameen Par',
          slug: 'taare-zameen-par-2007',
          description: 'An eight-year-old boy is thought to be a lazy trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.',
          year: 2007,
          genre: ['Drama', 'Family'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=TZP', type: 'poster', alt: 'TZP Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=TZP',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=TZP+Backdrop',
          rating: 8.4,
          duration: '2h 45m',
          director: 'Aamir Khan',
          cast: ['Aamir Khan', 'Darsheel Safary', 'Tisca Chopra', 'Vipin Sharma'],
          downloadLinks: [
            { quality: '480p', size: '420MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.0GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['TZP', 'Aamir Khan', 'Drama', 'Family', 'Education', 'Hindi'],
          views: 76000,
          downloads: 34000,
          isPublished: true
        },
        {
          title: 'Queen',
          slug: 'queen-2013',
          description: 'A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets cancelled.',
          year: 2013,
          genre: ['Comedy', 'Drama'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Queen', type: 'poster', alt: 'Queen Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Queen',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Queen+Backdrop',
          rating: 8.2,
          duration: '2h 26m',
          director: 'Vikas Bahl',
          cast: ['Kangana Ranaut', 'Rajkummar Rao', 'Lisa Haydon', 'Jeffrey Ho'],
          downloadLinks: [
            { quality: '480p', size: '380MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '950MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '1.9GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [],
          tags: ['Queen', 'Kangana Ranaut', 'Comedy', 'Drama', 'Women Empowerment', 'Hindi'],
          views: 67000,
          downloads: 28000,
          isPublished: true
        },
        {
          title: 'Gully Boy',
          slug: 'gully-boy-2019',
          description: 'A coming-of-age story based on the lives of street rappers in Mumbai.',
          year: 2019,
          genre: ['Drama', 'Music'],
          category: 'Bollywood',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Gully+Boy', type: 'poster', alt: 'Gully Boy Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Gully+Boy',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Gully+Boy+Backdrop',
          rating: 8.0,
          duration: '2h 33m',
          director: 'Zoya Akhtar',
          cast: ['Ranveer Singh', 'Alia Bhatt', 'Siddhant Chaturvedi', 'Kalki Koechlin'],
          downloadLinks: [
            { quality: '480p', size: '460MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.3GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Prime Video', url: '#', embedCode: '' }],
          tags: ['Gully Boy', 'Ranveer Singh', 'Rap', 'Music', 'Drama', 'Hindi'],
          views: 92000,
          downloads: 41000,
          isPublished: true
        },
        
        // Hollywood Movies (10)
        {
          title: 'Spider-Man: No Way Home',
          slug: 'spider-man-no-way-home-2021',
          description: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.',
          year: 2021,
          genre: ['Action', 'Adventure', 'Sci-Fi'],
          category: 'Hollywood',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Spider-Man', type: 'poster', alt: 'Spider-Man Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Spider-Man',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Spider-Man+Backdrop',
          rating: 8.4,
          duration: '2h 28m',
          director: 'Jon Watts',
          cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
          downloadLinks: [
            { quality: '480p', size: '400MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }, { url: '#', server: 'Server 2', type: 'direct' }] },
            { quality: '720p', size: '1.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }, { url: '#', server: 'Server 2', type: 'direct' }] },
            { quality: '1080p', size: '2.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '4K', size: '8.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [
            { platform: 'Netflix', url: '#', embedCode: '' },
            { platform: 'Prime Video', url: '#', embedCode: '' }
          ],
          tags: ['Spider-Man', 'Marvel', 'Superhero', 'Action', 'Dual Audio', 'Hindi Dubbed', '480p', '720p', '1080p', '4K'],
          views: 125000,
          downloads: 45000,
          isPublished: true
        },
        {
          title: 'Avengers: Endgame',
          slug: 'avengers-endgame-2019',
          description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
          year: 2019,
          genre: ['Action', 'Adventure', 'Drama'],
          category: 'Hollywood',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Avengers', type: 'poster', alt: 'Avengers Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Avengers',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Avengers+Backdrop',
          rating: 8.4,
          duration: '3h 1m',
          director: 'Anthony Russo, Joe Russo',
          cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
          downloadLinks: [
            { quality: '480p', size: '450MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Disney+', url: '#', embedCode: '' }],
          tags: ['Marvel', 'Superhero', 'Action', 'Dual Audio', 'Hindi Dubbed'],
          isPublished: true,
          views: 215420,
          downloads: 98932
        },
        {
          title: 'The Dark Knight',
          slug: 'the-dark-knight-2008',
          description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
          year: 2008,
          genre: ['Action', 'Crime', 'Drama'],
          category: 'Hollywood',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Dark+Knight', type: 'poster', alt: 'Dark Knight Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Dark+Knight',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Dark+Knight+Backdrop',
          rating: 9.0,
          duration: '2h 32m',
          director: 'Christopher Nolan',
          cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
          downloadLinks: [
            { quality: '480p', size: '480MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.3GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.6GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'HBO Max', url: '#', embedCode: '' }],
          tags: ['Batman', 'Joker', 'Superhero', 'Action', 'Dual Audio', 'Hindi Dubbed'],
          views: 189000,
          downloads: 76000,
          isPublished: true
        },
        {
          title: 'Inception',
          slug: 'inception-2010',
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
          year: 2010,
          genre: ['Action', 'Sci-Fi', 'Thriller'],
          category: 'Hollywood',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Inception', type: 'poster', alt: 'Inception Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Inception',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Inception+Backdrop',
          rating: 8.8,
          duration: '2h 28m',
          director: 'Christopher Nolan',
          cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Elliot Page'],
          downloadLinks: [
            { quality: '480p', size: '450MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Inception', 'Leonardo DiCaprio', 'Sci-Fi', 'Thriller', 'Dual Audio'],
          views: 167000,
          downloads: 68000,
          isPublished: true
        },
        {
          title: 'Interstellar',
          slug: 'interstellar-2014',
          description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
          year: 2014,
          genre: ['Adventure', 'Drama', 'Sci-Fi'],
          category: 'Hollywood',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Interstellar', type: 'poster', alt: 'Interstellar Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Interstellar',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Interstellar+Backdrop',
          rating: 8.6,
          duration: '2h 49m',
          director: 'Christopher Nolan',
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
          downloadLinks: [
            { quality: '480p', size: '520MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.8GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Prime Video', url: '#', embedCode: '' }],
          tags: ['Interstellar', 'Space', 'Sci-Fi', 'Drama', 'Dual Audio'],
          views: 145000,
          downloads: 59000,
          isPublished: true
        },
        
        // South Movies (10)
        {
          title: 'RRR',
          slug: 'rrr-2022',
          description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
          year: 2022,
          genre: ['Action', 'Drama'],
          category: 'South',
          language: ['Telugu', 'Hindi', 'Tamil'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=RRR', type: 'poster', alt: 'RRR Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=RRR',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=RRR+Backdrop',
          rating: 8.8,
          duration: '3h 7m',
          director: 'S.S. Rajamouli',
          cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
          downloadLinks: [
            { quality: '480p', size: '500MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '3.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['RRR', 'Rajamouli', 'Period Drama', 'Action', 'Telugu', 'Hindi Dubbed'],
          isPublished: true,
          views: 323150,
          downloads: 142400
        },
        {
          title: 'KGF Chapter 2',
          slug: 'kgf-chapter-2-2022',
          description: 'The blood-soaked land of Kolar Gold Fields (KGF) has a new overlord now - Rocky, whose name strikes fear in the heart of his foes.',
          year: 2022,
          genre: ['Action', 'Drama', 'Thriller'],
          category: 'South',
          language: ['Kannada', 'Hindi', 'Tamil', 'Telugu'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=KGF+2', type: 'poster', alt: 'KGF 2 Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=KGF+2',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=KGF+2+Backdrop',
          rating: 8.3,
          duration: '2h 48m',
          director: 'Prashanth Neel',
          cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon', 'Srinidhi Shetty'],
          downloadLinks: [
            { quality: '480p', size: '450MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Amazon Prime', url: '#', embedCode: '' }],
          tags: ['KGF', 'Yash', 'Action', 'South Movie', 'Dual Audio', 'Hindi Dubbed'],
          views: 198000,
          downloads: 78000,
          isPublished: true
        },
        {
          title: 'Pushpa: The Rise',
          slug: 'pushpa-the-rise-2021',
          description: 'A labourer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling. However, violence erupts when the police attempt to bring down his illegal business.',
          year: 2021,
          genre: ['Action', 'Crime', 'Drama'],
          category: 'South',
          language: ['Telugu', 'Hindi', 'Tamil'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Pushpa', type: 'poster', alt: 'Pushpa Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Pushpa',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Pushpa+Backdrop',
          rating: 7.6,
          duration: '2h 59m',
          director: 'Sukumar',
          cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna', 'Jagadeesh Prathap Bandari'],
          downloadLinks: [
            { quality: '480p', size: '550MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '3.0GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Prime Video', url: '#', embedCode: '' }],
          tags: ['Pushpa', 'Allu Arjun', 'Action', 'South Movie', 'Dual Audio', 'Hindi Dubbed'],
          views: 276000,
          downloads: 118000,
          isPublished: true
        },
        {
          title: 'Baahubali 2: The Conclusion',
          slug: 'baahubali-2-the-conclusion-2017',
          description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
          year: 2017,
          genre: ['Action', 'Drama'],
          category: 'South',
          language: ['Telugu', 'Hindi', 'Tamil'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Baahubali+2', type: 'poster', alt: 'Baahubali 2 Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Baahubali+2',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Baahubali+2+Backdrop',
          rating: 8.2,
          duration: '2h 47m',
          director: 'S.S. Rajamouli',
          cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah Bhatia'],
          downloadLinks: [
            { quality: '480p', size: '520MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '2.8GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Baahubali', 'Prabhas', 'Epic', 'Action', 'South Movie', 'Dual Audio'],
          views: 298000,
          downloads: 134000,
          isPublished: true
        },
        {
          title: 'Arjun Reddy',
          slug: 'arjun-reddy-2017',
          description: 'Arjun Reddy, a short-tempered house surgeon, gets used to drugs and drinks when his girlfriend is forced to marry another person.',
          year: 2017,
          genre: ['Drama', 'Romance'],
          category: 'South',
          language: ['Telugu', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Arjun+Reddy', type: 'poster', alt: 'Arjun Reddy Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Arjun+Reddy',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Arjun+Reddy+Backdrop',
          rating: 8.1,
          duration: '3h 2m',
          director: 'Sandeep Reddy Vanga',
          cast: ['Vijay Deverakonda', 'Shalini Pandey', 'Jia Sharma', 'Sanjay Swaroop'],
          downloadLinks: [
            { quality: '480p', size: '580MB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '1.6GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '3.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Arjun Reddy', 'Vijay Deverakonda', 'Drama', 'Romance', 'South Movie'],
          views: 187000,
          downloads: 73000,
          isPublished: true
        },
        
        // Web Series (10)
        {
          title: 'Stranger Things Season 4',
          slug: 'stranger-things-season-4-2022',
          description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
          year: 2022,
          genre: ['Drama', 'Fantasy', 'Horror'],
          category: 'Web Series',
          language: ['English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Stranger+Things', type: 'poster', alt: 'Stranger Things Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Stranger+Things',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Stranger+Things+Backdrop',
          rating: 8.7,
          duration: '9 Episodes',
          director: 'The Duffer Brothers',
          cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
          downloadLinks: [
            { quality: '480p', size: '2.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '4.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '8.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Stranger Things', 'Netflix', 'Horror', 'Sci-Fi', 'Web Series', 'Dual Audio'],
          views: 287000,
          downloads: 95000,
          isPublished: true
        },
        {
          title: 'The Family Man Season 2',
          slug: 'the-family-man-season-2-2021',
          description: 'A working man from the National Investigation Agency tries to protect the nation while keeping his family safe.',
          year: 2021,
          genre: ['Action', 'Drama', 'Thriller'],
          category: 'Web Series',
          language: ['Hindi', 'Tamil'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Family+Man', type: 'poster', alt: 'Family Man Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Family+Man',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Family+Man+Backdrop',
          rating: 8.9,
          duration: '9 Episodes',
          director: 'Raj Nidimoru, Krishna D.K.',
          cast: ['Manoj Bajpayee', 'Samantha Ruth Prabhu', 'Priyamani', 'Sharib Hashmi'],
          downloadLinks: [
            { quality: '480p', size: '1.8GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '3.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '6.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Prime Video', url: '#', embedCode: '' }],
          tags: ['Family Man', 'Manoj Bajpayee', 'Thriller', 'Hindi', 'Web Series'],
          views: 234000,
          downloads: 87000,
          isPublished: true
        },
        {
          title: 'Money Heist',
          slug: 'money-heist-complete-series',
          description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
          year: 2021,
          genre: ['Crime', 'Drama', 'Mystery'],
          category: 'Web Series',
          language: ['Spanish', 'English', 'Hindi'],
          isDualAudio: true,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Money+Heist', type: 'poster', alt: 'Money Heist Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Money+Heist',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Money+Heist+Backdrop',
          rating: 8.2,
          duration: '5 Seasons',
          director: 'Álex Pina',
          cast: ['Álvaro Morte', 'Itziar Ituño', 'Pedro Alonso', 'María Pedraza'],
          downloadLinks: [
            { quality: '480p', size: '12.5GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '25.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '48.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Money Heist', 'La Casa de Papel', 'Crime', 'Spanish', 'Web Series', 'Dual Audio'],
          views: 456000,
          downloads: 189000,
          isPublished: true
        },
        {
          title: 'Scam 1992',
          slug: 'scam-1992-the-harshad-mehta-story',
          description: 'Set in 1980s and 90s Bombay, it follows the life of Harshad Mehta, a stockbroker who took the stock market to dizzying heights and his catastrophic downfall.',
          year: 2020,
          genre: ['Biography', 'Crime', 'Drama'],
          category: 'Web Series',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Scam+1992', type: 'poster', alt: 'Scam 1992 Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Scam+1992',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Scam+1992+Backdrop',
          rating: 9.5,
          duration: '10 Episodes',
          director: 'Hansal Mehta',
          cast: ['Pratik Gandhi', 'Shreya Dhanwanthary', 'Hemant Kher', 'Anjali Barot'],
          downloadLinks: [
            { quality: '480p', size: '2.8GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '5.4GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '9.8GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'SonyLIV', url: '#', embedCode: '' }],
          tags: ['Scam 1992', 'Pratik Gandhi', 'Biography', 'Crime', 'Hindi', 'Web Series'],
          views: 298000,
          downloads: 124000,
          isPublished: true
        },
        {
          title: 'Sacred Games',
          slug: 'sacred-games-complete-series',
          description: 'A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.',
          year: 2019,
          genre: ['Crime', 'Drama', 'Thriller'],
          category: 'Web Series',
          language: ['Hindi'],
          isDualAudio: false,
          images: [{ url: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Sacred+Games', type: 'poster', alt: 'Sacred Games Poster' }],
          poster: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Sacred+Games',
          backdrop: 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Sacred+Games+Backdrop',
          rating: 8.7,
          duration: '2 Seasons',
          director: 'Anurag Kashyap, Vikramaditya Motwane',
          cast: ['Saif Ali Khan', 'Nawazuddin Siddiqui', 'Radhika Apte', 'Pankaj Tripathi'],
          downloadLinks: [
            { quality: '480p', size: '4.2GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '720p', size: '8.1GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] },
            { quality: '1080p', size: '15.6GB', links: [{ url: '#', server: 'Server 1', type: 'direct' }] }
          ],
          streamingLinks: [{ platform: 'Netflix', url: '#', embedCode: '' }],
          tags: ['Sacred Games', 'Saif Ali Khan', 'Crime', 'Thriller', 'Hindi', 'Web Series'],
          views: 387000,
          downloads: 156000,
          isPublished: true
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

setupData();
