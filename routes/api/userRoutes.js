import { Router } from 'express';
import User  from '../../models/User.js';
import { signToken } from '../../utils/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user); // Sign the token  
    res.status(201).json({ token, user }); // Return the token and user data
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: 'Registration failed', error: err.message }); // Return an error if the registration fails
  }
});


router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email }); // Find the user by email

  if (!user) {
    return res.status(400).json({ message: "Can't find this user" }); // Return an error if the user is not found
  }

  const correctPw = await user.isCorrectPassword(req.body.password); // Check if the password is correct

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' }); // Return an error if the password is incorrect
  }

  const token = signToken(user); // Sign the token  
  res.json({ token, user });
});

export default router;