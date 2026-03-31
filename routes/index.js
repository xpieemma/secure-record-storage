
import { Router } from 'express';
import apiRoutes from './api/index.js';

const router = Router();

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).send('<h1> 404 Error!</h1>'); // Return a 404 error if the route is not found
});

export default router;