import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access Denied: No Authorization Header Provided!');

    if (!req.cookies || !req.cookies.token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;
