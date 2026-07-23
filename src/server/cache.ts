import { Redis } from '@upstash/redis'

const redisUrl = process.env.REDIS_URL
if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is required')
}

let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({ url: redisUrl })
  }
  return redis
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = await getRedis().get<T>(key)
    return data ?? null
  } catch {
    return null
  }
}

export async function setToCache<T>(key: string, value: T, ttl: number): Promise<void> {
  await getRedis().setex(key, ttl, JSON.stringify(value))
}

export async function setToCacheRaw(key: string, value: string, ttl: number): Promise<void> {
  await getRedis().setex(key, ttl, value)
}

export async function deleteCacheKey(key: string): Promise<void> {
  await getRedis().del(key)
}

export async function getCacheKeyTtl(key: string): Promise<number> {
  return await getRedis().ttl(key)
}
