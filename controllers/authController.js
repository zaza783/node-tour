const Auth = require('../models/authModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");
const sendEmail = require('../utils/email');
const AppError = require("../utils/appError");

// Generate JWT token
const generateToken = (user, secret, expiresIn) => {
  return jwt.sign(
   {email: user.email, userId: user._id },
   secret,
   { expiresIn }
  );
};

// Generate refresh token

exports.signup = catchAsync(async(req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email,
    username, 
    address,
    phone,
    gender,
    password 
  } = req.body;

  // check if user already exists 
  const existingUser = await Auth.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already exist!!', 400));
  }
  

  const user = new Auth({
    firstName,
    lastName,
    email,
    username,
    address,
    phone,
    gender,
    password
  });

  const result = await user.save();

  // Executing the genrate token function
  const token = generateToken(result, process.env.JWT_SECRET, '1h');

  res.status(200).json({
     message: 'Signed Up Successfully!!!',
     result,
     token
  });
});


exports.login = catchAsync(async(req, res, next) => {
   const { email, password } = req.body;

   if (!email || !password) {
    return next(new AppError('Please provide your correct email or password', 400));
   }

   const user = await Auth.findOne({ email }).select('+password');

   if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
   }

   const token = generateToken(user, process.env.JWT_SECRET, '1h');

   await user.save({ validateBeforeSave: false });

   res.status(200).json({
    token,
   })
});

exports.protect = catchAsync(async (req, res, next) => {
   let token;

   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
   }

   if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);

   const currentUser = await Auth.findById(decoded.userId);
   if (!currentUser) {
    return next(new AppError('The user beloging to this token is no longer exists.', 401));
   }

   if (!currentUser.changePasswordAfter(decoded.iat)) {
     return next(new AppError('User recently changed password! Please log in again.', 401));
   }

   req.user = currentUser;
   next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await Auth.findOne({email: req.body.email});

    if (!user) {
      return next(new AppError('We could not find the user with the given email', 404));
    }

    // Generate reset token
    const resetToken = user.createResetPasswordToken();

    // Save the reset token and  expiry in the database
    await user.save({ validateBeforeSave: false});

    // Create the reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    // Email content
    const message = `We recieved a password reset request. please use the link to reset your password:\n\n${resetURL}\n\nThis reset password link will be valid only for 20 minutes. please make use of the link sent.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message, 
      });

      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to this users email',
      });
    } catch (err) {
      
      //  clean up the reset token and expiry if email fails to send
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending password reset email please try again later', 500));
    }

  });

exports.resetPassword = catchAsync(async(req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await Auth.findOne({
    passwordResetToken:token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body,passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  const loginToken = generateToken(user, process.env.JWT_SECRET, '1h');

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    token: loginToken
  });
});