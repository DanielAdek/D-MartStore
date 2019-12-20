import { Router } from 'express';
import { Order } from '../controllers';
import { verifyToken } from '../middlewares/authorization';

const router = Router();

router.post('/create', Order.createOrder);
router.get('/all', Order.retrieveOrders);
router.get('/customer', verifyToken, Order.retrieveCustomerOrders);

export default router;
