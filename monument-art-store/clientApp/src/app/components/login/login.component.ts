import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService._login(this.loginForm.value).subscribe(res => {
      console.log(res);
      this.toastr.success("Congratulations you are logged in", "Success", { timeOut: 3000 })
      
    }, (err: any) => {
      this.toastr.error(err.error.msg, err.statusText, { timeOut: 3000 })
      
    })
  }

}
