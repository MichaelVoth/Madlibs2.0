import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Generate a JSON Web Token (JWT) for user authentication

const generateJWT = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify the JWT and extract user information from it
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

// Use bcrypt to hash a password before storing it in the database
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare a given password with its hashed version in the database to authenticate a user
const checkPassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

export { 
  generateJWT, 
  verifyJWT, 
  hashPassword, 
  checkPassword, 
};
