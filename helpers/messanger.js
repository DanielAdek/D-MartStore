/**
 * @desc CREATE FEATURE
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE INSERTED
 * @param {object} data DATA FOR USER
 * @returns {object} JSON
 */
exports.shouldInsertToDataBase = (database, requestBody) => database.create(requestBody);

/**
 * @desc FIND FROM DB
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldFindOneObject = (database, requestBody) => database.findOne(requestBody);

/**
 * @desc FIND FROM DB
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldFindObjects = (database, requestBody) => database.find(requestBody);

/**
 * @desc FIND AND UPDATE
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldEditOneObject = (database, requestBody) => database.findByIdAndUpdate(requestBody.id, requestBody.newData);

/**
 * @desc FIND AND UPDATE
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldDeleteOneObject = (database, requestBody) => database.findByIdAndRemove(requestBody.id);

/**
 * @desc INSERT MANY OBJECTS TO DATA-BASE
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldInsertOneOrMoreObjects = (database, requestBody) => {
  if (Array.isArray(requestBody)) {
    database.insertMany(requestBody);
  } else {
    database.create(requestBody);
  }
};

/**
 * @desc INSERT OR UPDATE DATA
 * @param {Document} database DATA-BASE TO RECEIVE DATA
 * @param {object} requestBody THE REQUEST BODY TO BE USED
 * @returns {object} JSON
 */
exports.shouldInsertOrUpdateObject = async (database, requestBody) => {
  const foundObject = await database.findById(requestBody.id);
  if (foundObject) {
    return database.findByIdAndUpdate(requestBody.id, requestBody.data);
  }
  return database.create(requestBody.data);
};
