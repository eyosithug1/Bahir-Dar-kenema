import { Router } from 'express';
import { playerController } from '../controllers/playerController.js';

const router = Router();

router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayerById);
router.post('/', playerController.createPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

export default router;
