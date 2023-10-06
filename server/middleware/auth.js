import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Check for token in cookies
    const token = req.cookies.token;

    if (!token) {
        console.log("no token");
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = decoded; // add the user information to the request
        console.log("token verified");
        next(); // call the next middleware
    } catch (error) {
        console.log("token verification failed:", error.message);
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;
