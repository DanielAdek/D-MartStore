import { config } from 'dotenv';
import JWT from 'jsonwebtoken';

config();

const secret = process.env.SECRET;

/**
 * @desc GENERATE TOKEN FOR AUTHORIZATION
 * @param {String} time THE EXPIRY TIME
 * @param {object} payload THE DATA TO BE CONTAINED IN THE TOKEN
 * @returns {String} JSON
 */
exports.generateToken = (time, payload) => (`Bearer ${JWT.sign(payload, secret, { expiresIn: time })}`);
