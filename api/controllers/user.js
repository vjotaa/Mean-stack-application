'user strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


//TODO: MODIFICAR LAS TRADUCCIONES DE TODO.


// A simple test to know if the database is working correctly
function test(req,res){
  res.status(200).send({
    message: 'testing the action of the user controller with nodejs and mongodb'
    });
}
//Funcion para guardar el usuario
function saveUser(req,res){
  var user = new User();
  var params = req.body;

  console.log(params);
  
  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_ADMIN';
  user.image = 'null';

  if(params.password){
    bcrypt.hash(params.password,null,null, function(err,hash){
      user.password = hash;
      if(user.name !=null && user.surname != null && user.email != null ){
        // safe the user
        user.save((err,userStored)=>{
          if(err){
            res.status(500).send({message: 'error to safe'});
          }else{
            if(!userStored){
              res.status(404).send({message: 'The user can be registered'});
            }else{
              res.status(200).send({user: userStored});
            }
          }
        });
      }else{
        res.status(200).send({message: 'Introduce all the data'});
      }
    });

  }else{
    res.status(200).send({message: 'Introduce the password...'});
  }
}
// Login the user
function loginUser(req,res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err,user)=>{
    if(err){
      res.status(500).send({message:"Error in the petition"});
    }else{
      if(!user){
        res.status(404).send({message:"The user doesnt exist"});
      }else{
        bcrypt.compare(password,user.password, (err,check)=>{
          if(check){
            if(params.gethash){
              // Devolver token de jwt
              res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              res.status(200).send({user});
            }
          }else{
            res.status(404).send({message:"The user cant login in"});
          }
        });
      }
    }
  })
}

//Update the user already exist
function updateUser(req,res){
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId,update,(err,userUpdated)=>{
    if(err){
      res.status(500).send({message:"Error updating the user"});
    }else{
      if(!userUpdated){
        res.status(404).send({message:"The user cant be update"});
      }else{
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

//upload images
function uploadImage(req,res){
  var userId = req.params.id;
  var file_name = "Image not upload";

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    //Comprobar si es una imagen
    var ext_file = file_name.split('.');
    var file_ext = ext_file[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
      User.findByIdAndUpdate(userId, {image:file_name},(err,userUpdated)=>{
      if(!userUpdated){
        res.status(404).send({message:"The user cant be update"});
      }else{
        res.status(200).send({image: file_name, user: userUpdated});
      } 
      });
    }else{
       res.status(200).send({message: 'the image is not and extesion correctly'});
    }
    console.log(file_ext);
  }else{
    res.status(200).send({message: 'the image cant be upload'});
  }
}

//get images
function getImageFile(req,res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/'+imageFile;
  fs.exists(path_file,(exists)=>{
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'the image not exist'});    
    }
  });
}
module.exports = {
  test,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};