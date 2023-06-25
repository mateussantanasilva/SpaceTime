let webAppBaseUrl = '/'
if (process.env.NEXT_PUBLIC_VERCEL_ENV)
  webAppBaseUrl = 'https://spacetime-app.vercel.app'

export default webAppBaseUrl
