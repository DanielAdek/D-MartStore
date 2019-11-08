import gravatar from 'gravatar';
import PhoneNumber from 'validate-phone-number-node-js';
import db from '../models';
import { errorMsg, successMsg } from '../utils/message';
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
    const validationResult = Services.ValidateRequest('SIGNUP', req.body);

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
    const validationResult = Services.ValidateRequest('LOGIN', req.body);

    if (validationResult.error) {
      return res.status(400).jsend.fail(validationResult);
    }

    let user = null;
    const isPhone = PhoneNumber.validate(req.body.dataField);

    // QUERY DATABASE
    if (!isPhone) {
      user = await Messanger.shouldFindOneObject(db.Users, { email: req.body.dataField });
    } else {
      user = await Messanger.shouldFindOneObject(db.Users, { phoneNumber: req.body.dataField });
    }

    if (user) {
      const passwordMatch = await user.comparePassword(req.body.password);

      if (!passwordMatch) {
        return res.status(401).jsend.fail(errorMsg('Authentication Error', 401, 'password', 'Authenticate user', 'Password Incorrect!', { error: true, operationStatus: 'Process Terminated', user: null }));
      }

      return res.status(200).jsend.success(successMsg('Authenticaton successful', 200, 'Authenting user', { error: false, operationStatus: 'Process Completed', user }));
    }
    return res.status(400).jsend.fail(errorMsg('Authentication Error', 400, 'Email/Phone Number', 'Authenticate user', `${isPhone ? 'The phone number you provide is not found!' : 'The email you provide is not found!'}`, { error: true, operationStatus: 'Process Terminated', user: null }));
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
