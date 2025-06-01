import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLayoutComponent } from "../User/user-layout/user-layout.component";
import { UserNavbarComponent } from "./user-navbar/user-navbar.component";
import { UserSidebarComponent } from "./user-sidebar/user-sidebar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, UserNavbarComponent, UserSidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
