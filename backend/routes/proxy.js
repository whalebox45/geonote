const express = require('express')
const router = express.Router()
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)) // 若需兼容 Node 16+

// /api/proxy/search?q=xxx
router.get('/search', async (req, res) => {
  const q = req.query.q
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GeoNote/1.0'
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Proxy search error:', err)
    res.status(500).json({ error: 'Proxy search error' })
  }
})

// /api/proxy/reverse?lat=25.0&lon=121.5
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GeoNote/1.0'
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Proxy reverse error:', err)
    res.status(500).json({ error: 'Proxy reverse error' })
  }
})

module.exports = router
