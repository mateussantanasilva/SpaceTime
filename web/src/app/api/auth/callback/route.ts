import { api } from '@/lib/api'
import webAppBaseUrl from '@/lib/webAppBaseUrl'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const redirectTo = request.cookies.get('redirectTo')?.value

  const registerResponse = await api.post('/register', {
    code,
  })
  const { token } = registerResponse.data

  const redirectURL = redirectTo ?? new URL(webAppBaseUrl, request.url) // true ?? false
  const oneMonthInSeconds = 60 * 60 * 24 * 30 // minute * hour * day * month

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${oneMonthInSeconds};`, // any route that starts with '/'
    },
  })
}
