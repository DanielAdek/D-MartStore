import gravatar from 'gravatar';
import db from '../models';
import Utils from '../helpers';
import Services from '../utils/validation';
import Messanger from '../helpers/messanger';
import { isPhoneNumber } from '../utils/regex';
import { errorMsg, successMsg } from '../utils/message';

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
      return res.status(409).jsend.fail(errorMsg('Insertion Error', 409, 'email', 'Create Customer Account', 'Email already exist', { error: true, operationStatus: 'Processs Terminated!' }));
    }

    // Create customer account
    const {
      username, email, password, phoneNumber
    } = req.body;

    const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true);

    const customer = {
      username, email, password, phoneNumber, role: 'customer', avatar
    };

    const user = await Messanger.shouldInsertToDataBase(db.Users, customer);

    const token = Utils.generateToken('8760h', { id: user._id });

    return res.status(201).jsend.success(successMsg('Account created!', 201, 'Create Customer Account', {
      error: false, operationStatus: 'Operation Successful!', user, token
    }));
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
    const isPhone = isPhoneNumber(req.body.dataField);

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

      const token = Utils.generateToken('8760h', { id: user._id });

      return res.status(200).jsend.success(successMsg('Authenticaton successful', 200, 'Authenting user', {
        error: false, operationStatus: 'Process Completed', user, token
      }));
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
