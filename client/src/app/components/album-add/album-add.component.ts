import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import {Album} from '../../models/album';
import {ArtistService} from '../../services/artist.service';
import {AlbumService} from '../../services/album.service';


@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css'],
  providers: [UserService,ArtistService,AlbumService]
})
export class AlbumAddComponent implements OnInit {
  public title :string;
  public artist :Artist;
  public identity;
  public album :Album;
  public token;
  public url :string;
  public alertMessage :string;



  constructor(

    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _ArtistService :ArtistService,
    private _albumService :AlbumService

  ) { 
    this.title = "Create Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.album = new Album("","",2017,"","");
  }
  ngOnInit(){
    console.log("album add component load!")
  }
  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let artist_id = params['artist'];
      this.album.artist = artist_id;

      this._albumService.addAlbum(this.token,this.album).subscribe(
      response =>{
        if(!response.album){
          this.alertMessage = 'Error in the server';
        }else{
          
          this.alertMessage = "Artist was created successfully";
          this.album = response.album;
          this._router.navigate(['/edit-album',response.album._id]);
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
}