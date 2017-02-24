'user strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var artist = require('../models/artist');
var Album  = require('../models/album');
var Song  = require('../models/song');

function getSong(req,res){
  var songId = req.params.id;
  Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
    if(err){
      res.status(500).send({message: 'Error in the request'});
    }else{
      if(!song){
        res.status(404).send({message: "The song doesn't exist"});
      }else{
        res.status(200).send({song});
      }
    }
  });
  
}

function getSongs(req,res){
  var albumId = req.params.album;
  if(!albumId){
    var find = Song.find({}).sort('number');
  }else{
    var find = Song.find({album: albumId}).sort('number');
  }
  find.populate({
    path:'album',
    populate:{
      path:'artist',
      model:'Artist'
    }
  }).exec((err,songs)=>{
    if(err){
      res.status(500).send({message:'Error in the request'});
    }
    else{
      if(!songs){
        res.status(200).send({message:'No songs'});
      }else{
        res.status(200).send({songs});
      }
    }
  });
}

function saveSong(req,res){
  var song = new Song();
  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = null;
  song.album = params.album;

  song.save((err,songStored)=>{
    if(err){
      res.status(500).send({message: 'Error in the server'});
    }else{
      if(!songStored){
        res.status(404).send({message: 'the song can be saved'});
      }else{
        res.status(200).send({song: songStored});
      }
    }
  });

}

function updateSong(req,res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId,update,(err,songUpdated)=>{
    if(err){
      res.status(500).send({message:'error to save the song'});
    }else{
      if(!songUpdated){
        res.status(404).send({message:'The song can be updated'});
      }else{
        res.status(200).send({song: songUpdated});
      }
    }
  });
}

function deleteSong(req,res){
  var songId = req.params.id;

  Song.findByIdAndRemove(songId,(err,songRemoved)=>{
    if(err){
      res.status(500).send({message:'error in the request'});
    }else{
      if(!songRemoved){
        res.status(404).send({message:'The song can be eliminated'});
      }else{
        res.status(200).send({song: songRemoved});
      }
    }
  });
}

//upload images
function uploadFile(req,res){
  var songId = req.params.id;
  var file_name = "Image not upload";

  if(req.files){
    var file_path = req.files.file.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    //Comprobar si es una imagen
    var ext_file = file_name.split('.');
    var file_ext = ext_file[1];

    if(file_ext == 'mp3' || file_ext == 'ogg'){
      console.log(file_ext);
      Song.findByIdAndUpdate(songId, {file:file_name},(err,songUpdated)=>{
      if(!songUpdated){
        res.status(404).send({message:"The user cant be update"});
      }else{
        res.status(200).send({song: songUpdated});
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
function getSongFile(req,res){
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/'+songFile;
  fs.exists(path_file,(exists)=>{
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'the song not exist'});    
    }
  });
}



  
module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}