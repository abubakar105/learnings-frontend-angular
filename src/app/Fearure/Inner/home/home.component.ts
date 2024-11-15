import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.http.get('https://localhost:7195/api/User')
      .subscribe(
        (response) => {
          console.log('API Response:', response);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
  }
}
