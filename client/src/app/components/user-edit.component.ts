import {Component,OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]  
})

export class UserEditComponent implements OnInit{
  public title :string;
  public user :User;
  public identity;
  public token;
  public alertMessage
  
  constructor(private _userService :UserService){
    this.title = "Update my profile";
    //LocalStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
  }

  ngOnInit(){

    console.log('User-edit.component.ts cargado');
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      response =>{
        if(!response.user){
          this.alertMessage = 'El usuario no se ha actualizado';
        }else{
          //this.user = response.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById("identity-name").innerHTML = this.user.name;
          this.alertMessage = 'El usuario se ha actualizado';
        }
      },
      error =>{
        var alertMessage = <any>error;
        if(alertMessage != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
        }
      }
    );
  }
  public filesToUpload :Array<File>;


  fileChangeEvent(fileInput :any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url:string,params: Array<string>, files: Array<File>){
    
  }
}
