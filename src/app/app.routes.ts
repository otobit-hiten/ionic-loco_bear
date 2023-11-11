import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./landing-screen/landing-screen.page').then( m => m.LandingScreenPage)
  },{
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'laser',
    loadComponent: () => import('./laser/laser.page').then( m => m.LaserPage),
  },
  {
    path: 'cricket',
    loadComponent: () => import('./cricket/cricket.page').then( m => m.CricketPage)
  },
  {
    path: 'shooting',
    loadComponent: () => import('./shooting/shooting.page').then( m => m.ShootingPage)
  },
  {
    path: '',
    loadComponent: () => import('./bowling/bowling.page').then( m => m.BowlingPage)
  },
  {
    path: 'landing-screen',
    loadComponent: () => import('./landing-screen/landing-screen.page').then( m => m.LandingScreenPage)
  },

];
