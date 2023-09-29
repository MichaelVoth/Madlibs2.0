import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    let token;
    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else {
        // If not in Authorization header, check in cookies
        token = req.cookies.token;
    }

    if (!token) return res.status(401).send('Access Denied: No Token Provided!'); 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = decoded; // add the user information to the request
        next(); // call the next middleware
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;
