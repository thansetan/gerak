import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL
if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is required')
}

let client: ReturnType<typeof createClient> | null = null

async function getRedis(): Promise<ReturnType<typeof createClient>> {
  if (!client) {
    client = createClient({ url: redisUrl })
    client.on('error', (err) => console.error('Redis client error', err))
    await client.connect()
  }
  return client
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = await (await getRedis()).get(key)
    if (data === null) return null
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export async function setToCache<T>(key: string, value: T, ttl: number): Promise<void> {
  await (await getRedis()).set(key, JSON.stringify(value), { EX: ttl })
}

export async function setToCacheRaw(key: string, value: string, ttl: number): Promise<void> {
  await (await getRedis()).set(key, value, { EX: ttl })
}

export async function deleteCacheKey(key: string): Promise<void> {
  await (await getRedis()).del(key)
}

