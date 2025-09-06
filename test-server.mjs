import { spawn } from 'child_process'
import fetch from 'node-fetch'

console.log('🚀 Starting Next.js development server...')

const server = spawn('node', ['node_modules/next/dist/bin/next', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe'
})

server.stdout.on('data', (data) => {
  console.log(data.toString())
  
  // Check if server is ready
  if (data.toString().includes('Ready')) {
    console.log('✅ Server is ready!')
    testAPI()
  }
})

server.stderr.on('data', (data) => {
  console.error(data.toString())
})

async function testAPI() {
  console.log('\n🧪 Testing API endpoints...')
  
  try {
    // Test movies endpoint
    console.log('Testing /api/movies...')
    const moviesResponse = await fetch('http://localhost:3000/api/movies')
    const moviesData = await moviesResponse.json()
    console.log(`✅ Movies API: Found ${moviesData.movies?.length || 0} movies`)
    
    // Test admin login
    console.log('Testing admin login...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    })
    const loginData = await loginResponse.json()
    
    if (loginResponse.ok) {
      console.log('✅ Admin login successful')
      console.log(`   User: ${loginData.user.username} (${loginData.user.role})`)
      
      // Test movie CRUD with admin token
      console.log('Testing movie CRUD operations...')
      const token = loginData.token
      
      // Test getting a movie
      if (moviesData.movies?.length > 0) {
        const movieId = moviesData.movies[0]._id
        const movieResponse = await fetch(`http://localhost:3000/api/movies/${movieId}`)
        const movieData = await movieResponse.json()
        console.log(`✅ Get movie: ${movieData.title}`)
        
        // Test updating movie
        const updateResponse = await fetch(`http://localhost:3000/api/movies/${movieId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ views: (movieData.views || 0) + 1 })
        })
        
        if (updateResponse.ok) {
          console.log('✅ Movie update successful')
        } else {
          console.log('❌ Movie update failed')
        }
      }
      
    } else {
      console.log('❌ Admin login failed:', loginData.error)
    }
    
    console.log('\n🎉 API testing completed!')
    console.log('\n📋 Admin Access:')
    console.log('   URL: http://localhost:3000/admin-secret-dashboard-2024')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    console.log('\n🌐 Frontend: http://localhost:3000')
    
  } catch (error) {
    console.error('❌ API test failed:', error.message)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...')
  server.kill()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.kill()
  process.exit(0)
})
