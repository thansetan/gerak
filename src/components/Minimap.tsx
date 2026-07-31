import { useCallback, useMemo, useRef, useLayoutEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { decodePolyline } from '../lib/polyline'

interface MinimapProps {
  summaryPolyline: string
  accentColor: string
  bgColor: string
  skipAnimation?: boolean
  onAnimationComplete?: () => void
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

export function Minimap({ summaryPolyline, accentColor, bgColor, skipAnimation = false, onAnimationComplete }: MinimapProps) {
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

  const toX = useCallback((lng: number) => ((lng - minLng + padding) / viewLng) * width, [minLng, viewLng])
  const toY = useCallback((lat: number) => ((maxLat - lat + padding) / viewLat) * height, [maxLat, viewLat])

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
    if (!pathRef.current) return

    if (skipAnimation) {
      pathRef.current.setAttribute('d', pathD)
      return
    }

    setShowEnd(false)
    arrowX.set(startX)
    arrowY.set(startY)
    arrowAngle.set(0)

    const pts = path.map(([lat, lng]) => [toX(lng), toY(lat)])
    const cumLen = [0]
    for (let i = 1; i < pts.length; i++) {
      cumLen.push(cumLen[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    }
    const totalLen = cumLen[cumLen.length - 1]

    let index = 0
    const controls = animate(0, 1, {
      duration,
      ease: 'easeOut',
      onUpdate: (progress) => {
        const target = progress * totalLen
        while (index < pts.length - 2 && cumLen[index + 1] < target) index++
        const segStart = cumLen[index]
        const segLen = cumLen[index + 1] - segStart
        const t = segLen > 0 ? Math.min(1, (target - segStart) / segLen) : 0
        const x = pts[index][0] + (pts[index + 1][0] - pts[index][0]) * t
        const y = pts[index][1] + (pts[index + 1][1] - pts[index][1]) * t

        const drawn = pts.slice(0, index + 1).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`)
        drawn.push(`L ${x},${y}`)
        pathRef.current?.setAttribute('d', drawn.join(' '))

        arrowX.set(x)
        arrowY.set(y)
        const angle = Math.atan2(pts[index + 1][1] - y, pts[index + 1][0] - x) * (180 / Math.PI)
        arrowAngle.set(angle)
      },
      onComplete: () => {
        pathRef.current?.setAttribute('d', pathD)
        setShowEnd(true)
        onAnimationComplete?.()
      },
    })

    return () => controls.stop()
  }, [skipAnimation, onAnimationComplete, path, toX, toY, pathD, startX, startY, duration])

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
          initial={skipAnimation ? undefined : { pathLength: 0 }}
          animate={skipAnimation ? undefined : { pathLength: 1 }}
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
