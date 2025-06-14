// middleware/auth.js
function devTokenAuth(req, res, next) {
    const token = req.headers['authorization'];
    if (token === 'Bearer devtoken123') {
      req.user = { isDev: true, uuid: 'test-user-uuid' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  module.exports = devTokenAuth;
  