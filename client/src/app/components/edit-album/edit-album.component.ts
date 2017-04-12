import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import {Album} from '../../models/album';
import {AlbumService} from '../../services/album.service';
import {UploadService} from '../../services/upload.service';

@Component({
  selector: 'app-edit-album',
  templateUrl: '../album-add/album-add.component.html',
  styleUrls: ['./edit-album.component.css'],
  providers: [UserService,AlbumService,UploadService]
})
export class EditAlbumComponent implements OnInit {
  public title :string;
  public identity;
  public album :Album;
  public token;
  public url :string;
  public alertMessage :string;
  public is_edit;
  public filesToUpload: Array<File>;


  constructor(

    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _uploadService : UploadService,
    private _albumService :AlbumService

  ) { 
    this.title = "Update Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.album = new Album('','',2017,'','');
    this.is_edit = true;
  }
  ngOnInit(){
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._albumService.getAlbum(this.token,id).subscribe(
       response =>{
        if(!response.album){
          this._router.navigate(['/'])
        }else{
          this.album = response.album;
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
  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];

      this._albumService.editAlbum(this.token,id,this.album).subscribe(
      response =>{
        if(!response.album){
          this.alertMessage = 'Error in the server';
        }else{
          
          this.alertMessage = "Artist was updated successfully";
          if(!this.filesToUpload){
            this._router.navigate(['/artist-information',response.album.artist]);
          }else{
            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id,[],this.filesToUpload,this.token,'image').then(
              (result)=>{
                this._router.navigate(['/artist-information',response.album.artist]);
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

  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}