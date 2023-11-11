import { GamePage } from './game/game.page';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game/:gameName',
    loadComponent: () => import('./landing-screen/landing-screen.page').then( m => m.LandingScreenPage)
  },{
    path: '',
    loadComponent: () => import('./game/game.page').then( m => m.GamePage)
  },
  {
    path: 'laser',
    loadComponent: () => import('./laser/laser.page').then( m => m.LaserPage),
  }

];
