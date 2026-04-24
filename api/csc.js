export default async function handler(req, res) {
  try {
    const rawPath = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path

    if (!rawPath || typeof rawPath !== 'string') {
      res.status(400).json({ error: 'Missing `path` query parameter' })
      return
    }

    const sanitizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
    const upstreamUrl = `https://api.countrystatecity.in${sanitizedPath}`

    const upstream = await fetch(upstreamUrl, {
      headers: {
        'X-CSCAPI-KEY': process.env.CSC_API_KEY || '',
      },
    })

    const text = await upstream.text()
    res.status(upstream.status).setHeader('Content-Type', 'application/json').send(text)
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: String(error) })
  }
}

