import { Router } from 'express';
import { Customer } from '../controllers';
import { verifyToken } from '../middlewares/authorization';
import * as Utils from '../helpers';

const router = Router();

router.post('/create', Customer.createAccount);
router.post('/login', Customer.login);
router.get('/generate/code', Customer.generateCode);
router.get('/details', verifyToken, Customer.retrieveCustomerDetails);
router.put('/edit', verifyToken, Utils.multerUploads().single('avatar'), Customer.editProfile);

export default router;
