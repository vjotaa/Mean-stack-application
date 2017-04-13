import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {SongService} from '../../services/song.service';
import {Song} from '../../models/song';
@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css'],
  providers: [UserService,SongService]
})
export class SongAddComponent implements OnInit {
  public title :string;
  public song :Song;
  public identity;
  public token;
  public url :string;
  public alertMessage :string;



  constructor(

    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _songService :SongService

  ) { 
    this.title = "Create Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.song = new Song(1,'','','','');
  }
  ngOnInit() {
    console.log("Song add load!");
  }

  
  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let album_id = params['album'];
      this.song.album = album_id;
      console.log(this.song);

      this._songService.addSong(this.token,this.song).subscribe(
      response =>{
        if(!response.song){
          this.alertMessage = 'Error in the server';
        }else{
          
          this.alertMessage = "Song was created successfully";
          this.song = response.song;
          this._router.navigate(['/edit-song',response.song._id]);
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
