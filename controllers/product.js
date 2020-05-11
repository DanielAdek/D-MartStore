import db from '../models';
import { errorMsg, successMsg } from '../utils/message';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';

/** @class */
export default class Products {
  /**
   * @method createProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async createProduct(req, res) {
    try {
      const validationResult = Services.ValidateRequest('create_product', req.body);

      if (validationResult.error) {
        return res.status(400).jsend.fail(validationResult);
      }

      // Create product
      const {
        productName, productPrice, productDescription, productBrand, productCategory, productCaptionHeading,
        productCode, productColor, productTag
      } = req.body;

      const { _id: ownersId } = req.user;

      const urls = [];
      // SAVES IMAGE TO CLOUDINARY
      if (req.files.length) {
        req.files.forEach((file) => {
          urls.push({ image: (file.secure_url || file.url), id: Date.now() });
        });
      }

      const newProduct = {
        ownersId, productName, productImages: urls, productPrice, productDescription, productBrand, productCategory, productCaptionHeading, productCode, productColor, productTag
      };

      const product = await Messanger.shouldInsertToDataBase(db.Products, newProduct);

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Product Created Successfully', {
        success: true, operationStatus: 'Operation Successful!', product
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create Product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retreiveProducts
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveProducts(req, res) {
    try {
      const products = await Messanger.shouldFindObjects(db.Products, {}).sort({ createdAt: 'desc' }).populate('ownersId');

      if (products.length) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Products returned Successfully', {
          success: true, operationStatus: 'Operation Successful!', products
        }));
      }
      return res.status(200).jsend.success(successMsg('Success!', 200, 'Noting found from products', {
        success: true, operationStatus: 'Operation Successful!', products
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all products', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method retrieveOneProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveOneProduct(req, res) {
    try {
      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });
      if (product) {
        const relatedProducts = await Messanger.shouldFindObjects(db.Products, { productCategory: product.productCategory }).sort({ createdAt: 'desc' });
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Product returned Successfully', {
          success: true, operationStatus: 'Operation Successful!', product, relatedProducts
        }));
      }

      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find one product', 'Nothing found for request!', {
        error: true, operationStatus: 'Operation Completed'
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one product', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method editProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async editProduct(req, res) {
    try {
      const validationResult = Services.ValidateRequest('edit_product', req.body);

      if (validationResult.error) {
        return res.status(400).jsend.fail(validationResult);
      }

      const { _id: userId } = req.user;

      // QUERRY DATABASE
      const user = await Messanger.shouldFindOneObject(db.Users, { _id: userId });
      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });

      // CONFIRM PRODUCT EXIST
      if (!product) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'edit product', 'Product does not exist!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }

      // CONFIRM THE OPERATION IS CARRIED OUT BY OWNER
      if (user.role !== 'admin') {
        if (!product.ownersId.equals(user.id)) {
          const defaultError = errorMsg('PermissionError', 403, '', 'edit product', 'You cannot edit another person\'s product', { error: true, operationStatus: 'Process Terminated!' });
          return res.status(403).jsend.fail(defaultError);
        }
      }

      const newData = { productPrice: (req.body.productPrice || product.productPrice), lastUserEdited: user._id };

      const editedProduct = await Messanger.shouldEditOneObject(db.Products, { id: req.params.productId, newData });

      return res.status(200).jsend.success(successMsg('Edited Successfuly!', 200, 'edit product', { success: true, operationStatus: 'Process Completed!', editedProduct }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Edit product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method deleteProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async deleteProduct(req, res) {
    try {
      const { _id: userId } = req.user;

      // QUERRY DATABASE
      const user = await Messanger.shouldFindOneObject(db.Users, { _id: userId });
      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });

      // CONFIRM PRODUCT EXIST
      if (!product) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'delete product', 'Product has already been deleted! or never existed!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }

      // CONFIRM THE OPERATION IS CARRIED OUT BY OWNER
      if (user.role !== 'admin') {
        if (!product.ownersId.equals(user.id)) {
          const defaultError = errorMsg('PermissionError', 403, '', 'delete product', 'You cannot delete another person\'s product', { error: true, operationStatus: 'Operation Terminated' });
          return res.status(403).jsend.fail(defaultError);
        }
      }

      // CONFIRM NO ORDER ON PRODUCT BEFORE DELETION
      if (product.onOrderCount) {
        const defaultError = errorMsg('DeletionError', 400, '', 'delete product', 'This product has been ordered. You cannot delete it yet!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(403).jsend.fail(defaultError);
      }

      // CONFIRM PRODUCT NOT ON KART BEFORE DELETION
      if (product.inCartCount) {
        const defaultError = errorMsg('DeletionError', 400, '', 'delete product', 'This product is in cart. You cannot delete it yet!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(403).jsend.fail(defaultError);
      }

      await Messanger.shouldDeleteOneObject(db.Products, { id: req.params.productId });

      return res.status(200).jsend.success(successMsg('Deleted Successfuly!', 200, 'delete product', { success: true, operationStatus: 'Process Completed!' }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'delete product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retreiveProductsByQuery
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retreiveProductsByQuery(req, res) {
    try {
      const { productCategory } = req.query;

      let products;
      if (productCategory === 'shop') products = await Messanger.shouldFindObjects(db.Products, {}).sort({ createdAt: 'desc' });
      else products = await Messanger.shouldFindObjects(db.Products, { productCategory }).sort({ createdAt: 'desc' });


      if (products) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Product returned Successfully', {
          success: true, operationStatus: 'Operation Successful!', products
        }));
      }

      return res.status(200).jsend.success(successMsg('Success!', 200, 'Nothing found for request!', {
        success: true, operationStatus: 'Operation Completed!', products
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one product', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method retreiveFilterValuesForProducts
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retreiveFilterValuesForProducts(req, res) {
    try {
      const productBrands = await Messanger.shouldFindObjects(db.Products, {}, { 'Product.productImages': 0 }).sort({ createdAt: 'desc' }).distinct('productBrand');
      // const
      const productPriceRange = await db.Products.aggregate([
        {
          $group: {
            _id: null,
            max: { $max: '$productPrice' },
            min: { $min: '$productPrice' }
          }
        }
      ]);
      return res.status(200).jsend.success(successMsg('Product returned Successfully!', 200, 'search product', {
        success: true, operationStatus: 'Operation Successful!', productBrands, productPriceRange
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one product', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method deepSearchProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async deepSearchProduct(req, res) {
    try {
      const { q } = req.query;
      const conditions = [
        { productBrand: { $regex: new RegExp(q), $options: 'i' } },
        { productCategory: { $regex: new RegExp(q), $options: 'i' } },
        { productName: { $regex: new RegExp(q), $options: 'i' } },
        { productTag: { $regex: new RegExp(q), $options: 'i' } },
        { productCaptionHeading: { $regex: new RegExp(q), $options: 'i' } },
        { productDescription: { $regex: new RegExp(q), $options: 'i' } },
      ];
      // eslint-disable-next-line no-restricted-globals
      const queryIsANumber = isNaN(Number(q));
      if (!queryIsANumber) {
        conditions.push({ productPrice: q });
      }

      const products = await Messanger.shouldFindObjects(db.Products, { $or: conditions }).sort({ createdAt: 'desc' });

      if (!products.length) {
        return res.status(200).jsend.success(successMsg('Nothing found for your search query!', 204, 'Search Product', {
          success: true, operationStatus: 'Operation Successful!', products
        }));
      }
      return res.status(200).jsend.success(successMsg('Product returned Successfully!', 200, 'search product', {
        success: true, operationStatus: 'Operation Successful!', products
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one product', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }
}
