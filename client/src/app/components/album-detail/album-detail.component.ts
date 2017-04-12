import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {AlbumService} from '../../services/album.service';
import {Album} from '../../models/album';
import {UserService} from '../../services/user.service';
@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
  providers: [AlbumService]
})
export class AlbumDetailComponent implements OnInit {
  public title:string;
  public album =Album;
  public identity;
  public token;
  public url:string;
  public alertMessage:string;
  public confirmation;
  constructor(
    private _route :ActivatedRoute,
    private _router :Router,
    private _AlbumService: AlbumService,
    private _userService: UserService

  ) {
    this.title = "Album detail";
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
      this._AlbumService.getAlbum(this.token,id).subscribe(
        response=>{
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;
            /*
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
            );*/
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
}
