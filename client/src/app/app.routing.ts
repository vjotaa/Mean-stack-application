import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';


//Import User

import {UserEditComponent} from './components/user-edit.component';

const appRoutes: Routes = [
  {path: '', component: UserEditComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: '**', component: UserEditComponent}
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
