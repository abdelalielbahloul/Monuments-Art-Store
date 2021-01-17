import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

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
    role: new FormControl(2, Validators.required),
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,}).*$/)
    ]),
    userImage: new FormControl(null)
  })
  // updateForm = new FormGroup({
  //   name: new FormControl(null, Validators.minLength(3)),
  //   email: new FormControl(null, [
  //     Validators.email,
  //     Validators.minLength(12)
  //   ]),
  //   role: new FormControl(2),
  //   password: new FormControl(null, [
  //     Validators.minLength(8), 
  //     Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,}).*$/)
  //   ]),
  //   userImage: new FormControl(null)
  // })

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
    this.userService._create(this.objectToFormData(this.createForm)).subscribe( event => {
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

  deleteUser(_id: string) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger mr-3',
        cancelButton: 'btn btn-light'
      },
      buttonsStyling: false
    })
    swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.userService._delete(_id).subscribe(res => {
          // refresh users list
          this.users = this.users.filter(user => user._id !== _id)
          this.toastr.success('User has been deleted Successfully!', 'OK', { timeOut: 3000 })
        }, err => {
          console.dir(err)
          this.toastr.error('An error has occured while deleting this user', 'Error', { timeOut: 3000 })
        })
        
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
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

  objectToFormData(user: FormGroup): FormData {
    const fd = new FormData();
    fd.append('name', user.get('name').value)  
    fd.append('email', user.get('email').value)    
    fd.append('role', user.get('role').value)    
    fd.append('password', user.get('password').value)   
    if(user.get('userImage').value !== null) 
      fd.append('userImage', this.selectedImage, this.selectedImage.name)    
    return fd;
  }


}
