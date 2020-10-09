const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require("config");
const secret = config.secret;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    index: true
  },
  bio: String,
  image: String,
  hash: String,
  salt: String
}, { timestamps: true });

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

function stringValidator(val){
  return val.test('/^[a-z0-9]+$/i')
}

module.exports = mongoose.model("user", UserSchema);