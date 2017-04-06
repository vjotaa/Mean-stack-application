import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import {GLOBAL} from './services/global';
import {Router,ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Musicfy';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url :string;


  constructor(
    private _userService :UserService,
    private _route :ActivatedRoute,
    private _router :Router
    
    )
      {
        this.user = new User('','','','','','ROLE_USER','');
        this.user_register = new User('','','','','','ROLE_USER','',);
        this.url = GLOBAL.url;
      }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();


  }


  onSubmit(){
    console.log(this.user);
    //Conseguir los datos del usuario
    this._userService.signUp(this.user).subscribe(
      response =>{
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert('The user can be identificated');
        }else{
          //Crear elemento en el storage
          localStorage.setItem('identity',JSON.stringify(identity));

          //Conseguir el token para enviarlo a cada peticion
          this._userService.signUp(this.user,'true').subscribe(response =>{
            let token = response.token;
            this.token = token;

            if(this.token.length <= 0){
              alert('El token no se ha generado');
            }else{
              localStorage.setItem('token',token);
              this.user = new User('','','','','','ROLE_USER','');
            }

          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.errorMessage= body.message;
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
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }




  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/'])
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;
        if(!user._id){
          this.alertRegister = "Error al registrarse";
        }else{
          this.alertRegister = "Registro correctamente, identificate con tu correo";
          this.user_register = new User('','','','','','ROLE_USER','',);
      }
      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }        
      }
    );
  }
}
