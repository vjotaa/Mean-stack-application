import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Musicfy';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(private _userService :UserService){
    this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){

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

          //Conseguir el token para enviarlo a cada peticion
          this._userService.signUp(this.user,'true').subscribe(response =>{
            let token = response.token;
            this.token = token;

            if(this.token.length <= 0){
              alert('El token no se ha generado');
            }else{
              //Crear elemento en el localstorafe para tenelo disponible
              console.log(token);
              console.log(identity);
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
}
