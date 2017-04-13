import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {ArtistListComponent} from './components/artist-list/artist-list.component';
import {HomeComponent} from './components/home/home.component';
import {AddArtistComponent} from './components/add-artist/add-artist.component';
import {EditArtistComponent} from './components/edit-artist/edit-artist.component';
import {ArtistDetailComponent} from './components/artist-detail/artist-detail.component';
import {AlbumAddComponent} from './components/album-add/album-add.component';
import {EditAlbumComponent} from './components/edit-album/edit-album.component';
import {AlbumDetailComponent} from './components/album-detail/album-detail.component';
import {SongAddComponent} from './components/song-add/song-add.component';
import {SongEditComponent} from './components/song-edit/song-edit.component';
const appRoutes: Routes = [
  
  {path: '', component: HomeComponent},
  {path: 'my-profile', component: UserEditComponent},
  {path: 'create-artist', component: AddArtistComponent},
  {path: 'artists/:page', component: ArtistListComponent},
  {path: 'edit-artist/:id', component: EditArtistComponent},
  {path: 'artist-information/:id', component: ArtistDetailComponent},
  {path: 'create-album/:artist', component: AlbumAddComponent},
  {path: 'edit-album/:id', component: EditAlbumComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'create-song/:album', component: SongAddComponent},
  { path: 'edit-song/:id', component: SongEditComponent },
  {path: '**', component: HomeComponent},

]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
