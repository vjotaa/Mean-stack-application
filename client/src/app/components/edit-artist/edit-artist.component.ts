import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import {ArtistService} from '../../services/artist.service';
import {UploadService}from '../../services/upload.service';

@Component({
  selector: 'app-edit-artist',
  templateUrl: '../add-artist/add-artist.component.html',
  styleUrls: ['./edit-artist.component.css'],
  providers: [UserService,ArtistService,UploadService]
})
export class EditArtistComponent implements OnInit {
  public title :string;
  public artist :Artist;
  public identity;
  public token;
  public url :string;
  public alertMessage :string;
  public is_edit;
  public filesToUpload: Array<File>;



  constructor(

    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _ArtistService :ArtistService,
    private _UploadService :UploadService

  ) { 
    this.title = "editing Artist";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.artist = new Artist("","","");
    this.is_edit = true;
  
  }

  ngOnInit() {
    this.getArtist(); 
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._ArtistService.getArtist(this.token,id).subscribe(
        response=>{
          this.artist = response.artist;
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;
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
  onSubmit(){
    console.log(this.artist);
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._ArtistService.editArtist(this.token,id,this.artist).subscribe(
        response =>{
          this.artist = response.artist;
          if(!response.artist){
            this.alertMessage = 'Error in the server';
          }else{
            this.alertMessage = 'The artist was updated correctly';
            if(!this.filesToUpload){
              this._router.navigate(['artist-information',response.artist._id]);
            }else{
              this._UploadService.makeFileRequest(this.url+'upload-image-artist/'+id,[],this.filesToUpload,this.token,'image').then(
                (result)=>{
                  this._router.navigate(['artist-information',response.artist._id]);
                },
                (error)=>{
                  console.log(error);
                }
              );   
            }
          }
        },
        error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.alertMessage = body.message;
            console.log(error);
          }        
        }
      );
    });
  }

  fileChangeEvent(fileInput :any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  

}
