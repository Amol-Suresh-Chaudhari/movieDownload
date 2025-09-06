'use client'
import { useState, useEffect } from 'react'
import { Palette, Monitor, Sun, Moon, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    primaryColor: '#3B82F6', // blue-500
    accentColor: '#10B981', // green-500
    backgroundColor: '#111827', // gray-900
    cardColor: '#1F2937', // gray-800
    textColor: '#FFFFFF',
    enableAnimations: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 30000
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
    
    // Apply saved theme on component mount
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      applyTheme(parsedSettings)
    }
  }, [])

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      
      // Apply theme to document
      applyTheme(settings)
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const applyTheme = (themeSettings) => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', themeSettings.primaryColor)
    root.style.setProperty('--accent-color', themeSettings.accentColor)
    root.style.setProperty('--bg-color', themeSettings.backgroundColor)
    root.style.setProperty('--card-color', themeSettings.cardColor)
    root.style.setProperty('--text-color', themeSettings.textColor)
    
    // Set consistent font family for the entire document
    const fontFamily = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    root.style.setProperty('--font-family', fontFamily)
    document.documentElement.style.fontFamily = fontFamily
    
    // Apply theme classes and styles
    if (themeSettings.theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      document.body.style.backgroundColor = '#f9fafb' // gray-50
      document.body.style.color = '#111827' // gray-900
      
      // Apply light theme to specific elements
      const movieCards = document.querySelectorAll('.movie-card, .bg-gray-800, .bg-gray-900')
      movieCards.forEach(card => {
        card.style.backgroundColor = '#f3f4f6' // gray-100
        card.style.color = '#111827' // gray-900
      })
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      document.body.style.backgroundColor = themeSettings.backgroundColor
      document.body.style.color = themeSettings.textColor
      
      // Reset movie cards to dark theme
      const movieCards = document.querySelectorAll('.movie-card, .bg-gray-800, .bg-gray-900')
      movieCards.forEach(card => {
        card.style.backgroundColor = themeSettings.cardColor
        card.style.color = themeSettings.textColor
      })
    }
    
    // Ensure consistent font family across all elements
    document.body.style.fontFamily = fontFamily
    
    // Add CSS rule for consistent font family
    let styleSheet = document.getElementById('theme-font-styles')
    if (!styleSheet) {
      styleSheet = document.createElement('style')
      styleSheet.id = 'theme-font-styles'
      document.head.appendChild(styleSheet)
    }
    
    styleSheet.textContent = `
      *, *::before, *::after {
        font-family: ${fontFamily} !important;
      }
      
      .movie-card, .movie-card * {
        font-family: ${fontFamily} !important;
      }
      
      ${themeSettings.theme === 'light' ? `
        .bg-gray-800, .bg-gray-900 {
          background-color: #f3f4f6 !important;
          color: #111827 !important;
        }
        
        .text-white {
          color: #111827 !important;
        }
        
        .text-gray-300, .text-gray-400 {
          color: #6b7280 !important;
        }
      ` : ''}
    `
    
    // Trigger a custom event for components to listen to theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeSettings }))
  }

  const resetToDefaults = () => {
    const defaultSettings = {
      theme: 'dark',
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      backgroundColor: '#111827',
      cardColor: '#1F2937',
      textColor: '#FFFFFF',
      enableAnimations: true,
      compactMode: false,
      autoRefresh: true,
      refreshInterval: 30000
    }
    setSettings(defaultSettings)
    applyTheme(defaultSettings)
    toast.success('Settings reset to defaults')
  }

  const colorPresets = [
    { name: 'Blue Ocean', primary: '#3B82F6', accent: '#10B981' },
    { name: 'Purple Night', primary: '#8B5CF6', accent: '#F59E0B' },
    { name: 'Red Fire', primary: '#EF4444', accent: '#F97316' },
    { name: 'Green Forest', primary: '#10B981', accent: '#3B82F6' },
    { name: 'Pink Sunset', primary: '#EC4899', accent: '#8B5CF6' },
    { name: 'Orange Glow', primary: '#F97316', accent: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Theme Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme Mode</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    settings.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    settings.theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Movie Theme Color Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newSettings = {
                        ...settings,
                        primaryColor: preset.primary,
                        accentColor: preset.accent
                      }
                      setSettings(newSettings)
                      applyTheme(newSettings)
                    }}
                    className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex space-x-1 mr-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-500"
                        style={{ backgroundColor: preset.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded border border-gray-500"
                        style={{ backgroundColor: preset.accent }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                These colors will be applied to movie cards and tiles throughout the site
              </p>
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Color Customization
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border-2 border-gray-600"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 rounded border-2 border-gray-600"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-10 rounded border-2 border-gray-600"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interface Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Interface Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Enable Animations</label>
                <p className="text-gray-400 text-sm">Enable smooth transitions and animations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAnimations}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Compact Mode</label>
                <p className="text-gray-400 text-sm">Reduce spacing and use smaller elements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Auto Refresh</label>
                <p className="text-gray-400 text-sm">Automatically refresh data periodically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.autoRefresh && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Refresh Interval (seconds)</label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15000}>15 seconds</option>
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                  <option value={600000}>10 minutes</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          
          <div className="space-y-4">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: settings.cardColor }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: settings.textColor }}
              >
                Sample Card
              </h4>
              <p className="text-gray-400 mb-3">
                This is how your interface will look with the selected colors.
              </p>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
