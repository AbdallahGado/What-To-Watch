'use client'

import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts'

interface CinephileRadarProps {
  data: {
    action: number
    comedy: number
    drama: number
    horror: number
    sciFi: number
    romance: number
    thriller: number
  }
}

export function CinephileRadar({ data }: CinephileRadarProps) {
  const chartData = [
    { subject: 'Action', A: data.action, fullMark: 100 },
    { subject: 'Comedy', A: data.comedy, fullMark: 100 },
    { subject: 'Drama', A: data.drama, fullMark: 100 },
    { subject: 'Horror', A: data.horror, fullMark: 100 },
    { subject: 'Sci-Fi', A: data.sciFi, fullMark: 100 },
    { subject: 'Romance', A: data.romance, fullMark: 100 },
    { subject: 'Thriller', A: data.thriller, fullMark: 100 },
  ]

  return (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
          />
          <Radar
            name="DNA"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
