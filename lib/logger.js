// Production-ready logging system
import fs from 'fs'
import path from 'path'

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs')
    this.ensureLogDirectory()
  }

  ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true })
      }
    } catch (error) {
      // In read-only environments (like serverless), we can't create directories
      console.warn('Cannot create log directory (read-only filesystem):', error.message)
      this.readOnlyMode = true
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
      pid: process.pid,
      env: process.env.NODE_ENV || 'development'
    }
    return JSON.stringify(logEntry) + '\n'
  }

  writeToFile(filename, content) {
    // Skip file writing in read-only environments
    if (this.readOnlyMode) {
      return
    }
    
    try {
      const filePath = path.join(this.logDir, filename)
      fs.appendFileSync(filePath, content)
    } catch (error) {
      // If we can't write to file, switch to read-only mode
      if (error.code === 'EROFS' || error.code === 'EACCES') {
        console.warn('Switching to read-only logging mode:', error.message)
        this.readOnlyMode = true
      } else {
        console.error('Logging error:', error.message)
      }
    }
  }

  info(message, meta = {}) {
    const logMessage = this.formatMessage('INFO', message, meta)
    console.log(`ℹ️  ${message}`, meta)
    this.writeToFile('app.log', logMessage)
  }

  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    }
    const logMessage = this.formatMessage('ERROR', message, errorMeta)
    console.error(`❌ ${message}`, error || meta)
    this.writeToFile('error.log', logMessage)
  }

  warn(message, meta = {}) {
    const logMessage = this.formatMessage('WARN', message, meta)
    console.warn(`⚠️  ${message}`, meta)
    this.writeToFile('app.log', logMessage)
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, meta)
      console.debug(`🐛 ${message}`, meta)
      this.writeToFile('debug.log', logMessage)
    }
  }

  // API request logging
  apiRequest(method, url, statusCode, responseTime, meta = {}) {
    const logMessage = this.formatMessage('API', `${method} ${url}`, {
      method,
      url,
      statusCode,
      responseTime,
      ...meta
    })
    console.log(`🌐 ${method} ${url} - ${statusCode} (${responseTime}ms)`)
    this.writeToFile('api.log', logMessage)
  }

  // Security event logging
  security(event, details = {}) {
    const logMessage = this.formatMessage('SECURITY', event, {
      event,
      ...details,
      timestamp: new Date().toISOString()
    })
    console.warn(`🔒 SECURITY: ${event}`, details)
    this.writeToFile('security.log', logMessage)
  }

  // Database operation logging
  database(operation, collection, details = {}) {
    const logMessage = this.formatMessage('DATABASE', `${operation} on ${collection}`, {
      operation,
      collection,
      ...details
    })
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗄️  DB: ${operation} on ${collection}`, details)
    }
    this.writeToFile('database.log', logMessage)
  }

  // Performance monitoring
  performance(metric, value, unit = 'ms', meta = {}) {
    const logMessage = this.formatMessage('PERFORMANCE', `${metric}: ${value}${unit}`, {
      metric,
      value,
      unit,
      ...meta
    })
    console.log(`⚡ PERF: ${metric}: ${value}${unit}`)
    this.writeToFile('performance.log', logMessage)
  }
}

// Create singleton instance
const logger = new Logger()

// Middleware for API request logging
export function createApiLogger() {
  return (req, res, next) => {
    const start = Date.now()
    const originalSend = res.send

    res.send = function(data) {
      const responseTime = Date.now() - start
      logger.apiRequest(
        req.method,
        req.url,
        res.statusCode,
        responseTime,
        {
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          contentLength: data ? data.length : 0
        }
      )
      return originalSend.call(this, data)
    }

    if (next) next()
  }
}

// Error handler middleware
export function createErrorHandler() {
  return (error, req, res, next) => {
    logger.error('Unhandled API Error', error, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    })

    if (res.headersSent) {
      return next(error)
    }

    res.status(500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message
    })
  }
}

export default logger
