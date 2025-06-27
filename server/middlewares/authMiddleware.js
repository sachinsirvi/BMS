const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId; // now available in route handler
      next(); // proceed to actual route
    } catch (err) {
      res.status(403).json({ success: false, message: 'Invalid token' });
    }
  };
  
module.exports = auth;