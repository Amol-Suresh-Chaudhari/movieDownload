'use client';
import Link from 'next/link'
import { Film } from 'lucide-react'

export default function CategorySection({ title, category, image, count, className = '' }) {
  const defaultClassName = "bg-gradient-to-br from-blue-600 to-purple-600"
  const gradientClass = className || defaultClassName

  return (
    <Link href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative group overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg">
        <div className={`aspect-square ${gradientClass} flex items-center justify-center relative`}>
          <Film className="w-8 h-8 md:w-12 md:h-12 text-white opacity-80" />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <div className="p-2 md:p-4 text-center">
          <h3 className="text-sm md:text-lg font-semibold text-white mb-1 truncate">{title}</h3>
          <p className="text-gray-400 text-xs md:text-sm">{count}</p>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Browse
        </div>
      </div>
    </Link>
  )
}
