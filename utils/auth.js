import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET; 
const expiration = '2h';

export const authMiddleware = function (req, res, next) {
  let token = req.body?.token || req.query?.token || req.headers?.authorization; // Get token from request body, query, or headers

  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim(); // Split the authorization header and get the token
  }

  if (!token) {
    return res.status(401).json({ message: 'You must be logged in to do that.' }); // Return an error if no token is found
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration }); // Verify the token
    req.user = data;
  } catch {
    console.log('Invalid token');
    return res.status(401).json({ message: 'Invalid token.' }); // Return an error if the token is invalid
  }

  next();
};

export const signToken = function ({ username, email, _id }) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration }); // Sign the token with the payload and secret
};