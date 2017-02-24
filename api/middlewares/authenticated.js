'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth =  function(req,res,next){
  if(!req.headers.authorization){
    return res.status(403).send({message:'The request dont have the header of authentication'});
  }
  var token = req.headers.authorization.replace(/['"]+/g,'');  
  try {
    var payload = jwt.decode(token,secret);
    if(payload.exp<=moment().unix()){
      res.status(401).send({message:'The token has expired'});
    }
  } catch (error) {
    //console.log(error);
    res.status(404).send({message:'The token is invalid'});
  }
  req.user = payload;

  next();
};