import { User } from './../../../models/user';
import { OnChanges, Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {

  @Output() modalUser = new EventEmitter();
  @Input() selectedUser: User = null

  hide = true;
  userForm = new FormGroup({
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
  selectedImage: File = null
  showPasswordStatus = false

  constructor() { }

  ngOnInit() {    
  }

  ngOnChanges(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(this.selectedUser !== null) {
      this.userForm.patchValue({
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        role: this.selectedUser.role
      })
      this.showPasswordStatus = true
    }
    this.showPasswordStatus = false
    
  }


  submitUser() {
    this.modalUser.emit(this.objectToFormData(this.userForm))
    this.userForm.reset()
    
  }



  imageFileChanged(event) {
    this.selectedImage = <File>event.target.files[0];
  }

  confirmGeneratePassword() {
      const swal = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-danger mr-3',
          cancelButton: 'btn btn-light'
        },
        buttonsStyling: false
      })
      swal.fire({
        title: 'Are you sure ?',
        text: 'You will not be able to recover user\'s password',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Generate',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.generatePassword()
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        }
      })
  }

  generatePassword() {
    let length = 8,
      charset = "abcdefghijklmnop!@#\$%\^&\*qrstuvwxyzABC234567DEFGHIJKLMNOPQRSTUVWXYZ0189!@#\$%\^&\*",
      retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    this.userForm.get('password').setValue(retVal)
  }

  objectToFormData(user: FormGroup): any {
   
    const fd = new FormData();
    fd.append('name', user.get('name').value)  
    fd.append('email', user.get('email').value)    
    fd.append('role', user.get('role').value)    
    if(user.get('password').value !== null)
      fd.append('password', user.get('password').value)   
    if(user.get('userImage').value !== null) 
      fd.append('userImage', this.selectedImage, this.selectedImage.name)    
    const persData = {
      formData: fd,
      _id: this.selectedUser !== null ? this.selectedUser._id : null
    }
    return persData;
  }


}
