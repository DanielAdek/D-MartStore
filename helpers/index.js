import { config } from 'dotenv';
import JWT from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudMulterStorage from 'multer-storage-cloudinary';
import Object from '../middlewares/verify';
import { cloudinaryConfig } from '../config/cloudinary';

config();

const secret = process.env.SECRET;

/**
 * @description This function uploads images to cloudinary
 * @returns {object} returns the response object cloudinary which contains the image url
 */
exports.multerUploads = () => {
  // config cloudinary
  cloudinaryConfig();
  const storage = cloudMulterStorage({
    cloudinary,
    folder: 'uploads',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    filename: (_, file, cb) => {
      console.log(file);
      cb(null, `${Date.now()}${file.originalname}`);
    }
  });
  return multer({ storage });
};

/**
 * @desc GENERATE TOKEN FOR RANDOM USE
 * @param {String} charLen LENGTH OF THE CHARACTERS
 * @returns {String} TOKEN GENERATED
 */
const tokenGenerator = (charLen) => {
  let result = '';
  const alphaNum = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i <= charLen; i += 1) {
    result += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return result.toUpperCase();
};

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
 * @returns {object} JSON
 */
exports.objectFromToken = (dataBase, req) => Object.vAuth(req.headers.authorization.split(' ')[1], secret, dataBase);

/**
 * @desc SET DEFAULT AVATAR FOR USER
 * @returns {String} avatar image
 */
exports.defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQstdTNjhaUfy_tu_qrbawsAFJuOWrqJLzLnjjdB9P4oSeyJabX5w&s';

/**
 * @desc SET DEFAULT USER NAME
 * @returns {String} USER-NAME
 */
exports.defaultName = 'Anonymous';

/**
 * @desc GENERATE WISHLIST TOKEN
 * @param {Number} length THE LENGTH OF THE CHARACTERS NEEDED
 * @returns {String} generated string
 */
exports.generateTextCode = length => tokenGenerator(length);

// exports.imageUpload = async (file) => {
//   // INITIALIZES CLOUDINARY LOCAL CONFIGURATIONS
//   cloudinaryConfig();
//   const result = await cloudinary.v2.uploader.upload(file.content);
//   return result;
// };

// exports.multerUploader = () => {
//   const storage = multer.memoryStorage();
//   return multer({ storage });
// };

// /**
//  * @description This function converts the buffer to data url
//  * @param {Object} req containing the field object
//  * @returns {String} The data url from the string buffer
//  */
// const dUri = new Datauri();
// exports.dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
