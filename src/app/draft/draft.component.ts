import { Component, OnInit } from '@angular/core';
import { environment } from '../../environment/environment';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ITeam } from '../shared/teams.type';
import { INHLTeam } from '../shared/nhl-teams.type';
import { Years } from '../shared/years.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { StatsService } from '../service/stats.service';
import { firstValueFrom } from 'rxjs';

export interface DraftPick {
  playerName: string;
  draftOrder: number;
  teams: INHLTeam[];
  previousSeasonPoints: number;
}

@Component({
  selector: 'app-draft',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatListModule],
  templateUrl: './draft.component.html',
  styleUrl: './draft.component.scss'
})
export class DraftComponent implements OnInit {
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
  teams: ITeam[] = [];
  worstToFirstPlace: INHLTeam[][] = [];
  draftOrder: DraftPick[] = [];

  years: Years[] = [
    { year: '2026', display: '2026 - 2027' },
    { year: '2025', display: '2025 - 2026' },
    { year: '2024', display: '2024 - 2025' }
  ];

  jonah: INHLTeam[] = [];
  isaiah: INHLTeam[] = [];
  mom: INHLTeam[] = [];
  dad: INHLTeam[] = [];

  jonahPoints: number = 0;
  isaiahPoints: number = 0;
  momPoints: number = 0;
  dadPoints: number = 0;

  constructor(private statsAPI: StatsService) { }

  private _yearSelected = '2026';
  private _previousYearSelected = '2025';

  get yearSelected() {
    return this._yearSelected;
  }
  set yearSelected(value: string) {
    if (this._yearSelected !== value) {
      this._yearSelected = value;
      this._previousYearSelected = (parseInt(this._yearSelected) - 1).toString();

      // Reset arrays & points so fresh data loads
      this.jonah = [];
      this.isaiah = [];
      this.mom = [];
      this.dad = [];
      this.draftOrder = [];

      // Reload teams for the selected year
      this.loadData();
    }
  }

  get previousYearSelected() {
    return this._previousYearSelected;
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    await this.getTeams();
    await this.getScores();
  }

  async getTeams() {
    const docRef = doc(this.db, "teams", this.yearSelected);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Fetch team mappings from API
      const statsData: any = await firstValueFrom(this.statsAPI.getStats());

      // Create a key-value lookup object: { "DET": "Detroit Red Wings", "MTL": "Montréal Canadiens", ... }
      const teamMap: { [abbrev: string]: string } = {};
      if (statsData?.standings) {
        statsData.standings.forEach((stats: any) => {
          const abbrev = stats.teamAbbrev?.default;
          const fullName = stats.teamName?.default;
          if (abbrev && fullName) {
            teamMap[abbrev] = fullName;
          }
        });
      }

      // Helper function to convert abbreviation array to full team name array
      const mapAbbrevsToNames = (abbrevs: string[] = []): any[] => {
        return abbrevs.map((abbrev: string) => teamMap[abbrev] || abbrev);
      };

      this.jonah = mapAbbrevsToNames(data['jonah']);
      this.isaiah = mapAbbrevsToNames(data['isaiah']);
      this.mom = mapAbbrevsToNames(data['mom']);
      this.dad = mapAbbrevsToNames(data['dad']);

    } else {
      console.log("No teams document found!");
    }
  }

  async getScores() {
    let snapshot = await getDoc(doc(this.db, "games", this.previousYearSelected));
    
    if (!snapshot.exists()) {
      snapshot = await getDoc(doc(this.db, "games", this.yearSelected));
    }

    if (snapshot.exists()) {
      const data = snapshot.data();

      const players = [
        { name: 'Dad', points: data['dad'] || 0, teams: this.dad },
        { name: 'Mom', points: data['mom'] || 0, teams: this.mom },
        { name: 'Jonah', points: data['jonah'] || 0, teams: this.jonah },
        { name: 'Isaiah', points: data['isaiah'] || 0, teams: this.isaiah }
      ];

      // Sort by points ascending (lowest first = worst record picks first)
      players.sort((a, b) => a.points - b.points);

      this.worstToFirstPlace = players.map(player => player.teams);

      this.draftOrder = players.map((player, index) => ({
        playerName: player.name,
        draftOrder: index + 1,
        teams: player.teams,
        previousSeasonPoints: player.points
      }));
    }
  }
}