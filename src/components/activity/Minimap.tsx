import { useCallback, useMemo, useRef, useLayoutEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { decodePolyline } from '../../shared/lib/polyline'

interface MinimapProps {
  summaryPolyline: string
  accentColor: string
  bgColor: string
  skipAnimation?: boolean
  onAnimationComplete?: () => void
}

const TILE_SIZE = 256
const PIXEL_PADDING = 40
const TARGET_PIXELS = 420

function mercatorY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180
  const n = 2 ** zoom
  return ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE_SIZE
}

function latLngToPixel(lat: number, lng: number, zoom: number): [number, number] {
  const n = 2 ** zoom
  const x = ((lng + 180) / 360) * n * TILE_SIZE
  const y = mercatorY(lat, zoom)
  return [x, y]
}

function chooseZoom(minLat: number, maxLat: number, minLng: number, maxLng: number): number {
  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2
  for (let z = 1; z <= 19; z++) {
    const n = 2 ** z
    const pxX = (n * TILE_SIZE * (maxLng - minLng)) / 360
    const [, yMin] = latLngToPixel(minLat, centerLng, z)
    const [, yMax] = latLngToPixel(maxLat, centerLng, z)
    const pxY = Math.abs(yMax - yMin)
    if (Math.max(pxX, pxY) >= TARGET_PIXELS) return z
  }
  return 19
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

  const zoom = chooseZoom(minLat, maxLat, minLng, maxLng)

  const pxPoints = path.map(([lat, lng]) => latLngToPixel(lat, lng, zoom))
  const pxXs = pxPoints.map((p) => p[0])
  const pxYs = pxPoints.map((p) => p[1])
  const minX = Math.min(...pxXs) - PIXEL_PADDING
  const maxX = Math.max(...pxXs) + PIXEL_PADDING
  const minY = Math.min(...pxYs) - PIXEL_PADDING
  const maxY = Math.max(...pxYs) + PIXEL_PADDING

  const viewW = maxX - minX
  const viewH = maxY - minY
  const maxDim = Math.max(viewW, viewH)

  const minTileX = Math.floor(minX / TILE_SIZE)
  const maxTileX = Math.floor(maxX / TILE_SIZE)
  const minTileY = Math.floor(minY / TILE_SIZE)
  const maxTileY = Math.floor(maxY / TILE_SIZE)

  const tiles: { key: string; x: number; y: number; url: string }[] = []
  for (let tx = minTileX; tx <= maxTileX; tx++) {
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      tiles.push({
        key: `${zoom}/${tx}/${ty}`,
        x: tx * TILE_SIZE - minX,
        y: ty * TILE_SIZE - minY,
        url: `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`,
      })
    }
  }

  const toPoint = useCallback(
    (lat: number, lng: number): [number, number] => {
      const [x, y] = latLngToPixel(lat, lng, zoom)
      return [x - minX, y - minY]
    },
    [zoom, minX, minY],
  )

  const pathD = useMemo(
    () =>
      path
        .map(([lat, lng], i) => {
          const [x, y] = toPoint(lat, lng)
          return `${i === 0 ? 'M' : 'L'} ${x},${y}`
        })
        .join(' '),
    [path, toPoint],
  )

  const [startX, startY] = toPoint(path[0][0], path[0][1])
  const [endX, endY] = toPoint(path[path.length - 1][0], path[path.length - 1][1])

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

    const pts = path.map(([lat, lng]) => toPoint(lat, lng))
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
  }, [skipAnimation, onAnimationComplete, path, toPoint, pathD, startX, startY, duration])

  const arrowSize = maxDim * 0.012

  return (
    <div className="relative border-2 border-border overflow-hidden" style={{ background: bgColor }}>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-auto"
        style={{ maxHeight: '160px' }}
      >
        {tiles.map((t) => (
          <image key={t.key} href={t.url} x={t.x} y={t.y} width={TILE_SIZE} height={TILE_SIZE} />
        ))}
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
      <span className="pointer-events-none absolute bottom-1 right-1 font-mono text-[8px] text-white/80 bg-black/40 px-1 py-0.5">
        © OpenStreetMap
      </span>
    </div>
  )
}
