import {Component,OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.html',
  providers: [UserService]  
})

export class UserEditComponent implements OnInit{
  public title :string;
  public user :User;
  public identity;
  public token;
  public alertMessage
  public url:string;
  
  constructor(private _userService :UserService){
    this.title = "Update my profile";
    //LocalStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
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
            localStorage.setItem('identity', JSON.stringify(this.user));
            document.getElementById("identity-name").innerHTML = this.user.name;
         
          if(!this.filesToUpload){
            
          }else{
            this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload).then(
              (result:any)=>{
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));
               
                let image_path = this.url + 'get-image-user/'+this.user.image;
                document.getElementById('image-logged').setAttribute('src',image_path)
              }
            );
          }
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
    var token = this.token;
    return new Promise(function(resolve,reject){
      var formData:any = new FormData();
      var xhr = new XMLHttpRequest();
      for(var i = 0; i<files.length; i++){
        formData.append('image',files[i],files[i].name);

      }
      xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
          if(xhr.status==200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      }
      xhr.open('POST',url,true);
      xhr.setRequestHeader('Authorization',token);
      xhr.send(formData);
    });
  }
}
