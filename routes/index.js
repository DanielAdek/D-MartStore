import { Router } from 'express';
import UserOperations from './Users';
import AdminOperations from './Admin';
import ProductOperations from './product';
import KartOperations from './kart';
import OrderOperations from './order';
import ReviewOperation from './review';

const router = Router();

router.use('/users', UserOperations);
router.use('/admin', AdminOperations);
router.use('/product', ProductOperations);
router.use('/cart', KartOperations);
router.use('/order', OrderOperations);
router.use('/review', ReviewOperation);

export default router;
