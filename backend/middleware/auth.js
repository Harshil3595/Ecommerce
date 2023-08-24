const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken")
const User=require('../models/userModels');


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ success: false, message: 'No token provided' });
  }

  const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  try {
    const decoded = jwt.verify(tokenValue, 'Harshil');
    if (!decoded || !decoded.id) {
      return res.status(403).send({ success: false, message: 'Failed to authenticate token' });
    }

    req.user = await User.findById(decoded.id);
    req.userId=decoded.id;

    next();
  } catch (err) {
    return res.status(403).send({ success: false, message: 'Failed to authenticate token' });
  }
});


exports.authorizedRoles = (role) => async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ success: false, message: 'No token provided' });
  }

  const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  try {
    const decoded = jwt.verify(tokenValue, 'Harshil');

    if (!decoded || !decoded.id) {
      return res.status(403).send({ success: false, message: 'Failed to authenticate token' });
    }


    const user = await User.findById(decoded.id);

    if (!user || user.role !== role) {
      return res.status(403).send({ success: false, message: 'Unauthorized role' });
    }

    next();
  } catch (err) {
    return res.status(403).send({ success: false, message: 'Failed to authenticate token' });
  }
};


