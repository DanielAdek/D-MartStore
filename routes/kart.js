import { Router } from 'express';
import { Kart } from '../controllers';

const router = Router();

router.post('/create', Kart.createKart);
router.get('/all', Kart.retrieveKarts);
router.put('/edit', Kart.editProductInKart);
router.delete('/delete/:kartId', Kart.deleteFromKart);

export default router;
