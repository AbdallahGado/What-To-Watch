'use client'

import { useEffect } from 'react'
import { usePalette } from 'color-thief-react'
import { useTheme } from '@/components/ThemeContext'

interface ColorExtractorProps {
  src: string
}

export function ColorExtractor({ src }: ColorExtractorProps) {
  const { setThemeColors } = useTheme()
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(src)}` // Use a proxy to avoid CORS issues for color extraction
  
  const { data, loading, error } = usePalette(proxyUrl, 3, 'hex', {
    crossOrigin: 'anonymous'
  })

  useEffect(() => {
    if (!loading && data && data.length >= 3) {
      setThemeColors({
        primary: data[0],
        accent: data[1],
        secondary: data[2]
      })
    }
    
    return () => {
      // Don't reset immediately to prevent flickering on quick navigation
    }
  }, [data, loading, setThemeColors])

  if (error) {
    console.error('Color extraction failed', error)
  }

  return null
}
