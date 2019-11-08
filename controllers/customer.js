import gravatar from 'gravatar';
import db from '../models';
import { errorMsg } from '../utils/message';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';

/** @class */
export default class Customers {
  /**
   * @method create
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async createAccount(req, res) {
    const validationResult = Services.ValidateRequest('Signup', req.body);

    if (validationResult.error) {
      return res.status(400).jsend.fail(validationResult);
    }

    // Validate for duplicate record
    const foundCustomer = await Messanger.shouldFindOneObject(db.Users, { email: req.body.email });

    if (foundCustomer) {
      return res.status(400).jsend.fail(errorMsg('Insertion Error', 400, 'email', 'Create Customer Account', 'Email already exist'));
    }

    // Create customer account
    const {
      username, email, password, phoneNumber
    } = req.body;

    const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true);

    const customer = {
      username, email, password, phoneNumber, role: 'customer', avatar
    };

    const response = { message: 'Account created!', statusCode: 201, target: 'Create Customer Account' };

    Messanger.shouldInsertToDataBase(db.Users, customer, res, response);
  }

  /**
   * @method login
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async login(req, res) {
    // YOUR CODE IS REQUIRED
  }

  /**
   * @method retrieveCustomers
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async retrieveCustomers(req, res) {
    // YOUR CODE IS REQUIRED
  }

  /**
   * @method editProfile
   * @param {object} req The request object
   * @param {object} res The response object
   * @return {*} json
   */
  static async editProfile(req, res) {
    // YOUR CODE IS REQUIRED
  }
}
