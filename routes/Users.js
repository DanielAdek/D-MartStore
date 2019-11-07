import { Router } from 'express';
import { Customer } from '../controllers';

const router = Router();

router.post('/create', Customer.createAccount);
router.post('/login', Customer.login);
router.get('/', Customer.retrieveCustomers);
router.put('/edit/:userId', Customer.editProfile);

export default router;
