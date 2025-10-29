import { NextRequest, NextResponse } from 'next/server'
import { ratelimit } from './redis'

export async function checkRateLimit(
  request: NextRequest,
  type: 'mutations' | 'reads' = 'mutations'
): Promise<{ success: true } | NextResponse> {
  // If rate limiting is not configured, allow the request
  if (!ratelimit) {
    return { success: true }
  }

  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  const identifier = `${ip}:${request.nextUrl.pathname}`

  try {
    const { success, limit, remaining, reset } = await ratelimit[type].limit(identifier)

    if (!success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      )
    }

    return { success: true }
  } catch (error) {
    console.error('[Rate Limit] Error:', error)
    // On error, allow the request (fail open)
    return { success: true }
  }
}
