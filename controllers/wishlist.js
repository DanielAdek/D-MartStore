import db from '../models';
import Utils from '../helpers';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';
import { errorMsg, successMsg } from '../utils/message';

/** @class WishList */
export default class WishList {
  /**
   * @method addToWishList
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async addToWishList(req, res) {
    try {
      const validationResult = Services.ValidateRequest('create_wishlist', req.body);

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

      const { wishlistcode, imageType } = req.body;

      if (!token && !wishlistcode) {
        return res.status(403).jsend.fail(errorMsg('EPERM', 403, '', 'Create WishList', 'You are not logged in, please generate a code to complete this action!', {
          error: false, operationStatus: 'Operation Terminated'
        }));
      }

      let foundOnWishList = null;

      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });

      if (!product) {
        return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Create WishList', 'This product does not exist or has been deleted', {
          error: false, operationStatus: 'Operation Ended', product
        }));
      }

      if (!token) {
        foundOnWishList = await Messanger.shouldFindOneObject(db.WishLists, {
          wishlistcode, productId: req.params.productId, imageType, recentWish: true
        });
      } else {
        foundOnWishList = await Messanger.shouldFindOneObject(db.WishLists, {
          customerId, productId: req.params.productId, imageType, recentWish: true
        });
      }

      // CHECK DUPLICATE RECORD
      if (foundOnWishList) {
        return res.status(403).jsend.fail(errorMsg('CastError', 400, '', 'Create WishList', 'Product already on wishlist!', {
          error: false, operationStatus: 'Operation Ended'
        }));
      }

      // CREATE WISHLIST
      const WishListData = {
        wishlistcode, imageType, customerId, productId: product._id
      };

      const newWishList = await Messanger.shouldInsertToDataBase(db.WishLists, WishListData);

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Product added to wishlist', {
        error: false, operationStatus: 'Operation Successful!', newWishList
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create WishList', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retrieveWishLists
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveWishLists(req, res) {
    try {
      const WishLists = await Messanger.shouldFindObjects(db.WishLists, {}).sort({ createdAt: 'desc' }).populate('productId');

      if (WishLists.length) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'WishLists returned successfully', {
          error: false, operationStatus: 'Operation Successful!', WishLists
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find all WishLists', 'Nothing Found For WishLists!', {
        error: false, operationStatus: 'Operation Ended', WishLists
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all WishLists', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method retrieveCustomerWishLists
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveCustomerWishLists(req, res) {
    try {
      // GET CUSTOMER ID
      const tokenA = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      const result = tokenA ? await Utils.objectFromToken(db, req) : { error: false };

      if (result.error) {
        return res.status(403).jsend.fail(result);
      }
      const { _id: customerId } = result;

      const { token } = req.query;

      let foundRecentWishLists = null;

      if (!token && !tokenA) {
        return res.status(403).jsend.fail(errorMsg('EPERM', 403, '', 'Retrieve WishList', 'You are not logged in, please generate a code to complete this action!', {
          error: false, operationStatus: 'Operation Terminated'
        }));
      }

      if (!tokenA) {
        foundRecentWishLists = await Messanger.shouldFindObjects(db.WishLists, { wishlistcode: token, recentWish: true }).sort({ createdAt: 'desc' }).populate('productId');
      } else {
        foundRecentWishLists = await Messanger.shouldFindObjects(db.WishLists, { customerId, recentWish: true }).sort({ createdAt: 'desc' }).populate('productId');
      }

      if (foundRecentWishLists.length) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'WishList returned successfully!', {
          error: false, operationStatus: 'Operation Successful!', foundRecentWishLists
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find One Customer WishLists', 'No recent wish on your list!', {
        error: false, operationStatus: 'Operation Ended', foundRecentWishLists
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one WishList', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method deleteFromWishlist
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async deleteFromWishlist(req, res) {
    try {
      // QUERRY DATABASE
      const foundOnWishList = await Messanger.shouldFindOneObject(db.WishLists, { _id: req.params.wishlistId });

      // CONFIRM WISH EXIST ON LIST
      if (!foundOnWishList) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'Delete wish from wishlist', 'Product does not exist in !', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }
      // PERFORM DELETION
      await Messanger.shouldDeleteOneObject(db.WishLists, { id: req.params.wishlistId });

      return res.status(200).jsend.success(successMsg('Deleted Successfuly!', 200, 'Deleted one wish from list', { error: false, operationStatus: 'Process Completed!' }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'delete product', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }
}
