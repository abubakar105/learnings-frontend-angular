import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLayoutComponent } from "../User/user-layout/user-layout.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserLayoutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
