import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import {ArtistService} from '../../services/artist.service';


@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css'],
  providers: [UserService,ArtistService]
})
export class AddArtistComponent implements OnInit {
  public title :string;
  public artist :Artist;
  public identity;
  public token;
  public url :string;
  public alertMessage :string;



  constructor(
    private _route :ActivatedRoute,
    private _router :Router,
    private _userService :UserService,
    private _ArtistService :ArtistService
  ) { 
    this.title = "Add Artist";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url= GLOBAL.url;
    this.artist = new Artist("","","");
  }

  ngOnInit() {
       
  }

  onSubmit(){
    console.log(this.artist);
    this._ArtistService.addArtist(this.token,this.artist).subscribe(
      response =>{
        this.artist = response.artist;
        if(!response.artist){
          this.alertMessage = 'Error in the server';
        }else{
          
          this.artist = response.artist;
          this.alertMessage = "The artist was created correctly";
          this._router.navigate(['/edit-artist',response.artist._id]);
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
  }

}
