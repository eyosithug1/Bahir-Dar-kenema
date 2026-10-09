import { Router } from 'express';
import matchRoutes from './matchRoutes.js';
import playerRoutes from './playerRoutes.js';
import newsRoutes from './newsRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import productRoutes from './productRoutes.js';
import authRoutes from './authRoutes.js';
import { config } from '../config/index.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    club: config.clubName,
    nickname: config.clubNickname,
    stadium: config.stadium,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/matches', matchRoutes);
apiRouter.use('/players', playerRoutes);
apiRouter.use('/news', newsRoutes);
apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/auth', authRoutes);

export default apiRouter;
