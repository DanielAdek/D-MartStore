import { errorMsg } from './message';
import Form from './request_schema';
import {
  isEmail, isAlpha, isDecimal, isEmpty, isPhoneNumber, isName, isInteger, splitCamelCaseWord
} from './regex';
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
 * @param {*} formType TYPE OF ACTION
 * @param {object} requestBody THE REQUEST BODY TO BE VALIDATED
 * @param {object} customErrorObject THE PREFERED RESPONSE BY USER
 * @returns {object} JSON
 */
exports.ValidateRequest = (formType, requestBody, customErrorObject) => {
  const emailField = [];
  const phoneFields = [];
  const maxMinFields = [];
  const requiredFields = [];
  const expectedFields = {};
  const fieldsWithRange = [];
  const fieldsWithNameValues = [];
  const fieldsWithAlphaValues = [];
  const fieldsWithIntegerValues = [];
  const fieldsWithDecimalValues = [];
  const fieldsWithArrayAsValues = [];
  const fieldsWithObjectAsValues = [];

  let errorMessage, errorCompareKeys;
  Object.keys(Form).forEach((request) => {
    if (typeof Form[request].formType === 'string' && typeof formType === 'string') {
      if (Form[request].formType.toLowerCase().trim() === formType.toLowerCase().trim()) {
        /**
         * @desc GET VALIDATION REQUIREMENTs
         */
        Object.keys(Form[request])
          .filter(data => typeof Form[request][data] === 'object')
          .forEach((keys) => {
            expectedFields[Form[request][keys].field] = '?';
            // Requirement for required field
            if (Form[request][keys].required) {
              requiredFields.push(Form[request][keys]);
            }
            // Requirement for alpha field
            if (Form[request][keys].isAlpha) {
              fieldsWithAlphaValues.push(Form[request][keys]);
            }
            // Requirement for decimal field
            if (Form[request][keys].isDecimal) {
              fieldsWithDecimalValues.push(Form[request][keys]);
            }
            // Requirement for name field
            if (Form[request][keys].isName) {
              fieldsWithNameValues.push(Form[request][keys]);
            }
            // Requirement for digit field
            if (Form[request][keys].isInteger) {
              fieldsWithIntegerValues.push(Form[request][keys]);
            }
            // Requirement for email
            if (Form[request][keys].isEmail) {
              emailField.push(Form[request][keys]);
            }
            // Requirement for phone number validation
            if (Form[request][keys].isPhoneNumber) {
              phoneFields.push(Form[request][keys]);
            }
            // Requirement for max and min validation
            if (Form[request][keys].max || Form[request][keys].min) {
              maxMinFields.push(Form[request][keys]);
            }
            // Requirement for array
            if (Form[request][keys].isArray) {
              fieldsWithArrayAsValues.push(Form[request][keys]);
            }
            // Requirement for object not null
            if (Form[request][keys].isObject) {
              fieldsWithObjectAsValues.push(Form[request][keys]);
            }
            // Requirement for range value
            if (typeof Form[request][keys].range === 'object' && Form[request][keys].range !== null) {
              fieldsWithRange.push(Form[request][keys]);
            }
          });

        /**
         * @desc Find MISSING KEYS IN USER'S REQUEST-BODY
         */
        const foundMissingKeys = compareTwoObjectsKeys(expectedFields, requestBody);
        if (foundMissingKeys.missingFields.length || foundMissingKeys.isNullOrUndefined) {
          errorCompareKeys = customErrorObject ? { error: true, customErrorObject } : errorMsg(`${foundMissingKeys.isNullOrUndefined ? 'Object Property (value: null or undefined not accepted)' : 'Missing Fields'}`, 400, `${foundMissingKeys.missingFields.length ? foundMissingKeys.missingFields : foundMissingKeys.keyWithIsNullOrUndefined}`, 'Request Body', `${foundMissingKeys.isNullOrUndefined ? 'Value null or undefined not accepted. Replace (null or undefined) with empty string, if you mean to return nothing' : `There are ${foundMissingKeys.count} fields missing in your request: ${foundMissingKeys.missingFields}`}`, { error: true, operationStatus: 'Processs Terminated!' });
        }

        /**
         * @desc VALIDATE FOR REQUIRED FIELDS
         */
        if (requiredFields.length) {
          requiredFields.forEach((object) => {
            Object.keys(requestBody).forEach((body) => {
              if (body === object.field) {
                if (typeof requestBody[body] === 'string' && isEmpty(requestBody[body]) && object.required) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${body}`, `${formType}`, `${splitCamelCaseWord(body)} cannot be empty`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR EMAIL FIELDs
         */
        if (emailField.length) {
          Object.keys(requestBody).forEach((key) => {
            emailField.forEach((obj) => {
              if (request[key]) {
                if (key === obj.field && !isEmail(requestBody[key])) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 422, `${obj.field}`, `${formType}`, `${splitCamelCaseWord(obj.field)} is invalid. Email should look like e.g example@mail.com`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR PHONE FIELD
         */
        if (phoneFields.length) {
          Object.keys(requestBody).forEach((key) => {
            phoneFields.forEach((obj) => {
              if (request[key]) {
                if (obj.field === key && !isPhoneNumber(requestBody[key])) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 422, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} is invalid. You can try using a number like +2348180000009`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR MAX AND MIN LENGTH
         */
        if (maxMinFields.length) {
          Object.keys(requestBody).forEach((key) => {
            maxMinFields.forEach((obj) => {
              if (typeof requestBody[key] === 'string') {
                if ((obj.field === key && requestBody[key].length > obj.max) || (obj.field === key && requestBody[key].length < obj.min)) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, ` The min characters expected for this field: ${splitCamelCaseWord(obj.field)}, is ${obj.min} with a max of ${obj.max}.`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR ARRAY VALUES
         */
        if (fieldsWithArrayAsValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithArrayAsValues.forEach((obj) => {
              if (obj.field === key && !Array.isArray(requestBody[key])) {
                errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should be an array dataType`, { error: true, operationStatus: 'Processs Terminated!' });
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR OBJECTS AS VALUE
         */
        if (fieldsWithObjectAsValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithObjectAsValues.forEach((obj) => {
              if (obj.field === key && typeof requestBody[key] !== 'object' && requestBody[key] !== null) {
                errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should be an object literal dataType`, { error: true, operationStatus: 'Processs Terminated!' });
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR DECIMAL VALUE
         */
        if (fieldsWithDecimalValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithDecimalValues.forEach((obj) => {
              if (request[key]) {
                if (obj.field === key && !isDecimal(requestBody[key])) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should be a decimal value`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR ALPHA VALUE
         */
        if (fieldsWithAlphaValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithAlphaValues.forEach((obj) => {
              if (request[key]) {
                if (obj.field === key && !isAlpha(requestBody[key])) {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should only be alphabets`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }

        /**
         * @desc VALIDATE FOR DIGITS VALUE
         */
        if (fieldsWithIntegerValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithIntegerValues.forEach((obj) => {
              if (obj.field === key && !isInteger(requestBody[key]) && typeof requestBody[key] === 'number') {
                errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should only be an integer`, { error: true, operationStatus: 'Processs Terminated!' });
              }
            });
          });
        }
        /**
         * @desc VALIDATE FOR NAMES VALUE
         */
        if (fieldsWithNameValues.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithNameValues.forEach((obj) => {
              if (request[key]) {
                if (obj.field === key && !isName(requestBody[key]) && request[key].trim() !== '') {
                  errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should not contain characters: (#@$!±^&*+=">?{</}_|)`, { error: true, operationStatus: 'Processs Terminated!' });
                }
              }
            });
          });
        }
        /**
         * @desc VALIDATE FOR RANGE VALUES
         */
        if (fieldsWithRange.length) {
          Object.keys(requestBody).forEach((key) => {
            fieldsWithRange.forEach((obj) => {
              if (obj.field === key) {
                const [from, to] = Object.keys(obj.range);
                if (from === 'from' && to === 'to' && typeof obj.range[from] === 'number' && typeof obj.range[to] === 'number') {
                  if (typeof requestBody[key] === 'number' && (requestBody[key] < obj.range[from] || requestBody[key] > obj.range[to])) {
                    errorMessage = customErrorObject ? { error: true, customErrorObject } : errorMsg('ValidationError', 400, `${key}`, `${formType}`, `${splitCamelCaseWord(obj.field)} should be within range specification: ${obj.range[from]} - ${obj.range[to]}`, { error: true, operationStatus: 'Processs Terminated!' });
                  }
                }
              }
            });
          });
        }
      }
    }
  });
  return errorCompareKeys || errorMessage || { error: false };
};
