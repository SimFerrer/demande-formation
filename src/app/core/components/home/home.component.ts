import { Component, NgZone, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{
  user$: Observable<firebase.User | null>= this.authService.user$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private titleService : Title
    ) { }


  ngOnInit(): void {
    this.titleService.setTitle('Apsiformation - Bienvenue')
  }

  /**
   * Redirect to trainings list page
   */
   getTrainings(): void {
    this.router.navigateByUrl('/training/list');
  }

  /**
   * redirect to form training page
   */
  createTraining(): void {
    this.router.navigateByUrl('/training/create');
  }

  /**
   * Redirect to profile page
   */
  goBackToProfile() {
    this.router.navigateByUrl('/profile');
  }

}
