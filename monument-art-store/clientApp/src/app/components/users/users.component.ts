import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = []
  selectedUser = null

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
      this.toastr.error(err.error.error !== undefined ? err.error.error : err.message, 'Error', { timeOut: 3000})
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
          // refresh users list after deleting
          this.users = this.users.filter(user => user._id !== _id)
          this.toastr.success('User has been deleted Successfully!', 'OK', { timeOut: 3000 })
        }, err => {
          console.dir(err)
        })
        
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
    })
    
  }

  persistUserData(data: any) {
    data._id !== null ? this.updateUser(data.formData, data._id) : this.createUser(data.formData)
    
  }

  updateUser(user: FormData, userId) {
    this.userService._update(user, userId).subscribe(() => {
      this.getAll()
      this.toastr.success('User updated Successfully!', 'Updated', { timeOut: 3000 })
    }, err => {
      console.dir(err)
      this.toastr.error(err.error.error, err.statusText, { timeOut: 4000 })
    })
  }

  createUser(user: FormData) {
    this.userService._create(user).subscribe( (res: User) => {
      this.getAll()
      this.toastr.success('User created Successfully!', 'Created', { timeOut: 3000 })
    }, err => {
      console.dir(err)
      this.toastr.error(err.error.error, err.statusText, { timeOut: 4000 })
    })
  }
  

}
