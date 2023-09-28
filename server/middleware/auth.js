import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization'); // get the Authorization header from the request
    // console.log("Auth Header:", authHeader);
    if (!authHeader) return res.status(401).send('Access Denied: No Authorization Header Provided!'); // if there is no Authorization header, return an error

    const token = authHeader.split(' ')[1]; 
    // console.log("Token:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = decoded; // add the user information to the request
        // console.log("Decoded:", decoded);
        next(); // call the next middleware
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;
