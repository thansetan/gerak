import { useMemo, useRef, useLayoutEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { decodePolyline } from '../lib/polyline'

interface MinimapProps {
  summaryPolyline: string
  accentColor: string
  bgColor: string
}

function approximateDistance(path: [number, number][]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const [lat1, lng1] = path[i - 1]
    const [lat2, lng2] = path[i]
    const R = 6371000
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }
  return total
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

  const pathD = useMemo(
    () =>
      path
        .map(([lat, lng], i) => `${i === 0 ? 'M' : 'L'} ${toX(lng)},${toY(lat)}`)
        .join(' '),
    [path, toX, toY],
  )

  const startX = toX(path[0][1])
  const startY = toY(path[0][0])
  const endX = toX(path[path.length - 1][1])
  const endY = toY(path[path.length - 1][0])

  const distance = useMemo(() => approximateDistance(path), [path])
  const duration = Math.max(2, Math.min(6, distance / 5000))

  const [showEnd, setShowEnd] = useState(true)

  const pathRef = useRef<SVGPathElement>(null)
  const arrowX = useMotionValue(startX)
  const arrowY = useMotionValue(startY)
  const arrowAngle = useMotionValue(0)

  useLayoutEffect(() => {
    setShowEnd(false)
    arrowX.set(startX)
    arrowY.set(startY)
    arrowAngle.set(0)

    const controls = animate(0, 1, {
      duration,
      ease: 'easeOut',
      onUpdate: (progress) => {
        if (!pathRef.current) return
        const len = pathRef.current.getTotalLength()
        const p = pathRef.current.getPointAtLength(progress * len)
        arrowX.set(p.x)
        arrowY.set(p.y)

        const ahead = pathRef.current.getPointAtLength(Math.min(progress + 0.002, 1) * len)
        const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI)
        arrowAngle.set(angle)
      },
      onComplete: () => setShowEnd(true),
    })

    return () => controls.stop()
  }, [summaryPolyline, startX, startY, duration])

  const arrowSize = maxDim * 0.012

  return (
    <div className="relative border-2 border-border overflow-hidden" style={{ background: bgColor }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: '160px' }}
      >
        <motion.path
          key={summaryPolyline}
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={accentColor}
          strokeWidth={maxDim * 0.008}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration, ease: 'easeOut' }}
        />
        {!showEnd && (
        <motion.g
          style={{
            translateX: arrowX,
            translateY: arrowY,
            rotate: arrowAngle,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <polygon
            points={`${-arrowSize * 1.5},${-arrowSize} 0,0 ${-arrowSize * 1.5},${arrowSize}`}
            fill={accentColor}
            stroke="white"
            strokeWidth={maxDim * 0.0015}
          />
        </motion.g>
        )}
        <circle cx={startX} cy={startY} r={maxDim * 0.012} fill="#22c55e" stroke="white" strokeWidth={maxDim * 0.003} />
        {showEnd && (
          <motion.circle
            cx={endX}
            cy={endY}
            r={maxDim * 0.012}
            fill="#ef4444"
            stroke="white"
            strokeWidth={maxDim * 0.003}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </svg>
    </div>
  )
}
