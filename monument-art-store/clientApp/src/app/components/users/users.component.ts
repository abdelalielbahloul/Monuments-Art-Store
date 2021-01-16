import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  hide = true;
  createForm = new FormGroup({
    name: new FormControl(null, [
      Validators.required, 
      Validators.minLength(3)
    ]),
    email: new FormControl(null, [
      Validators.required, 
      Validators.email,
      Validators.minLength(12)
    ]),
    role: new FormControl(2, [
      Validators.required
    ]),
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,}).*$/)
    ]),
    userImage: new FormControl(null)
  })

  users: User[] = []
  selectedImage: File = null
  loading = false
  progress = 0

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.userService._fetch().subscribe(res => {
      this.users = res
    }, err => {
      console.dir(err)
      this.toastr.error('An error has occured while fetching data', 'Error', { timeOut: 3000})
    })
  }


  createUser() {
    this.loading = true;
    const fd = new FormData();
    fd.append('name', this.createForm.get('name').value)  
    fd.append('email', this.createForm.get('email').value)    
    fd.append('role', this.createForm.get('role').value)    
    fd.append('password', this.createForm.get('password').value)   
    if(this.createForm.get('userImage').value !== null) 
      fd.append('userImage', this.selectedImage, this.selectedImage.name)    
    
    this.userService._create(fd).subscribe( event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round((100 * event.loaded)/ event.total)     
        
      this.loading = false
      this.reset()
      this.getAll()
      this.toastr.success('User created Successfully!', 'Created', { timeOut: 3000})
    }, err => {
      console.dir(err)
      this.toastr.error('An error has occured while creating', 'Error', { timeOut: 3000})
    })
    
  }

  imageFileChanged(event) {
    this.selectedImage = <File>event.target.files[0];
  }



  generatePassword() {
    let length = 8,
        charset = "abcdefghijklmnop!@#\$%\^&\*qrstuvwxyzABC234567DEFGHIJKLMNOPQRSTUVWXYZ0189!@#\$%\^&\*",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    this.createForm.get('password').setValue(retVal)

  }


  reset() {
    this.createForm.reset()
  }


}
