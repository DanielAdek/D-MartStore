import { config } from 'dotenv';
import JWT from 'jsonwebtoken';
import Object from '../middlewares/verify';

config();

const secret = process.env.SECRET;

/**
 * @desc GENERATE TOKEN FOR AUTHORIZATION
 * @param {String} time THE EXPIRY TIME
 * @param {object} payload THE DATA TO BE CONTAINED IN THE TOKEN
 * @returns {String} JSON
 */
exports.generateToken = (time, payload) => (`Bearer ${JWT.sign(payload, secret, { expiresIn: time })}`);

/**
 * @desc GET OBJECT FROM TOKEN PROVIDED
 * @param {String} dataBase DATA-BASE TO FIND USER
 * @param {object} req EXPRESS REQUEST OBJECT TO GET TOKEN FROM AUTHORIZATION
 * @returns {String} JSON
 */
exports.objectFromToken = (dataBase, req) => Object.vAuth(req.headers.authorization.split(' ')[1], secret, dataBase);
