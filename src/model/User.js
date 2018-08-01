'use strict';

const bcrypt = require('bcryptjs'); // for hashing passwords
const crypto = require('crypto'); // for getting random string to be tokenSeed
const jwt = require('jsonwebtoken'); // for encrypting tokenSeed to create token
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  isNitPicker: {type: Boolean, required: true, default: false},
  tokenSeed: {type: String, required: true, unique: true},
});

userSchema.methods.passwordHashCreate = function(password){
  return bcrypt.hash(password, 8)
    .then(hash => {
      this.passwordHash = hash;
      return this;
    });
};

userSchema.methods.passwordHashCompare = function(password){
  console.log('passwordHashCompare', password);
  return bcrypt.compare(password, this.passwordHash)
    .then(isCorrect => {
      if(isCorrect)
        return this;
      throw new Error('unauthorized password does not match');
    });
};

userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
    let tries = 1;

    let _tokenSeedCreate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this))
        .catch(err => {
          console.log(err.message);
          if(tries < 1)
            return reject(new Error('server failed to create tokenSeed'));
          tries--;
          _tokenSeedCreate();
        });
    };

    _tokenSeedCreate();
  });
};

userSchema.methods.tokenCreate = function(){
  return this.tokenSeedCreate()
    .then(() => {
      return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET);
    });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = function(data){
  let password = data.password;
  delete data.password;
  return new User(data).passwordHashCreate(password)
    .then(user => user.tokenCreate());
};
