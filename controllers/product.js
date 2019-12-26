import db from '../models';
import { errorMsg, successMsg } from '../utils/message';
// import Utils from '../helpers';
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
        productName, productImages, productPrice, productDescription, productBrand, productCategory, productCaptionHeading,
        productCode, productColor, productTag
      } = req.body;

      const { _id: ownersId } = req.user;

      const newProduct = {
        ownersId, productName, productImages, productPrice, productDescription, productBrand, productCategory, productCaptionHeading, productCode, productColor, productTag
      };

      const product = await Messanger.shouldInsertToDataBase(db.Products, newProduct);

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Product Created Successfully', {
        error: false, operationStatus: 'Operation Successful!', product
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
        const ratings = await Messanger.shouldFindObjects(db.Ratings, {});
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Products returned Successfully', {
          error: false, operationStatus: 'Operation Successful!', products, ratings
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find all product', 'Nothing Found For Products!', {
        error: false, operationStatus: 'Operation Ended', products
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
      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId }).populate('ownersId');

      if (product) {
        const relatedProducts = await Messanger.shouldFindObjects(db.Products, { productCategory: product.productCategory }).sort({ createdAt: 'desc' });
        const ratings = await Messanger.shouldFindObjects(db.Ratings, {});
        const reviews = await Messanger.shouldFindObjects(db.Reviews, { productId: req.params.productId });
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Product returned Successfully', {
          error: false, operationStatus: 'Operation Successful!', product, relatedProducts, ratings, reviews
        }));
      }

      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find one product', 'Nothing found for request!', {
        error: false, operationStatus: 'Operation Completed'
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

      return res.status(200).jsend.success(successMsg('Edited Successfuly!', 200, 'edit product', { error: false, operationStatus: 'Process Completed!', editedProduct }));
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
        const defaultError = errorMsg('ExistenceError', 404, '', 'delete product', 'Product does not exist!', { error: true, operationStatus: 'Process Terminated!' });
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

      return res.status(200).jsend.success(successMsg('Deleted Successfuly!', 200, 'delete product', { error: false, operationStatus: 'Process Completed!' }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'delete product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }
}
