import { Router } from 'express';
import { Product } from '../controllers';
import Authorization from '../middlewares/authorization';
import * as Utils from '../helpers';

const router = Router();

router.post('/create', Authorization.verifyToken, Utils.multerUploads().array('productImages'), Product.createProduct);
router.get('/all', Product.retrieveProducts);
router.get('/filter', Product.retreiveProductsByQuery);
router.get('/search', Product.deepSearchProduct);
router.post('/filter/options', Product.retreiveFilterValuesForProducts);
router.get('/:productId', Product.retrieveOneProduct);
router.put('/edit/:productId', Authorization.verifyToken, Product.editProduct);
router.delete('/delete/:productId', Authorization.verifyToken, Product.deleteProduct);

export default router;
