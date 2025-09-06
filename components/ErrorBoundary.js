'use client'
import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-gray-300 cursor-pointer mb-2">Error Details</summary>
                  <div className="bg-gray-900 p-3 rounded text-xs text-red-400 overflow-auto max-h-32">
                    <div className="font-mono">
                      {this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null })
                    window.location.reload()
                  }}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
