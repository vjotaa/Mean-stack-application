import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';


//Import User

import {UserEditComponent} from './components/user-edit/user-edit.component';
import {ArtistListComponent} from './components/artist-list/artist-list.component';
import {HomeComponent} from './components/home/home.component';
import {AddArtistComponent} from './components/add-artist/add-artist.component';
import {EditArtistComponent} from './components/edit-artist/edit-artist.component';
const appRoutes: Routes = [
  
  {path: '', component: HomeComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'create-artist', component: AddArtistComponent},
  {path: 'edit-artist/:id', component: EditArtistComponent},
  {path: '**', component: HomeComponent}
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
