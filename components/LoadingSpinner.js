'use client';
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin mb-2`} />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )
}
