const express = require('express');
const axios = require('axios');
const https = require('https');
const dns = require('dns');

const router = express.Router();

// 強制 IPv4 的 lookup 避免 IPv6 出錯
const agent = new https.Agent({
  lookup(hostname, options, callback) {
    // axios 有時只傳 hostname, callback（少 options）
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // fallback 保險：options.family undefined 時強制 family: 4
    if (!options || typeof options !== 'object') options = {};
    if (!options.family) options.family = 4;

    dns.lookup(hostname, options, callback);
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;

  console.log('Proxy search query:', q);

  try {
    const response = await axios.get(url, {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'GeoNote/1.0'
      },
      timeout: 5000
    });
    res.json(response.data);
  } catch (err) {
    console.error('Proxy search error:', err.message);
    res.status(500).json({ error: `Proxy search error: ${err.message}` });
  }
});


// /api/proxy/reverse?lat=25.0&lon=121.5
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url, {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'GeoNote/1.0'
      },
      timeout: 5000
    });
    res.json(response.data);
  } catch (err) {
    console.error('Proxy reverse error:', err.message);
    res.status(500).json({ error: `Proxy reverse error: ${err.message}` });
  }
});
module.exports = router
