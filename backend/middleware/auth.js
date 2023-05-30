const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.role !== 'admin') {
            throw new Error();
        }
        req.token = token;
        next();
    } catch (e) {
        res.status(403).send({ error: 'Please authenticate as an admin.' });
    }
}

module.exports = adminAuth;
