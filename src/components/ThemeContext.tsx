'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
}

interface ThemeContextType {
  colors: ThemeColors
  setThemeColors: (colors: ThemeColors) => void
  resetTheme: () => void
}

const defaultColors: ThemeColors = {
  primary: '#6366f1', // Indigo 500
  secondary: '#a855f7', // Purple 500
  accent: '#ec4899' // Pink 500
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors)

  useEffect(() => {
    // Inject CSS variables into document root
    const root = document.documentElement
    root.style.setProperty('--color-brand-500', colors.primary)
    root.style.setProperty('--color-brand-400', `${colors.primary}CC`) // Add some transparency
    root.style.setProperty('--color-accent-500', colors.accent)
  }, [colors])

  const setThemeColors = (newColors: ThemeColors) => setColors(newColors)
  const resetTheme = () => setColors(defaultColors)

  return (
    <ThemeContext.Provider value={{ colors, setThemeColors, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a DynamicThemeProvider')
  return context
}
