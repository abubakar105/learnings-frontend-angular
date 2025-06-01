import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "./Fearure/shared/spinner/spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  title = 'learnings';
  constructor(
  ) {}
  
  ngOnInit(): void {
    // if (this.jwtTokenService.isTokenExpired()) {
    //   // If the token is expired, redirect to login
    //   this.router.navigate(['/login']);
    // }
  }
}
