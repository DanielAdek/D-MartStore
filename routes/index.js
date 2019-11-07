import { Router } from 'express';
import UserOperations from './Users';
import AdminOperations from './Admin';

const router = Router();

router.use('/users', UserOperations);
router.use('/admin', AdminOperations);

export default router;
