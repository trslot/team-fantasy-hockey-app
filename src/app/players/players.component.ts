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

import { environment } from '../../environment/environment';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, child, push, update } from "firebase/database";


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

  app = initializeApp(this.config);
  db = getFirestore(this.app);

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
          this.players.push({
            id: id,
            firstName: stats.firstName.default,
            lastName: stats.lastName.default,
            imageUrl: stats.headshot,
            goals: stats.careerTotals.regularSeason.goals,
            assists: stats.careerTotals.regularSeason.assists,
            points: stats.careerTotals.regularSeason.points
          });
        }
      });
    });

    var players: any[] = [];

    this.statsAPI.getStats().subscribe((data: any) => {
      if (data) {
        data.standings.forEach((stats: any) => {
          this.statsAPI.getRosters(stats.teamAbbrev.default).subscribe((roster: any) => {
            players.push(roster);
          })
        });
      }
    });

    players.forEach(player => {
      if (player) {
        [...player.forwards, ...player.defensemen, ...player.goalies].forEach((playerRole: any) => {
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
  }

  addPlayer(id: PlayerSearch) {
    this.playerIds[0][0].push(id.id);
    this.setPlayers();
  
    // Get player stats immediately and update UI
    this.statsAPI.getPlayerStats(id.id).subscribe((stats: any) => {
      if (stats) {
        this.players.push({
          id: id.id,
          firstName: stats.firstName.default,
          lastName: stats.lastName.default,
          imageUrl: stats.headshot,
          goals: stats.careerTotals.regularSeason.goals,
          assists: stats.careerTotals.regularSeason.assists,
          points: stats.careerTotals.regularSeason.points
        });
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
