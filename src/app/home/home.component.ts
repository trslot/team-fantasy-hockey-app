import { Component } from '@angular/core';
import { FantasyTeamsComponent } from '../fantasy-teams/fantasy-teams.component';
import { GamesComponent } from '../games/games.component';
import { PlayersComponent } from '../players/players.component';
import { TeamsComponent } from '../teams/teams.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FantasyTeamsComponent, GamesComponent, PlayersComponent, TeamsComponent, MatTabsModule, MatButtonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }
}