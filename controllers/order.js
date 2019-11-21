import db from '../models';
import Utils from '../helpers';
import { errorMsg, successMsg } from '../utils/message';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';

/** @class */
export default class Order {
  /**
   * @method createOrder
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async createOrder(req, res) {
    try {
      const validationResult = Services.ValidateRequest('create_order', req.body);

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

      const {
        recipientName, recipientDeliveryAdr, recipientEmail, productId,
        recipientPhoneNumber, recipientOrderNote, orderPaymentOption
      } = req.body;

      const pricesOfProducts = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const product of productId) {
        // eslint-disable-next-line no-await-in-loop
        pricesOfProducts.push(await Messanger.shouldFindOneObject(db.Products, { _id: product._id }));
      }

      // CALCULATE ORDER AMOUT
      const sumTotalOrdersPrice = pricesOfProducts.reduce((prevVal, currentVal) => {
        prevVal += currentVal.productPrice;
        return prevVal;
      }, 0);

      // CREATE ORDER
      const orderData = {
        customerId, recipientName, recipientDeliveryAdr, recipientEmail, recipientPhoneNumber, recipientOrderNote, orderPaymentOption, productId, sumTotalOrdersPrice
      };

      const newOrder = await Messanger.shouldInsertToDataBase(db.Orders, orderData);

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Order Created Successfully', {
        error: false, operationStatus: 'Operation Successful!', newOrder
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create Product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retrieveOrders
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveOrders(req, res) {
    try {
      const Orders = await Messanger.shouldFindObjects(db.Orders, {}).sort({ createdAt: 'desc' }).populate('productId');

      if (Orders.length) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Orders returned Successfully', {
          error: false, operationStatus: 'Operation Successful!', Orders
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find all product', 'Nothing Found For Orders!', {
        error: false, operationStatus: 'Operation Ended', Orders
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all Orders', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }
}
