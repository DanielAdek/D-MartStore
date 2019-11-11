import PhoneNumber from 'validate-phone-number-node-js';
import { errorMsg } from './message';

/**
 * @desc VALIDATES INPUT FIELDS
 * @param {*} value VALUE PASSED
 * @returns {Boolean} BOOLEAN
 */
const isEmpty = value => (value.trim() === '');

/**
 * @function isEmail
 * @param {*} value
 * @return {*} boolean
 */
const isEmail = (value) => {
  const regex = /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ /* eslint-disable-line */
  return regex.test(value);
};

/**
 * @desc VALIDATES PROVIDED FIELDS
 * @param {object} expectedRequest REQUEST TO BE PASSED
 * @param {object} requestBody REQUEST BODY
 * @returns {object} JSON
 */
const compareTwoObjectsKeys = (expectedRequest, requestBody) => {
  let isNullOrUndefined = false;
  const keyWithIsNullOrUndefined = [];

  /*eslint-disable */
  const validateDataType = (obj) => {
    for (const value in obj) {
      if (obj[value] === null) {
        isNullOrUndefined = true;
        keyWithIsNullOrUndefined.push(value);
      }
      if (obj[value] === undefined) {
        isNullOrUndefined = true;
        keyWithIsNullOrUndefined.push(value);
      }
    }
  };
  /* eslint-enable */
  validateDataType(expectedRequest);
  validateDataType(requestBody);

  const mainArray = Object.keys(expectedRequest);
  const secondaryArray = Object.keys(requestBody);
  const result = mainArray.filter(n => !secondaryArray.includes(n));

  return {
    missingFields: result, count: result.length, isNullOrUndefined, keyWithIsNullOrUndefined
  };
};

/**
 * @desc VALIDATES INPUT FIELDS
 * @param {*} type TYPE OF ACTION
 * @param {object} requestBody THE REQUEST BODY TO BE VALIDATED
 * @returns {object} JSON
 */
exports.ValidateRequest = (type, requestBody) => {
  // Signup form Validation
  if (type.toLowerCase().trim() === 'signup') {
    // Confirm the request-body is complete
    const expectedRequest = {
      username: '', email: '', phoneNumber: '', password: ''
    };
    const foundMissingKeys = compareTwoObjectsKeys(expectedRequest, requestBody);

    if (foundMissingKeys.missingFields.length || foundMissingKeys.isNullOrUndefined) {
      return errorMsg(`${foundMissingKeys.isNullOrUndefined ? 'Object Property (value: null or undefined not accepted)' : 'Missing Fields'}`, 400, `${foundMissingKeys.missingFields.length ? foundMissingKeys.missingFields : foundMissingKeys.keyWithIsNullOrUndefined}`, 'Request Body', `${foundMissingKeys.isNullOrUndefined ? 'Value null or undefined not accepted. Replace null or undefined with empty string' : `There are ${foundMissingKeys.count} fields missing in your request: ${foundMissingKeys.missingFields}`}`, { error: true, operationStatus: 'Processs Terminated!' });
    }

    // Validate form fields
    if (isEmpty(requestBody.username)) {
      return errorMsg('Validation Error', 400, 'username', 'SIGN UP', 'username cannot be empty', { error: true, operationStatus: 'Processs Terminated!' });
    }
    if (!isEmail(requestBody.email)) {
      return errorMsg('Validation Error', 400, 'email', 'SIGN UP', 'email is invalid', { error: true, operationStatus: 'Processs Terminated!' });
    }
    if (isEmpty(requestBody.password)) {
      return errorMsg('Validation Error', 400, 'password', 'SIGN UP', 'password cannot be empty', { error: true, operationStatus: 'Processs Terminated!' });
    }
    if (requestBody.password.length < 5) {
      return errorMsg('Validation Error', 400, 'password', 'SIGN UP', 'Password length should not be less than five', { error: true, operationStatus: 'Processs Terminated!' });
    }
    return { error: false };
  }

  // login form validation
  if (type.toLowerCase().trim() === 'login') {
    // Confirm the request-body is complete
    const expectedRequest = { dataField: '', password: '' };
    const foundMissingKeys = compareTwoObjectsKeys(expectedRequest, requestBody);

    if (foundMissingKeys.missingFields.length || foundMissingKeys.isNullOrUndefined) {
      return errorMsg(`${foundMissingKeys.isNullOrUndefined ? 'Object Property (value: null or undefined not accepted)' : 'Missing Fields'}`, 400, `${foundMissingKeys.missingFields.length ? foundMissingKeys.missingFields : foundMissingKeys.keyWithIsNullOrUndefined}`, 'Request Body', `${foundMissingKeys.isNullOrUndefined ? 'Value null or undefined not accepted. Replace null or undefined with empty string' : `There are ${foundMissingKeys.count} fields missing in your request: ${foundMissingKeys.missingFields}`}`, { error: true, operationStatus: 'Processs Terminated!' });
    }

    if (!isEmail(requestBody.dataField) && !PhoneNumber.validate(requestBody.dataField)) {
      return errorMsg('Validation Error', 401, 'Email/Phone Number', 'LOGIN', 'Please enter a valid email or phone number!', { error: true, operationStatus: 'Processs Terminated!' });
    }

    if (isEmpty(requestBody.password)) {
      return errorMsg('Validation Error', 401, 'password', 'LOGIN', 'password cannot be empty', { error: true, operationStatus: 'Processs Terminated!' });
    }

    return { error: false };
  }
};
