'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface JuicyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'glass'
}

export function JuicyButton({ children, onClick, className = '', variant = 'primary' }: JuicyButtonProps) {
  const baseStyles = "relative px-8 py-4 rounded-2xl font-bold tracking-wide transition-colors overflow-hidden flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600",
    secondary: "bg-surface text-white border border-white/10 hover:bg-white/5",
    glass: "glass-button text-white/70 hover:text-white"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    > 
      {/* Gloss effect */}
      <motion.div  
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
