import { config } from 'dotenv';
import JWT from 'jsonwebtoken';
import db from '../models';
import Messanger from '../helpers/messanger';
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
    JWT.verify(token, secret, async (error, decoded) => {
      if (error) {
        return res.status(403).jsend.fail(errorMsg('EACCES', 403, 'headers:{Authorization}', 'Authorize user', 'Access Denied!', { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
      }
      const foundUser = await Messanger.shouldFindOneObject(db.Users, { _id: decoded.id });
      if (!foundUser) {
        return res.status(403).jsend.fail(errorMsg('EACCES', 403, 'headers:{Authorization}', 'Authorize user', 'Access Denied!. Cannot Find User Account', { error: true, operationStatus: 'Processs Terminated!' }));
      }
      req.user = foundUser;
      next();
    });
  } catch (error) {
    return res.status(500).jsend.fail(errorMsg('EACCES', 500, 'headers:{Authorization}', 'Authorize user', `${error.message}`, { error: true, operationStatus: 'Processs Terminated!', errorSpec: error }));
  }
};
