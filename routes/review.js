import { Router } from 'express';
import { Review } from '../controllers';

const router = Router();

router.post('/create/:productId', Review.createReview);
router.put('/edit/:reviewId', Review.editReview);

export default router;
