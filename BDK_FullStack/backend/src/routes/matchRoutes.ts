import { Router } from 'express';
import { matchController } from '../controllers/matchController.js';

const router = Router();

router.get('/', matchController.getMatches);
router.get('/upcoming', matchController.getUpcoming);
router.get('/results', matchController.getResults);
router.get('/standings', matchController.getStandings);
router.get('/:id', matchController.getMatchById);
router.post('/', matchController.createMatch);
router.put('/:id', matchController.updateMatch);

export default router;
