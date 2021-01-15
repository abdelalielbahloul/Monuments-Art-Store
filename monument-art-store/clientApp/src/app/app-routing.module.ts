import { AfterAuthGuard } from './guards/after-auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ArtsComponent } from './components/arts/arts.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/arts', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'arts', component: ArtsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AfterAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AfterAuthGuard] }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
