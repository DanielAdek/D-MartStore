import { successMsg } from '../utils/message';
/**
 * @desc CREATE SIGNUP
 * @param {*} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE INSERTED
 * @param {object} responseBody THE RESPONSE BODY TO BE SENT
 * @param {object} data DATA FOR USER
 * @returns {object} JSON
 */
exports.shouldInsertToDataBase = async (database, requestBody, responseBody, data) => {
  const result = await database.create(requestBody);
  return responseBody.status(201).jsend.success(successMsg(data.message, data.statusCode, data.target, result));
};

/**
 * @desc CREATE SIGNUP
 * @param {*} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldFindOneObject = (database, requestBody) => database.findOne(requestBody);
