import JWT from 'jsonwebtoken';
import Messanger from '../helpers/messanger';
import { errorMsg } from '../utils/message';

exports.vAuth = async (token, secret, db) => JWT.verify(token, secret, async (error, decoded) => {
  if (error) {
    return errorMsg('EACCES', 403, 'headers:{Authorization}', 'Authorize user', 'Access Denied!', { error: true, operationStatus: 'Processs Terminated!', errorSpec: error });
  }
  const foundUser = await Messanger.shouldFindOneObject(db.Users, { _id: decoded.id });
  if (!foundUser) {
    return errorMsg('EACCES', 403, 'headers:{Authorization}', 'Authorize user', 'Access Denied!. Cannot Find User Account', { error: true, operationStatus: 'Processs Terminated!' });
  }
  return foundUser;
});
