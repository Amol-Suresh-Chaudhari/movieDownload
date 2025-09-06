# AllMoviesHub API Documentation

## Overview
AllMoviesHub provides a comprehensive REST API for managing movies, authentication, and admin operations. This documentation covers all available endpoints, request/response formats, and authentication requirements.

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Admin endpoints require a valid JWT token in the Authorization header.

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate admin user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b2c8e1234567890abcde",
    "username": "admin",
    "role": "admin"
  }
}
```

#### GET /api/auth/verify
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "64f8b2c8e1234567890abcde",
    "username": "admin",
    "role": "admin"
  }
}
```

### Movies

#### GET /api/movies
Get paginated list of movies with optional filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category (bollywood, hollywood, south, web-series)
- `search` (string): Search in title, description, cast, director
- `year` (number): Filter by release year
- `genre` (string): Filter by genre
- `quality` (string): Filter by quality (480p, 720p, 1080p, 4k)
- `isDualAudio` (boolean): Filter dual audio movies
- `needsReview` (boolean): Admin only - get movies needing review

**Response:**
```json
{
  "movies": [
    {
      "_id": "64f8b2c8e1234567890abcde",
      "title": "Spider-Man: No Way Home",
      "slug": "spider-man-no-way-home",
      "description": "Movie description...",
      "poster": "https://example.com/poster.jpg",
      "year": 2021,
      "category": "Hollywood",
      "genre": ["Action", "Adventure"],
      "rating": 8.4,
      "runtime": "2h 28m",
      "language": "English",
      "isDualAudio": true,
      "cast": "Tom Holland, Zendaya, Benedict Cumberbatch",
      "director": "Jon Watts",
      "downloadLinks": [
        {
          "quality": "480p",
          "size": "400MB",
          "url": "https://example.com/download/480p"
        }
      ],
      "streamingLinks": [
        {
          "platform": "Server 1",
          "url": "https://example.com/stream"
        }
      ],
      "views": 125000,
      "downloads": 45000,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "pages": 13
  }
}
```

#### POST /api/movies
Create a new movie (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Movie Title",
  "slug": "movie-title",
  "description": "Movie description",
  "poster": "https://example.com/poster.jpg",
  "year": 2023,
  "category": "Hollywood",
  "genre": ["Action", "Adventure"],
  "rating": 8.5,
  "runtime": "2h 30m",
  "language": "English",
  "isDualAudio": true,
  "cast": "Actor 1, Actor 2",
  "director": "Director Name",
  "downloadLinks": [
    {
      "quality": "480p",
      "size": "400MB",
      "url": "https://example.com/download/480p"
    }
  ],
  "streamingLinks": [
    {
      "platform": "Server 1",
      "url": "https://example.com/stream"
    }
  ]
}
```

#### GET /api/movies/:id
Get specific movie by ID.

**Response:** Single movie object (same structure as movies array item above)

#### PUT /api/movies/:id
Update existing movie (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial movie object with fields to update

#### DELETE /api/movies/:id
Delete movie (Admin only).

**Headers:** `Authorization: Bearer <token>`

#### POST /api/movies/:id/approve
Approve movie for publication (Admin only).

**Headers:** `Authorization: Bearer <token>`

### Episodes (Web Series)

#### GET /api/movies/:id/episodes
Get episodes for a web series.

**Response:**
```json
{
  "episodes": [
    {
      "_id": "64f8b2c8e1234567890abcde",
      "episodeNumber": 1,
      "title": "Episode 1: Pilot",
      "description": "First episode description",
      "duration": "45 minutes",
      "downloadLinks": [
        {
          "quality": "720p",
          "size": "800MB",
          "url": "https://example.com/episode1/720p"
        }
      ],
      "streamingLinks": [
        {
          "platform": "Server 1",
          "url": "https://example.com/stream/episode1"
        }
      ]
    }
  ]
}
```

#### POST /api/movies/:id/episodes
Add episode to web series (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "episodeNumber": 1,
  "title": "Episode 1: Pilot",
  "description": "Episode description",
  "duration": "45 minutes",
  "downloadLinks": [
    {
      "quality": "720p",
      "size": "800MB",
      "url": "https://example.com/episode1/720p"
    }
  ],
  "streamingLinks": [
    {
      "platform": "Server 1",
      "url": "https://example.com/stream/episode1"
    }
  ]
}
```

### Admin

#### GET /api/admin/stats
Get admin dashboard statistics (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalMovies": 150,
  "totalUsers": 1250,
  "totalViews": 45000,
  "totalDownloads": 12000,
  "recentMovies": [
    {
      "_id": "64f8b2c8e1234567890abcde",
      "title": "Latest Movie",
      "category": "Hollywood",
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/movies/generate
Generate movie details using AI (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "prompt": "Create a sci-fi action movie about space exploration",
  "category": "Hollywood",
  "year": 2023
}
```

### Utility Endpoints

#### GET /sitemap.xml
Get XML sitemap for SEO.

**Response:** XML sitemap with all pages and movies

#### GET /robots.txt
Get robots.txt file.

**Response:** Plain text robots.txt content

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## Rate Limiting
Admin login endpoint is rate limited to 5 attempts per 15 minutes per IP address.

## Security Features
- JWT token authentication
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Admin path obfuscation via environment variables
- Comprehensive logging for security events

## Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/allmovieshub
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_PATH=admin-secret-dashboard-2024
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

## Postman Collection
Import the provided `AllMoviesHub_API_Collection.json` file into Postman for easy API testing. The collection includes:
- Pre-configured requests for all endpoints
- Environment variables setup
- Automatic token management
- Response validation tests

## Support
For API support or questions, contact the development team or refer to the project documentation.
