import { Router } from 'express';
import { WishList } from '../controllers';

const router = Router();

router.get('/all', WishList.retrieveWishLists);
router.get('/token', WishList.generateWishToken);
router.post('/create/:productId', WishList.addToWishList);
router.delete('/delete/:wishlistId', WishList.deleteFromWishlist);
router.get('/customer/:wishlistcode', WishList.retrieveCustomerWishLists);

export default router;
