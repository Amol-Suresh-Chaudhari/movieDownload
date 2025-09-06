'use client';
import Link from 'next/link'
import { Film, Mail, MessageCircle, Shield, FileText } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AllMoviesHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your ultimate destination for downloading the latest movies and web series in HD quality. 
              Enjoy Bollywood, Hollywood, and South movies with dual audio options.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://t.me/allmovieshub"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Telegram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/bollywood" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Bollywood Movies
                </Link>
              </li>
              <li>
                <Link href="/category/hollywood" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hollywood Movies
                </Link>
              </li>
              <li>
                <Link href="/category/south" className="text-gray-400 hover:text-white transition-colors duration-200">
                  South Movies
                </Link>
              </li>
              <li>
                <Link href="/category/web-series" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Web Series
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dmca" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <Shield className="w-4 h-4" />
                  <span>DMCA Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <FileText className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AllMoviesHub. All rights reserved.
            </p>
            <div className="text-gray-400 text-sm">
              <p className="text-center md:text-right">
                <span className="text-red-400">Disclaimer:</span> This site does not store any files on its server. 
                All contents are provided by non-affiliated third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
