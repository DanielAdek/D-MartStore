import { Router } from 'express';
import { Product } from '../controllers';
import Authorization from '../middlewares/authorization';

const router = Router();

router.post('/create', Authorization.verifyToken, Product.createProduct);
router.get('/all', Product.retrieveProducts);
router.get('/:productId', Product.retrieveOneProduct);
router.put('/edit/:productId', Authorization.verifyToken, Product.editProduct);
router.delete('/delete/:productId', Authorization.verifyToken, Product.deleteProduct);

export default router;
