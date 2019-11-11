/**
 * @desc CREATE FEATURE
 * @param {*} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE INSERTED
 * @param {object} data DATA FOR USER
 * @returns {object} JSON
 */
exports.shouldInsertToDataBase = (database, requestBody) => database.create(requestBody);

/**
 * @desc FIND FROM DB
 * @param {*} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldFindOneObject = (database, requestBody) => database.findOne(requestBody);
