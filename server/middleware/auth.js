import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => { // middleware function to check if the user is logged in
    const token = req.header('Authorization').replace('Bearer ', ''); // get the token from the header
    if (!token) return res.status(401).send('Access Denied: No Token Provided!'); 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = decoded; // add the user to the request object
        next(); // call the next middleware function
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;
