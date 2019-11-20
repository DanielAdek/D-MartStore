import { Router } from 'express';
import UserOperations from './Users';
import AdminOperations from './Admin';
import ProductOperation from './product';

const router = Router();

router.use('/users', UserOperations);
router.use('/admin', AdminOperations);
router.use('/product', ProductOperation);

export default router;
