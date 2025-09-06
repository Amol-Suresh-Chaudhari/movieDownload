# AllMoviesHub Clone

A modern, AI-powered movie streaming and download platform built with Next.js, featuring an intelligent admin dashboard and automated content generation.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Clean, modern UI that works on all devices
- **Movie Categories**: Bollywood, Hollywood, South movies, Web Series
- **Advanced Search**: Search with filters for quality, year, genre, dual audio
- **Movie Details**: Comprehensive movie pages with download/streaming options
- **Quality Options**: 480p, 720p, 1080p, 4K downloads
- **Dual Audio Support**: Hindi dubbed movies clearly marked

### AI-Powered Admin Dashboard
- **Secure Access**: Hidden admin portal at `/admin-secret-dashboard-2024`
- **AI Movie Generator**: Auto-generate movie pages using OpenAI
- **Content Management**: Add, edit, delete movies with approval workflow
- **Analytics Dashboard**: Track views, downloads, popular content
- **Review System**: AI-generated content requires admin approval

### Technical Features
- **Next.js 14**: Latest React framework with App Router
- **MongoDB**: Scalable database for movie metadata
- **OpenAI Integration**: AI-powered content generation
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Legal Pages**: DMCA, Contact, Privacy Policy

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **AI**: OpenAI GPT-3.5 for content generation
- **Authentication**: JWT-based admin authentication
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd allmovieshub-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/allmovieshub
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   ADMIN_SECRET_PATH=admin-secret-dashboard-2024
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Admin Access

- **URL**: `http://localhost:3000/admin-secret-dashboard-2024`
- **Demo Credentials**: 
  - Username: `admin`
  - Password: `admin123`

## 🤖 AI Movie Generator

The AI-powered movie generator can create complete movie pages with:

- **Auto-generated descriptions** based on title and year
- **Genre classification** and category assignment
- **Cast and crew information** (when available)
- **Quality options** and download links structure
- **SEO-friendly tags** and metadata
- **Dual audio detection** for appropriate movies

### Usage:
1. Access admin dashboard
2. Go to "AI Generator" tab
3. Enter movie title, year, and source platform
4. Click "Generate with AI"
5. Review generated content
6. Save for review or publish directly

## 📱 Key Pages

### Public Pages
- `/` - Homepage with featured movies
- `/movie/[slug]` - Individual movie pages
- `/search` - Advanced search with filters
- `/category/[category]` - Category-specific listings
- `/dmca` - DMCA policy and takedown procedures
- `/contact` - Contact form and support info

### Admin Pages
- `/admin-secret-dashboard-2024` - Secure admin login
- Admin dashboard with:
  - Overview and analytics
  - Movie management
  - AI content generator
  - Settings and configuration

## 🎨 Design Features

- **Dark Theme**: Modern dark UI with blue/purple accents
- **Movie Cards**: Hover effects and quality badges
- **Responsive Grid**: Adapts to all screen sizes
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: User feedback for actions
- **Smooth Animations**: Framer Motion integration

## 🔧 Configuration

### Movie Categories
- Bollywood
- Hollywood (Hindi Dubbed)
- South Movies
- Web Series
- TV Shows

### Quality Options
- 480p (Mobile friendly)
- 720p (HD)
- 1080p (Full HD)
- 4K (Ultra HD)

### Supported Features
- Dual Audio movies
- Multiple download links
- Streaming platform integration
- View/download tracking
- SEO optimization

## 📊 Analytics

The admin dashboard provides insights on:
- Total views and downloads
- Popular movies and categories
- User engagement metrics
- Monthly trends
- AI-generated content performance

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate

## 🔒 Security Features

- **Hidden Admin Routes**: Obscured admin panel URL
- **JWT Authentication**: Secure admin sessions
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security

## 📄 Legal Compliance

- **DMCA Policy**: Complete takedown procedures
- **Privacy Policy**: Data handling transparency
- **Terms of Service**: User agreement
- **Disclaimer**: Content liability protection
- **Contact Information**: Support channels

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📝 License

This project is for educational purposes. Ensure compliance with local laws and copyright regulations when deploying.

## 🆘 Support

- **Email**: support@allmovieshub.com
- **Telegram**: @allmovieshub
- **Issues**: GitHub Issues tab
- **Documentation**: This README file

## 🔮 Future Enhancements

- User authentication and profiles
- Watchlist and favorites
- Advanced recommendation engine
- Mobile app (React Native)
- Torrent integration
- Multi-language support
- Payment integration for premium content
- Social features and reviews

---

**Built with ❤️ using Next.js and OpenAI**
