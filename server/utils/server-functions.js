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

// Generate a unique room code for a new room
const generateRoomCode = (rooms) => {
  const makeKey = () => { 
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  let newKey; 
  let attempts = 0;
  const maxAttempts = 100; // arbitrary number to prevent infinite loops

  do { 
    newKey = makeKey();
    attempts++;
  } while (rooms[newKey] && attempts < maxAttempts);

  if (attempts === maxAttempts) {
    throw new Error("Failed to generate a unique room code.");
  }

  return newKey;
};

const distributePrompts = (prompts, users) => {
  if (!Array.isArray(prompts) || !Array.isArray(users)) {
    throw new Error("Invalid inputs. Prompts and users should be arrays.");
  }

  return prompts.reduce((acc, prompt, index) => { 
    const user = users[index % users.length];
    if (!acc[user]) acc[user] = [];
    acc[user].push({ index, prompt });
    return acc;
  }, {});
};

const pullPromptsFromText = (text) => {
  const regex = /\{(.*?)\}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

export { 
  generateJWT, 
  verifyJWT, 
  hashPassword, 
  checkPassword, 
  distributePrompts, 
  generateRoomCode, 
  pullPromptsFromText
};
