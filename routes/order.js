import { Router } from 'express';
import { Order } from '../controllers';

const router = Router();

router.post('/create', Order.createOrder);
router.get('/all', Order.retrieveOrders);

export default router;
