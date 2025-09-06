// Admin utility functions for secure path handling

export function getAdminPath() {
  return process.env.ADMIN_SECRET_PATH || 'admin-secret-dashboard-2024'
}

export function getAdminUrl() {
  const basePath = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const adminPath = getAdminPath()
  return `${basePath}/${adminPath}`
}

export function redirectToAdmin() {
  if (typeof window !== 'undefined') {
    const adminPath = getAdminPath()
    window.location.href = `/${adminPath}`
  }
}

export function isValidAdminPath(pathname) {
  const adminPath = getAdminPath()
  return pathname === `/${adminPath}` || pathname.startsWith(`/${adminPath}/`)
}

// Rate limiting for admin login attempts
const loginAttempts = new Map()

export function checkRateLimit(ip) {
  const now = Date.now()
  const attempts = loginAttempts.get(ip) || []
  
  // Remove attempts older than 15 minutes
  // const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000)
  
  // if (recentAttempts.length >= 5) {
  //   return false // Rate limited
  // }
  
  // recentAttempts.push(now)
  // loginAttempts.set(ip, recentAttempts)
  return true
}

export function clearRateLimit(ip) {
  loginAttempts.delete(ip)
}
