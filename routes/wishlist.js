import { Router } from 'express';
import { WishList } from '../controllers';

const router = Router();

router.get('/all', WishList.retrieveWishLists);
router.post('/create/:productId', WishList.addToWishList);
router.delete('/delete/:wishlistId', WishList.deleteFromWishlist);
router.get('/customer', WishList.retrieveCustomerWishLists);

export default router;
