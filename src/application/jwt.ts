import { sign, verify } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function signJwt(payload: JWTPayload, expiresIn = '1d') {
  return await sign(payload, JWT_SECRET)
}

export async function verifyJwt(token: string) {
  try {
    return await verify(token, JWT_SECRET)
  } catch {
    return null
  }
}