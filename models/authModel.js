const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// MIDDLEWARE FUNCTIONS
const authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  username: {
  type: String,
  required: [true, 'Username is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phone: {
   type: String,
   required: [true, 'Phone Number is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female']
  },
  password: {
     type: String,
     required: [true, 'Password is required'],
     minlength: 8,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Virutal field for password confirmation
authSchema.virtual('passwordConfirm').get(function() {
  return this._passwordConfirm;
}).set(function(value) {
  this._passwordConfirm = value;
});

// validate password confirmation
authSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  if (this.password !== this.passwordConfirm) {
    return next(new Error('Password are not the same!!'));
  }

  next();
});


// Hashing the password and saving it to the database 
authSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
   this.passwordConfirm = undefined;
   next();
});

authSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

authSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parent(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

authSchema.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;