const jwt = require('jsonwebtoken');
const keyFile = require('./secret.key');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], keyFile.securekey);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

const isActiveEmployee = async (req, res, next) => {
    if (req.user && req.user.role === 'employee') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Only active employees can access this resource' });
    }
};

module.exports = { verifyToken, isAdmin, isActiveEmployee };
