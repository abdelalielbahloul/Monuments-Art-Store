import { RegisterComponent } from './components/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListArtComponent } from './components/art/list-art/list-art.component';
import { AddArtComponent } from './components/art/add-art/add-art.component';
import { EditArtComponent } from './components/art/edit-art/edit-art.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: '/arts', pathMatch: 'full'},
  { path: 'arts', children: [
    { path: '', component: ListArtComponent },
    { path: 'create', component: AddArtComponent },
    { path: 'edit/:id', component: EditArtComponent }
  ]},
  { path: 'users', children: [
    { path: '', component: ListUserComponent },
    { path: 'create', component: AddUserComponent },
    { path: 'edit/:id', component: EditUserComponent }
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
