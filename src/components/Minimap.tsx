import { useMemo } from 'react'
import { decodePolyline } from '../lib/polyline'

interface MinimapProps {
  summaryPolyline: string
  accentColor: string
  bgColor: string
}

export function Minimap({ summaryPolyline, accentColor, bgColor }: MinimapProps) {
  const path = useMemo(() => decodePolyline(summaryPolyline), [summaryPolyline])

  if (path.length < 2) return null

  const lats = path.map((p) => p[0])
  const lngs = path.map((p) => p[1])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const padding = 0.0002
  const viewLat = maxLat - minLat + padding * 2
  const viewLng = maxLng - minLng + padding * 2
  const aspect = viewLng / viewLat

  const width = 400
  const height = Math.round(width / aspect)
  const maxDim = Math.max(width, height)

  const toX = (lng: number) => ((lng - minLng + padding) / viewLng) * width
  const toY = (lat: number) => ((maxLat - lat + padding) / viewLat) * height

  const points = path.map(([lat, lng]) => `${toX(lng)},${toY(lat)}`).join(' ')

  const startX = toX(path[0][1])
  const startY = toY(path[0][0])
  const endX = toX(path[path.length - 1][1])
  const endY = toY(path[path.length - 1][0])

  return (
    <div className="relative border-2 border-border overflow-hidden" style={{ background: bgColor }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: '160px' }}
      >
        <polyline
          points={points}
          fill="none"
          stroke={accentColor}
          strokeWidth={maxDim * 0.008}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <circle cx={startX} cy={startY} r={maxDim * 0.012} fill="#22c55e" stroke="white" strokeWidth={maxDim * 0.003} />
        <circle cx={endX} cy={endY} r={maxDim * 0.012} fill="#ef4444" stroke="white" strokeWidth={maxDim * 0.003} />
      </svg>
    </div>
  )
}
