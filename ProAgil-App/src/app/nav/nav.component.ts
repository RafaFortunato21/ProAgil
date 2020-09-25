import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  

  constructor(
    private toastr: ToastrService
  , public  authService: AuthService
  , public router: Router) { }

    user: any ;


  ngOnInit() {
    this.showMenu();
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this.toastr.show('Log Out');
    this.router.navigate(['/user/login']);
  }

  entrar(){
    this.router.navigate(['/user/login']);
  }

  userName(){
    return sessionStorage.getItem("username");
  }

  showMenu(){
    return this.router.url !== '/user/login';
  }

}
