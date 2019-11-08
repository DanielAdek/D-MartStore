/**
 * @desc ERROR COMPOSER
 * @param {*} Stacktrace ERROR TRACER
 * @param {*} statusCode ERROR CODE LOG
 * @param {*} field ERROR FIELD
 * @param {*} target TARGETED ACTION
 * @param {*} message ERROR EXPLAINED
 * @param {*} details MORE ERROR DETAILS
 * @returns {object} JSON
 */
export const errorMsg = (Stacktrace, statusCode, field, target, message, details) => ({
  error: {
    error: true,
    Stacktrace,
    metadata: [
      {
        statusCode,
        field,
        target
      }
    ],
    message: message || 'Error!',
    details
  }
});

/**
 * @desc SUCCESS MESSAGE COMPOSER
 * @param {*} message SUCCESS MESSAGE
 * @param {*} statusCode STATUS CODE
 * @param {*} target TARGETED ACTION
 * @param {*} details MORE DATA
 * @returns {object} JSON
 */
export const successMsg = (message, statusCode, target, details) => ({
  error: false,
  message: message || 'Success!',
  metadata: [
    {
      statusCode,
      target
    }
  ],
  details
});
