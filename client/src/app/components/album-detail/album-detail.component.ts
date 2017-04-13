import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {AlbumService} from '../../services/album.service';
import {SongService} from '../../services/song.service';
import {Album} from '../../models/album';
import {UserService} from '../../services/user.service';
import {Song} from '../../models/song';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
  providers: [AlbumService,UserService,SongService]
})
export class AlbumDetailComponent implements OnInit {
  public title:string;
  public songs :Song[];
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
    private _userService: UserService,
    private _songService: SongService
  ) {
    this.title = "Album detail";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
   }

  ngOnInit() {
    this.getAlbum(); 
  }

  getAlbum(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._AlbumService.getAlbum(this.token,id).subscribe(
        response=>{
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;
            
            this._songService.getSongs(this.token,response.album._id).subscribe(
            response =>{
              if(!response.songs){
                this.alertMessage = 'This album dont have any songs';
              }else{
                this.songs = response.songs;
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
  onCancelSong(){
    this.confirmation = null;
  }
  onDeleteSong(id){
    this._songService.deleteSong(this.token,id).subscribe(
      response=>{
        if(!response.song){
          console.log("error in the server");

        }else{
          this.getAlbum();
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


  startPlayer(song){
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-song-file/'+ song.file;
    let image_path = this.url + 'get-image-album/'+song.album.image;

    localStorage.setItem('sound_song',song_player);
    document.getElementById("mp3-source").setAttribute("src",file_path);
    (document.getElementById("player") as any).load();
    (document.getElementById("player") as any).play();

    document.getElementById("play-song-title").innerHTML = song.name + ' - ';
    document.getElementById("play-song-artist").innerHTML = song.album.artist.name;
    document.getElementById("play-image-album").setAttribute("src",image_path);
     
  }

}
