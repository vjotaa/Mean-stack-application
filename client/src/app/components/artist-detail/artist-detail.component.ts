import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import {ArtistService} from '../../services/artist.service';
import {UploadService}from '../../services/upload.service';
import {AlbumService}from '../../services/album.service';
import {Album}from '../../models/album';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
  providers: [UserService,ArtistService,UploadService,AlbumService]
})
export class ArtistDetailComponent implements OnInit {
  public title :string;
  public artist :Artist;
  public identity;
  public token;
  public url :string;
  public alertMessage :string;
  public albums : Album[];
  public confirmation;


  constructor(

    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _ArtistService :ArtistService,
    private _albumService :AlbumService
  ) { 
    this.title = "editing Artist";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
  }

  ngOnInit() {
    this.getArtist(); 
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._ArtistService.getArtist(this.token,id).subscribe(
        response=>{
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;
            this._albumService.getAlbums(this.token,response.artist._id).subscribe(
            response =>{
              if(!response.albums){
                this.alertMessage = 'Thist Artist dont have any albums';
              }else{
                this.albums = response.albums;
              }
            },
              error =>{
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body);
                //this.alertMessage = body.message;
                console.log(error);
                } 
              }            
            );
          }
        },
        error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.log(error);
          } 
        }
      );
    });
  }


  onDeleteConfirm(id){
    this.confirmation = id;

  }
  onCancelAlbum(){
    this.confirmation = null;
  }

  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token,id).subscribe(
      response =>{
        if(!response.album){
          console.log("Error in the server");
        }else{
          this.getArtist();
        }

      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.log(error);
          } 
      }   
    );
  }
  

}
