import db from '../models';
import Utils from '../helpers';
import { errorMsg, successMsg } from '../utils/message';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';

/** @class */
export default class Kart {
  /**
   * @method createKart
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async createKart(req, res) {
    try {
      const validationResult = Services.ValidateRequest('create_kart', req.body);

      if (validationResult.error) {
        return res.status(400).jsend.fail(validationResult);
      }

      // GET CUSTOMER ID
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      const result = token ? await Utils.objectFromToken(db, req) : { error: false };

      if (result.error) {
        return res.status(403).jsend.fail(result);
      }
      const { _id: customerId } = result;

      const { kartData } = req.body;

      const { kartCode } = req.query;

      if (!kartCode && !token) {
        return res.status(400).jsend.fail(errorMsg('CastError', 400, 'req.query', 'Add product to kart', 'Token was not sent. Please reload your page!', {
          error: false, operationStatus: 'Operation Ended'
        }));
      }

      if (Array.isArray(kartData)) {
        const products = await Messanger.shouldFindObjects(db.Products, {});
        // eslint-disable-next-line no-restricted-syntax
        for (const product of products) {
          // eslint-disable-next-line no-restricted-syntax
          for (const Item of kartData) {
            if (product._id.equals(Item.productId._id)) {
              Item.cummulativePrice = product.productPrice;
              if (token) { Item.customerId = customerId; }
              if (!token) { Item.kartCode = kartCode; }
            }
          }
          product.inCartCount += 1;
          // eslint-disable-next-line no-await-in-loop
          await product.save();
        }
      }

      if (!Array.isArray(kartData) && typeof kartData === 'object') {
        const product = await Messanger.shouldFindOneObject(db.Products, { _id: kartData.productId });
        kartData.cummulativePrice = product.productPrice * (kartData.quantity || 1);
        if (token) { kartData.customerId = customerId; }
        if (!token) { kartData.kartCode = kartCode; }
        product.inCartCount += 1;
        await product.save();
      }

      // CREATE KART
      const newKart = await Messanger.shouldInsertOneOrMoreObjects(db.Karts, kartData);

      return res.status(201).jsend.success(successMsg('Cart Created Successfully!', 201, 'Create Carts', {
        error: false, operationStatus: 'Operation Successful!', newKart
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create Product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retrieveKarts
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveKarts(req, res) {
    try {
      const Karts = await Messanger.shouldFindObjects(db.Karts, {}).sort({ createdAt: 'desc' }).populate('productId');

      if (Karts.length) {
        return res.status(200).jsend.success(successMsg('Products retrieved from cart successfully!', 200, 'Retrieve Product', {
          error: false, operationStatus: 'Operation Successful!', Karts
        }));
      }
      return res.status(200).jsend.success(successMsg('Nothing found for products from cart', 200, 'Retrieve Product', {
        error: false, operationStatus: 'Operation Successful!', Karts
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all Karts', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method retrieveCustomerKarts
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveCustomerKarts(req, res) {
    try {
      // GET CUSTOMER ID
      const tokenA = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      const result = tokenA ? await Utils.objectFromToken(db, req) : { error: false };

      if (result.error) {
        return res.status(403).jsend.fail(result);
      }
      const { _id: customerId } = result;

      const { token } = req.query;

      if (!token && !tokenA) {
        return res.status(403).jsend.fail(errorMsg('EPERM', 403, '', 'Retrieve Carts', 'You are not logged in, please generate a code to complete this action!', {
          error: false, operationStatus: 'Operation Terminated'
        }));
      }

      let foundRecentKarts = null;

      if (!tokenA) {
        foundRecentKarts = await Messanger.shouldFindObjects(db.Karts, { kartCode: token, recentKart: true }).sort({ createdAt: 'desc' }).populate('productId');
      } else {
        foundRecentKarts = await Messanger.shouldFindObjects(db.Karts, { customerId, recentKart: true }).sort({ createdAt: 'desc' }).populate('productId');
      }

      if (foundRecentKarts && foundRecentKarts.length) {
        return res.status(200).jsend.success(successMsg('Carts returned successfully!', 200, 'Retrieve Carts', {
          error: false, operationStatus: 'Operation Successful!', foundRecentKarts
        }));
      }
      return res.status(200).jsend.success(successMsg('Nothing found from Carts!', 200, 'Retrieve Carts', {
        error: false, operationStatus: 'Operation Successful!', foundRecentKarts
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one Cart', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }


  /**
   * @method editProduct
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async editProductInKart(req, res) {
    try {
      const validationResult = Services.ValidateRequest('edit_kart', req.body);

      if (validationResult.error) {
        return res.status(400).jsend.fail(validationResult);
      }

      // QUERRY DATABASE FOR ALL KARTS
      const allKarts = await Messanger.shouldFindObjects(db.Karts, {}).populate('productId', 'productPrice');

      // CONFIRM EXISTENCE
      if (!allKarts.length) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'edit item in cart', 'Item does not exist in cart!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }

      // FIND ITEMS TO UPDATE
      // eslint-disable-next-line no-restricted-syntax
      for (const kartItem of allKarts) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of req.body.itemsInKart) {
          if (kartItem._id.equals(item._id)) {
            // CALCULATE CUMMULATIVE PRICE
            kartItem.quantity = item.quantity;
            kartItem.cummulativePrice = kartItem.productId.productPrice * item.quantity;
          }
        }
        // eslint-disable-next-line no-await-in-loop
        await kartItem.save();
      }

      return res.status(200).jsend.success(successMsg('Edited Successfuly!', 200, 'Edit Item In Kart', { error: false, operationStatus: 'Process Completed!', allKarts }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Edit Item In Kart', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method deleteFromKart
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async deleteFromKart(req, res) {
    try {
      // QUERRY DATABASE
      const kart = await Messanger.shouldFindOneObject(db.Karts, { _id: req.params.kartId });

      // CONFIRM PRODUCT EXIST
      if (!kart) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'Delete product from kart', 'Product has already been deleted from cart or never existed!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }
      // PERFORM DELETION
      await Messanger.shouldDeleteOneObject(db.Karts, { id: req.params.kartId });

      // UPDATE KART COUNT IN PRODUCT
      const product = await Messanger.shouldFindOneObject(db.Products, { _id: kart.productId });

      product.inCartCount -= 1;

      await product.save();

      return res.status(200).jsend.success(successMsg('Deleted Successfuly!', 200, 'delete product', { error: false, operationStatus: 'Process Completed!' }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'delete product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }
}
