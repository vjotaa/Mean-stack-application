import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {SongService} from '../../services/song.service';
import {Song} from '../../models/song';
@Component({
  selector: 'app-song-edit',
  templateUrl: '../song-add/song-add.component.html',
  styleUrls: ['./song-edit.component.css'],
  providers: [UserService,SongService,UploadService]
})
export class SongEditComponent implements OnInit {
  public title :string;
  public song :Song;
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
    private _songService :SongService,
    private _uploadService :UploadService

  ) { 
    this.title = "Update Song";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.song = new Song(1,'','','','');
    this.is_edit = true;
  }
  ngOnInit() {
    console.log("Song edit");
    this.getSong();
  }

  getSong(){
   this._route.params.forEach((params: Params)=>{
    let id = params['id'];
    this._songService.getSong(this.token,id).subscribe(
      response =>{
        if(!response.song){
          this._router.navigate(['/']);
        }else{
          this.song = response.song;

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
      

      this._songService.editSong(this.token,id,this.song).subscribe(
      response =>{
        if(!response.song){
          this.alertMessage = 'Error in the server';
        }else{
          
          this.alertMessage = "Song was updated successfully";
          if(!this.filesToUpload){
            this._router.navigate(['/album',response.song.album]);
          }else{
            
              this._uploadService.makeFileRequest(this.url+'upload-song-file/'+id,[],this.filesToUpload,this.token,'file').then(
              (result)=>{
                this._router.navigate(['/album',response.song.album]);
                console.log(this.song);
                
              },
              (error)=>{
                console.log(error);
              }
            );
          }
          //this._router.navigate(['/edit-album',response.album._id]);
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
