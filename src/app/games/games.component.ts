import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../service/stats.service';
import { IGame } from '../shared/games-type';
import { ITeam } from '../shared/teams.type';
import { getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [MatCardModule, MatGridListModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements OnInit {
  config = {
    apiKey: environment.firebase.apiKey,
    authDomain: environment.firebase.authDomain,
    projectId: environment.firebase.projectId,
    storageBucket: environment.firebase.storageBucket,
    messagingSenderId: environment.firebase.messagingSenderId,
    appId: environment.firebase.appId,
    measurementId: environment.firebase.measurementId
  }

  db = getFirestore();

  year: string = "";
  games: IGame[] = [];
  today: string = new Date().toLocaleDateString('en-CA');

  teams: ITeam[] = [

  ];


  constructor(private statsAPI: StatsService) { }

  async ngOnInit(): Promise<void> {
    // 1️⃣ Get season first
    this.statsAPI.getSeason().subscribe(async (season: any) => {
      this.year = String(season.at(-1)).substring(0, 4);

      // 2️⃣ Wait for Firestore teams to load
      await this.getTeams();

      // 3️⃣ Once teams are loaded, now get the games
      this.statsAPI.getGames().subscribe((gameData: any) => {
        const todayGames = gameData?.gameWeek?.find((x: any) => x.date === this.today)?.games || [];
        this.games = todayGames.map((game: any) => ({
          homeTeam: game.homeTeam.logo,
          homeTeamAbbreviation: this.getAbbrev(game.homeTeam.abbrev),
          homeScore: game.homeTeam.score,
          awayTeam: game.awayTeam.logo,
          awayTeamAbbreviation: this.getAbbrev(game.awayTeam.abbrev),
          awayScore: game.awayTeam.score,
          status: game.gameState,
          period: game.periodDescriptor.number,
          startTime: new Date(game.startTimeUTC).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
        }));
      });
    });
  }

  // Helper function to make code cleaner
  getAbbrev(abbrev: string): string {
    if (this.teams[0].nhlTeams.includes(abbrev)) return abbrev + " (J)";
    if (this.teams[1].nhlTeams.includes(abbrev)) return abbrev + " (I)";
    if (this.teams[2].nhlTeams.includes(abbrev)) return abbrev + " (M)";
    if (this.teams[3].nhlTeams.includes(abbrev)) return abbrev + " (D)";
    return abbrev;
  }

  async getTeams() {
    const docRef = doc(this.db, "teams", this.year);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      this.teams = [
        { nhlTeams: data['jonah'] || [] },
        { nhlTeams: data['isaiah'] || [] },
        { nhlTeams: data['mom'] || [] },
        { nhlTeams: data['dad'] || [] }
      ];
    } else {
      console.log("No teams document found!");
    }
  }

}
