import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FantasyTeamsComponent } from './fantasy-teams/fantasy-teams.component';
import { GamesComponent } from './games/games.component';
import { PlayersComponent } from './players/players.component';
import { TeamsComponent } from "./teams/teams.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Team Fantasy Hockey App';
}
