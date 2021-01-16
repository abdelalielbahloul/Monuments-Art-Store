import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm = new FormGroup({
    login: new FormControl(null, [
      Validators.required, 
      Validators.email,
      Validators.minLength(12)
    ]),
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,}).*$/)
    ])
  })

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService._login(this.loginForm.value).subscribe(res => {      
      this.handleToken(res)
      this.toastr.success("Congratulations you are logged in", "Welcome", { timeOut: 2000 })
      
    })
  }

  handleToken(response) {
    this.tokenService.handle(response);
    this.tokenService.changeStatus(true);
    this.router.navigateByUrl('/')
  }

}
