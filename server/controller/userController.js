// var mongoose = require('mongoose');
// var User = mongoose.model('User');
const passport = require('passport');
const User = require('../mongomodel/user')

class userController{
  static getUser(req,res,next){
    User.findById(req.payload.id).then(function(user){
      if(!user){ return res.sendStatus(401); }
  
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  }

  static updateUser(req,res,next){
    User.findById(req.payload.id).then(function(user){
      if(!user){ return res.sendStatus(401); }
  
      if(typeof req.body.user.username !== 'undefined'){
        user.username = req.body.user.username;
      }
      if(typeof req.body.user.email !== 'undefined'){
        user.email = req.body.user.email;
      }
      if(typeof req.body.user.bio !== 'undefined'){
        user.bio = req.body.user.bio;
      }
      if(typeof req.body.user.image !== 'undefined'){
        user.image = req.body.user.image;
      }
      if(typeof req.body.user.password !== 'undefined'){
        user.setPassword(req.body.user.password);
      }
  
      return user.save().then(function(){
        return res.json({user: user.toAuthJSON()});
      });
    }).catch(next);
  }

  static userLogin(req,res,next){
    if(!req.body.user.email){
      return res.status(422).json({errors: {email: "can't be blank"}});
    }
  
    if(!req.body.user.password){
      return res.status(422).json({errors: {password: "can't be blank"}});
    }
  
    passport.authenticate('local', {session: false}, function(err, user, info){
      if(err){ return next(err); }
  
      if(user){
        user.token = user.generateJWT();
        return res.json({user: user.toAuthJSON()});
      } else {
        return res.status(422).json(info);
      }
    })(req, res, next);
  }

  static userRegister(req,res,next){
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  }
}

module.exports = userController;
