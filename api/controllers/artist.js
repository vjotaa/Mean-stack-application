'user strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist  = require('../models/artist');
var Album  = require('../models/album');
var Song  = require('../models/song');

//get artist
function getArtist(req,res){
  var artistId = req.params.id;
  Artist.findById(artistId,(err,artist)=>{
    if(err){
      res.status(500).send({message:'Error in the jasd'});
    }else{
      if(!artist){
        res.status(200).send({message:'The artist doesnt exist'});
      }else{
        res.status(200).send({artist});
      }
    }
  })
  
}

function saveArtist(req,res){
  var artist = new Artist();
  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';
  artist.save((err,artistStored)=>{
    if(err){
      res.status(500).send({message:'Error to save the artist'});
    }else{
      if(!artistStored){
        res.status(400).send({message:'The artist can be save'});
      }else{
        res.status(200).send({artist: artistStored});
      }

    }
  })
}

//get all the artist

function getArtists(req,res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1
  }
  var itemsPerPage = 4;

  Artist.find().sort('name').paginate(page,itemsPerPage, (err,artists,total)=>{
    if(err){
      res.status(500).send({message:'error in the petition'});
    }else{
      if(!artists){
        res.status(404).send({message:'the artits is empty'});
      }else{
        return res.status(200).send({
          total_items: total,
          artists: artists
        })
      }
    }
  })

}

// update artist

function updateArtist(req,res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId,update,(err,artistUpdated)=>{
    if(err){
      res.status(500).send({message:'error to save the artist'});
    }else{
      if(!artistUpdated){
        res.status(404).send({message:'The artist can be updated'});
      }else{
        res.status(200).send({artist: artistUpdated});
      }
    }
  });
}

function deleteArtist(req,res){
  var artistId = req.params.id;
  Artist.findByIdAndRemove(artistId,(err,artistRemoved)=>{
    if(err){
      res.status(404).send({message:'The artist can be updated'});
    }else{
      if(!artistRemoved){
        res.status(404).send({message:'The artist can be eliminated'});
      }else{
        Album.find({artist: artistRemoved._id}).remove((err,albumRemoved)=>{
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
                  res.status(200).send({artist: artistRemoved});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

// upload images

function uploadImage(req,res){
  var artistId = req.params.id;
  var file_name = "Image not upload";

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    //Comprobar si es una imagen
    var ext_file = file_name.split('.');
    var file_ext = ext_file[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
      Artist.findByIdAndUpdate(artistId, {image:file_name},(err,artistUpdated)=>{
      if(!artistUpdated){
        res.status(404).send({message:"The artist cant be update"});
      }else{
        res.status(200).send({artist: artistUpdated});
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
  var path_file = './uploads/artists/'+imageFile;
  fs.exists(path_file,(exists)=>{
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'the image not exist'});    
    }
  });
}



module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
}
