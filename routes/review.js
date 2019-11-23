import { Router } from 'express';
import { Review } from '../controllers';

const router = Router();

router.post('/create/:productId', Review.createReview);
router.get('/all', Review.retrieveReviews);
router.get('/:reviewId', Review.retrieveOneReview);
router.put('/edit/:reviewId', Review.editReview);

export default router;
