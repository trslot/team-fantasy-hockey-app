import { Component, OnInit } from '@angular/core';
import { StatsService } from '../service/stats.service';
import { PlayerData } from '../shared/player-data.type';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PlayerSearch } from '../shared/player-search.type';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin } from 'rxjs';

import { environment } from '../../environment/environment';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";


@Component({
  selector: 'app-players',
  standalone: true,
  imports: [MatCardModule, MatTooltipModule, MatButtonModule, MatInputModule, MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
})
export class PlayersComponent implements OnInit {
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

  myControl = new FormControl<string | PlayerSearch>('');
  options: PlayerSearch[] = [];
  filteredOptions: Observable<PlayerSearch[]> | undefined;
  currentSeason: number = 0;
  players: PlayerData[] = [];
  playerIds: any[] = [
    // //Joe Veleno
    // 8480813,
    // //Alex Ovechkin
    // 8471214,
    // //Wayne Gretzky
    // 8447400,
    // //Connor McDavid
    // 8478402
  ];

  allPlayers: PlayerSearch[] = [];

  assistDiff: number = 0;
  pointDiff: number = 0;
  selectedPlayer: string = "";

  constructor(private statsAPI: StatsService) { }

  ngOnInit(): void {
    this.getDB()
  }

  async getDB() {
    const docRef = doc(this.db, "players", "id");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.playerIds.push(docSnap.data());
      this.getPlayerInfo();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    // this.setPlayers()
  }

  displayFn(player: PlayerSearch): string {
    return player && player.name ? player.name : '';
  }

  private _filter(name: string): PlayerSearch[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async setPlayers() {
    const docRef = doc(this.db, "players", "id");

    await updateDoc(docRef, {
      "0": this.playerIds[0][0]
    });
  }

  getPlayerInfo() {
    this.playerIds[0][0].forEach((id: any) => {
      this.statsAPI.getPlayerStats(id).subscribe((stats: any) => {
        if (stats) {
          console.log(stats)
          if (stats.position !== "G") {
            this.players.push({
              id: stats.playerId,
              firstName: stats.firstName.default,
              lastName: stats.lastName.default,
              position: stats.position,
              imageUrl: stats.headshot,
              careerGoals: stats.careerTotals.regularSeason.goals,
              careerAssists: stats.careerTotals.regularSeason.assists,
              careerPoints: stats.careerTotals.regularSeason.points,
              currentSeasonGoals: stats.seasonTotals[stats.seasonTotals.length - 1].goals,
              currentSeasonAssists: stats.seasonTotals[stats.seasonTotals.length - 1].assists,
              currentSeasonPoints: stats.seasonTotals[stats.seasonTotals.length - 1].points,
              careerWins: 0,
              careerLosses: 0,
              careerOvertimeLosses: 0,
              currentSeasonWins: 0,
              currentSeasonLosses: 0,
              currentSeasonOvertimeLosses: 0
            });
          } else {
            this.players.push({
              id: stats.playerId,
              firstName: stats.firstName.default,
              lastName: stats.lastName.default,
              position: stats.position,
              imageUrl: stats.headshot,
              careerGoals: 0,
              careerAssists: 0,
              careerPoints: 0,
              currentSeasonGoals: 0,
              currentSeasonAssists: 0,
              currentSeasonPoints: 0,
              careerWins: stats.careerTotals.regularSeason.wins,
              careerLosses: stats.careerTotals.regularSeason.losses,
              careerOvertimeLosses: stats.careerTotals.regularSeason.otLosses,
              currentSeasonWins: stats.seasonTotals[stats.seasonTotals.length - 1].wins,
              currentSeasonLosses: stats.seasonTotals[stats.seasonTotals.length - 1].losses,
              currentSeasonOvertimeLosses: stats.seasonTotals[stats.seasonTotals.length - 1].otLosses
            });
          }
        }
      });
    });

    this.statsAPI.getStats().subscribe((data: any) => {
      if (data) {
        const rosterObservables = data.standings.map((stats: any) =>
          this.statsAPI.getRosters(stats.teamAbbrev.default)
        );

        // Wait for all roster observables to complete
        forkJoin<any[]>(rosterObservables).subscribe((rosters: any[]) => {
          rosters.forEach((roster: any) => {
            if (roster) {
              [...roster.forwards, ...roster.defensemen, ...roster.goalies].forEach((playerRole: any) => {
                this.allPlayers.push({
                  id: playerRole.id,
                  name: `${playerRole.firstName.default} ${playerRole.lastName.default}`
                });
              });
            }
          });

          this.allPlayers.sort((a, b) => {
            const aLast = a.name.split(' ').slice(-1)[0].toLowerCase();
            const bLast = b.name.split(' ').slice(-1)[0].toLowerCase();
            return aLast.localeCompare(bLast);
          });

          this.options = this.allPlayers;

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filter(name as string) : this.options.slice();
            }),
          );
        });
      }
    });
  }

  addPlayer(id: PlayerSearch) {
    this.playerIds[0][0].push(id.id);
    this.setPlayers();

    // Get player stats immediately and update UI
    this.statsAPI.getPlayerStats(id.id).subscribe((stats: any) => {
      if (stats) {
        if (stats.position !== "G") {
          this.players.push({
            id: id.id,
            firstName: stats.firstName.default,
            lastName: stats.lastName.default,
            position: stats.position,
            imageUrl: stats.headshot,
            careerGoals: stats.careerTotals.regularSeason.goals,
            careerAssists: stats.careerTotals.regularSeason.assists,
            careerPoints: stats.careerTotals.regularSeason.points,
            currentSeasonGoals: stats.seasonTotals[stats.seasonTotals.length - 1].goals,
            currentSeasonAssists: stats.seasonTotals[stats.seasonTotals.length - 1].assists,
            currentSeasonPoints: stats.seasonTotals[stats.seasonTotals.length - 1].points,
            careerWins: 0,
            careerLosses: 0,
            careerOvertimeLosses: 0,
            currentSeasonWins: 0,
            currentSeasonLosses: 0,
            currentSeasonOvertimeLosses: 0
          });
        } else {
          this.players.push({
            id: id.id,
            firstName: stats.firstName.default,
            lastName: stats.lastName.default,
            position: stats.position,
            imageUrl: stats.headshot,
            careerGoals: 0,
            careerAssists: 0,
            careerPoints: 0,
            currentSeasonGoals: 0,
            currentSeasonAssists: 0,
            currentSeasonPoints: 0,
            careerWins: stats.careerTotals.regularSeason.wins,
            careerLosses: stats.careerTotals.regularSeason.losses,
            careerOvertimeLosses: stats.careerTotals.regularSeason.otLosses,
            currentSeasonWins: stats.seasonTotals[stats.seasonTotals.length - 1].wins,
            currentSeasonLosses: stats.seasonTotals[stats.seasonTotals.length - 1].losses,
            currentSeasonOvertimeLosses: stats.seasonTotals[stats.seasonTotals.length - 1].otLosses
          });
        }
      }
    });
  }

  removePlayer(playerId: number) {
    const index = this.playerIds[0][0].findIndex((id: number) => id === playerId);

    if (index !== -1) {
      this.playerIds[0][0].splice(index, 1);
      this.setPlayers();

      // Also remove from displayed players
      const playerIndex = this.players.findIndex(player => player.id === playerId);
      if (playerIndex !== -1) {
        this.players.splice(playerIndex, 1);
      }
    }
  }
}
