import { Router } from 'express';
import { Administratives } from '../controllers';

const router = Router();

router.put('/user/activate/:userId', Administratives.reactivateUserAccount);
router.put('/user/deactivate/:userId', Administratives.deactivateUserAccount);
router.delete('/user/delete/:userId', Administratives.destroyAccount);

export default router;
