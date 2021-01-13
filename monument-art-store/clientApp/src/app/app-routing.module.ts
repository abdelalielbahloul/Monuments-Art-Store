import { RegisterComponent } from './components/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ArtsComponent } from './components/arts/arts.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {path: '', redirectTo: '/arts', pathMatch: 'full'},
  { path: 'arts', component: ArtsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
