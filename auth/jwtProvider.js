const jwt = require('jsonwebtoken');

// Secret key
const SECRET_KEY = 'catcares';

const authMiddleware = (req, res, next) => {
  // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

  // Reject if no token provided
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

  // Verify the token
    try {
        const data = jwt.verify(token, SECRET_KEY);
        req.userId = data.sub;
        req.email = data.email
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;