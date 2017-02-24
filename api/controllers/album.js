'user strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var artist = require('../models/artist');
var Album  = require('../models/album');
var Song  = require('../models/song');

//get album
function getAlbum(req,res){
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
    if(err){
      res.status(500).send({message: 'Error in the request'});
  
    }else{
      if(!album){
        res.status(404).send({message: 'The album not exist'});
      }else{
        res.status(200).send({album});
  
      }
    }
  });
  
}

function saveAlbum(req,res){
  var album = new Album();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err,albumStored)=>{
    if(err){
      res.status(500).send({message:'Error to save the album'});
    }else{
      if(!albumStored){
        res.status(400).send({message:'The album can be save'});
      }else{
        res.status(200).send({album: albumStored});
      }

    }
  })
}

//get albums

function getAlbums(req,res){
  var artistId = req.params.artist;
  if(!artistId){
    // drop all the albums of the database
    var find = Album.find({}).sort('title');
    
  }else{
    // drop all the albums of the artist
    var find = Album.find({artist: artistId}).sort('year');
  }
  find.populate({path:'artist'}).exec((err,albums)=>{
    if(err){
      res.status(500).send({message:'Error in the request'});
    }else{
      if(!albums){
        res.status(404).send({message:'Not at all albums'});
      }else{
        res.status(200).send({albums});
      }
    }
  });
}


function updateAlbum(req,res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId,update,(err,albumUpdated)=>{
    if(err){
      res.status(500).send({message:'error to save the album'});
    }else{
      if(!albumUpdated){
        res.status(404).send({message:'The album can be updated'});
      }else{
        res.status(200).send({album: albumUpdated});
      }
    }
  });
}
function deleteAlbum(req,res){
  var albumId = req.params.id;
  Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
    if(err){
      res.status(500).send({message:'error to try the eliminate the album'});
    }else{
      if(!albumRemoved){
        res.status(404).send({message:'The album can be eliminated'});
      }else{
        Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
          if(err){
            res.status(500).send({message:'error to try the eliminate the song'});
          }else{
            if(!songRemoved){
              res.status(404).send({message:'The song can be eliminated'});
            }else{
              res.status(200).send({album: albumRemoved});
              }
            }
          });
        }
      }
    });
  }

//upload images
function uploadImage(req,res){
  var albumId = req.params.id;
  var file_name = "Image not upload";

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    //Comprobar si es una imagen
    var ext_file = file_name.split('.');
    var file_ext = ext_file[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
      Album.findByIdAndUpdate(albumId, {image:file_name},(err,albumUpdated)=>{
      if(!albumUpdated){
        res.status(404).send({message:"The user cant be update"});
      }else{
        res.status(200).send({album: albumUpdated});
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
  var path_file = './uploads/albums/'+imageFile;
  fs.exists(path_file,(exists)=>{
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'the image not exist'});    
    }
  });
}


module.exports ={
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};