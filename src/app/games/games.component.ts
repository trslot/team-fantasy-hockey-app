import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../service/stats.service';
import { IGame } from '../shared/games-type';
import { ITeam } from '../shared/teams.type';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [MatCardModule, MatGridListModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements OnInit {
  games: IGame[] = [];
  today: string = new Date().toLocaleDateString('en-CA');

  teams: ITeam[] = [
    {
      // personName: "Jonah",
      nhlTeams: ["ANA", "BOS", "BUF", "DET", "TOR", "UTA", "VGK", "WSH"]
    },
    {
      // personName: "Isaiah",
      nhlTeams: ["CAR", "CGY", "DAL", "MIN", "NSH", "SEA", "SJS", "TBL"]
    },
    {
      // personName: "Mom",
      nhlTeams: ["CHI", "FLA", "LAK", "MTL", "NJD", "NYI", "NYR", "STL"]
    },
    {
      // personName: "Dad",
      nhlTeams: ["CBJ", "COL", "EDM", "OTT", "PHI", "PIT", "VAN", "WPG"]
    }
  ];

  constructor(private statsAPI: StatsService) { }

  ngOnInit(): void {
    this.statsAPI.getGames().subscribe((gameData: any) => {
      if (gameData && gameData.gameWeek.filter((x: any) => x.date === this.today).length > 0) {
        gameData.gameWeek.filter((x: any) => x.date === this.today)[0].games.forEach((game: any) => {
          this.games.push({
            homeTeam: game.homeTeam.logo,
            homeTeamAbbreviation: this.teams[0].nhlTeams.includes(game.homeTeam.abbrev) ? game.homeTeam.abbrev + " (J)" 
            : this.teams[1].nhlTeams.includes(game.homeTeam.abbrev) ? game.homeTeam.abbrev + " (I)" 
            : this.teams[2].nhlTeams.includes(game.homeTeam.abbrev) ? game.homeTeam.abbrev + " (M)" 
            : this.teams[3].nhlTeams.includes(game.homeTeam.abbrev) ? game.homeTeam.abbrev + " (D)"
            : game.homeTeam.abbrev,
            homeScore: game.homeTeam.score,
            awayTeam: game.awayTeam.logo,
            awayTeamAbbreviation: this.teams[0].nhlTeams.includes(game.awayTeam.abbrev) ? game.awayTeam.abbrev + " (J)" 
            : this.teams[1].nhlTeams.includes(game.awayTeam.abbrev) ? game.awayTeam.abbrev + " (I)" 
            : this.teams[2].nhlTeams.includes(game.awayTeam.abbrev) ? game.awayTeam.abbrev + " (M)" 
            : this.teams[3].nhlTeams.includes(game.awayTeam.abbrev) ? game.awayTeam.abbrev + " (D)" 
            : game.awayTeam.abbrev,
            awayScore: game.awayTeam.score,
            status: game.gameState,
            period: game.periodDescriptor.number,
            startTime: new Date(game.startTimeUTC).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'})
          })
        })
      }
    })
  }
}
