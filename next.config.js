/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com', 'localhost'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ADMIN_SECRET_PATH: process.env.ADMIN_SECRET_PATH,
  },
}

module.exports = nextConfig
