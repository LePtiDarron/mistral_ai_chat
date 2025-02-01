const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Token is missing after Bearer.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token.', details: err.message });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
