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
          error: true, operationStatus: 'Operation Ended'
        }));
      }

      if (!token && !email) {
        return res.status(400).jsend.fail(errorMsg('ValidationError', 400, '', 'Create Review', 'Please provide email!', {
          error: true, operationStatus: 'Operation Ended'
        }));
      }

      const product = await Messanger.shouldFindOneObject(db.Products, { _id: req.params.productId });

      if (!product) {
        return res.status(404).jsend.fail(errorMsg('ExistenceError', 404, '', 'Create Review', 'Nothing Found! Check Product Id', {
          error: true, operationStatus: 'Operation Ended', product
        }));
      }

      const alreadyReviewed = product.reviews.filter(data => (customerId ? data.customerId.equals(customerId) : data.email === email));

      if (alreadyReviewed.length) {
        return res.status(400).jsend.fail(errorMsg('DuplicationError', 400, '', 'Create Review', 'You have already reviewed this product', {
          error: true, operationStatus: 'Operation Terminated'
        }));
      }

      // CREATE REVIEW
      const reviewData = {
        review,
        customerId,
        username: (result.username || username || Utils.defaultName),
        email: (result.email || email),
        avatar: (result.avatar || Utils.defaultAvatar)
      };

      product.reviews.push(reviewData);
      product.ratings.push({ customerId, rating: rating || 0 });

      await product.save();

      return res.status(201).jsend.success(successMsg('Success!', 201, 'Thanks for your review on this product!', {
        success: true, operationStatus: 'Operation Successful!'
      }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Create Review', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
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

      return res.status(200).jsend.success(successMsg('Edited Successfuly!', 200, 'Edit Review', { success: true, operationStatus: 'Process Completed!', editedReview }));
    } catch (error) {
      return res.status(500).jsend.fail(errorMsg(`${error.syscall || error.name || 'ServerError'}`, 500, '', 'Edit Review', `${error.message}`, { error: true, operationStatus: 'Process Failed', err: error }));
    }
  }
}
