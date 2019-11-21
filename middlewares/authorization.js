import { config } from 'dotenv';
import db from '../models';
import Object from './verify';
import { errorMsg } from '../utils/message';

config();

const secret = process.env.SECRET;

exports.verifyToken = async (req, res, next) => {
  const tokenBearer = req.headers.authorization;
  if (!tokenBearer) {
    return res.status(403).jsend.fail(errorMsg('EACCES', 403, 'headers:{Authorization}', 'Authorize user', 'Client key is required. Access Denied!', { error: true, operationStatus: 'Processs Terminated!' }));
  }
  const token = tokenBearer.split(' ')[1];
  try {
    const result = await Object.vAuth(token, secret, db);
    if (result.error) {
      return res.status(403).jsend.fail(result);
    }
    req.user = result;
    next();
  } catch (error) {
    return res.status(500).jsend.fail(errorMsg('EACCES', 500, 'headers:{Authorization}', 'Authorize user', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
  }
};
