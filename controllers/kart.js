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

      const { productId, quantity } = req.body;

      const product = await Messanger.shouldFindOneObject(db.Products, { _id: productId });

      // CALCULATE CUMMULATIVE PRICE
      const cummulativePrice = product.productPrice * quantity;

      // CREATE Kart
      const KartData = {
        customerId, productId, quantity, cummulativePrice
      };

      const newKart = await Messanger.shouldInsertToDataBase(db.Karts, KartData);

      // UPDATE KART COUNT IN PRODUCT
      product.inCartCount += 1;

      await product.save();

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Cart Created Successfully', {
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
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Products returned from cart successfully', {
          error: false, operationStatus: 'Operation Successful!', Karts
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find all products in cart', 'Nothing Found For Karts!', {
        error: false, operationStatus: 'Operation Ended', Karts
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all Karts', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
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
        const defaultError = errorMsg('ExistenceError', 404, '', 'Delete product from kart', 'Product does not exist in kart!', { error: true, operationStatus: 'Process Terminated!' });
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
