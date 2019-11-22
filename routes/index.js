import { Router } from 'express';
import UserOperations from './Users';
import AdminOperations from './Admin';
import ProductOperations from './product';
import KartOperations from './kart';
import OrderOperations from './order';

const router = Router();

router.use('/users', UserOperations);
router.use('/admin', AdminOperations);
router.use('/product', ProductOperations);
router.use('/cart', KartOperations);
router.use('/order', OrderOperations);

export default router;
