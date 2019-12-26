import db from '../models';
import Utils from '../helpers';
import { errorMsg, successMsg } from '../utils/message';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';

/** @class Review */
export default class Review {
  /**
   * @method createReview
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async createReview(req, res) {
    try {
      const validationResult = Services.ValidateRequest('create_review', req.body);

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
        review, username, email, rating
      } = req.body;

      if (!rating && !review) {
        return res.status(400).jsend.fail(errorMsg('ValidationError', 400, '', 'Create Review', 'Please rate or add review note to proceed', {
          error: false, operationStatus: 'Operation Ended'
        }));
      }

      if (!token && !email) {
        return res.status(400).jsend.fail(errorMsg('ValidationError', 400, '', 'Create Review', 'Please provide email!', {
          error: false, operationStatus: 'Operation Ended'
        }));
      }

      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });

      if (!product) {
        return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Create Review', 'Nothing Found! Check Product Id', {
          error: false, operationStatus: 'Operation Ended', product
        }));
      }

      const foundReview = await Messanger.shouldFindOneObject(db.Reviews, { customerId, productId: req.params.productId });

      if (foundReview) {
        return res.status(400).jsend.fail(errorMsg('DuplicationError', 400, '', 'Create Review', 'You have already reviewed this product', {
          error: false, operationStatus: 'Operation Terminated'
        }));
      }

      // CREATE REVIEW
      const reviewData = {
        review,
        customerId,
        productId: product._id,
        username: (result.username || username || Utils.defaultName),
        email: (result.email || email),
        avatar: (result.avatar || Utils.defaultAvatar)
      };

      const newReview = await Messanger.shouldInsertToDataBase(db.Reviews, reviewData);
      await Messanger.shouldInsertToDataBase(db.Ratings, { customerId, productId: req.params.productId, rating: rating || 0 });

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Thanks for your review on this product!', {
        error: false, operationStatus: 'Operation Successful!', newReview
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create Review', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }

  /**
   * @method retrieveReviews
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveReviews(req, res) {
    try {
      const reviews = await Messanger.shouldFindObjects(db.Reviews, {}).sort({ createdAt: 'desc' }).populate('productId');

      if (reviews.length) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Reviews returned successfully', {
          error: false, operationStatus: 'Operation Successful!', reviews
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find all reviews', 'Nothing Found For Reviews!', {
        error: false, operationStatus: 'Operation Ended', reviews
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find all Reviews', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method retrieveOneReview
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveOneReview(req, res) {
    try {
      const review = await Messanger.shouldFindOneObject(db.Reviews, { _id: req.params.reviewId });

      if (review) {
        return res.status(200).jsend.success(successMsg('Success!', 200, 'Review returned successfully!', {
          error: false, operationStatus: 'Operation Successful!', review
        }));
      }
      return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Find one review', 'Review not found for provided Id!', {
        error: false, operationStatus: 'Operation Ended', review
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, `${error.path || 'No Field'}`, 'Find one review', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
    }
  }

  /**
   * @method editReview
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async editReview(req, res) {
    try {
      const validationResult = Services.ValidateRequest('edit_review', req.body);

      if (validationResult.error) {
        return res.status(400).jsend.fail(validationResult);
      }

      // QUERRY DATABASE FOR ALL KARTS
      const review = await Messanger.shouldFindOneObjects(db.Reviews, { _id: req.params.reviewId });

      // CONFIRM EXISTENCE
      if (!review) {
        const defaultError = errorMsg('ExistenceError', 404, '', 'edit review', 'Review not found!', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }


      // GET CUSTOMER ID
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      const result = token ? await Utils.objectFromToken(db, req) : { error: false };


      if (token && !review.customerId.equals(result._id)) {
        const defaultError = errorMsg('ReferenceError', 400, '', 'edit review', 'You cannot edit another person\'s review', { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }

      if (review.email !== req.body.email) {
        const defaultError = errorMsg('ReferenceError', 400, '', 'edit review', `${req.body.email} is not the creator of this review. You can't edit it by this email provided`, { error: true, operationStatus: 'Process Terminated!' });
        return res.status(404).jsend.fail(defaultError);
      }

      const newData = { rating: req.body.rating || review.rating, review: req.body.review || review.review };

      const editedReview = await Messanger.shouldEditOneObject(db.Reviews, { id: req.params.reviewId, newData });

      return res.status(200).jsend.success(successMsg('Edited Successfuly!', 200, 'Edit Review', { error: false, operationStatus: 'Process Completed!', editedReview }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Edit Review', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }
}
