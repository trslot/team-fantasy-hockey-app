import { Component, OnInit } from '@angular/core';
import { ITeam } from '../shared/teams.type';
import { INHLTeam } from '../shared/nhl-teams.type';
import { StatsService } from '../service/stats.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { environment } from '../../environment/environment';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, getDoc, updateDoc  } from "firebase/firestore";

@Component({
  selector: 'app-fantasy-teams',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatGridListModule, MatIconModule, MatButtonModule, MatDialogModule],
  providers: [],
  templateUrl: './fantasy-teams.component.html',
  styleUrl: './fantasy-teams.component.scss'
})
export class FantasyTeamsComponent implements OnInit {
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


  teams: ITeam[] = [];

  [key: string]: any;

  jonah: INHLTeam[] = [];
  isaiah: INHLTeam[] = [];
  mom: INHLTeam[] = [];
  dad: INHLTeam[] = [];

  jonahPoints: number = 0;
  isaiahPoints: number = 0;
  momPoints: number = 0;
  dadPoints: number = 0;

  sortByPlaceBool: boolean = false;

  cardColors: { [key: string]: string } = {
    jonah: '',
    isaiah: '',
    mom: '',
    dad: ''
  };

  constructor(private statsAPI: StatsService, private dialog: MatDialog) { }

  openColorPicker(cardName: string) {
    import('./color-picker-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ColorPickerDialogComponent, {
        data: { currentColor: this.cardColors[cardName] || '#ffffff' }
      });

      dialogRef.afterClosed().subscribe((result: string) => {
        if (result) {
          this.cardColors[cardName] = result;
        }
      });
    });
  }

  ngOnInit(): void {
    (async () => {
      await this.getTeams();
      this.getDB();
      this.statsAPI.getStats().subscribe((data: any) => {
        if (data) {
          data.standings.forEach((stats: any) => {
            this.sortIntoTeams(stats);
          });
        }
      });
    })();
  }

  async getDB() {
    const gamesRef = doc(this.db, "games", "0");
    const gamesSnap = await getDoc(gamesRef);

    if (gamesSnap.exists()) {
      // console.log(gamesSnap.data());
    } else {
      // gamesSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  
  async getTeams() {
    const docRef = doc(this.db, "teams", "0");
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

  sortIntoTeams(stats: any) {
    const teamIndex = this.teams.findIndex(team => team.nhlTeams.includes(stats.teamAbbrev.default));
  
    if (teamIndex !== -1) {
      const teamData: INHLTeam = {
        teamName: stats.teamCommonName.default,
        points: stats.wins,
        logo: stats.teamLogo,
        placeName: stats.placeName.default,
      };
  
      const teams = ['jonah', 'isaiah', 'mom', 'dad'];
      const points = ['jonahPoints', 'isaiahPoints', 'momPoints', 'dadPoints'];
  
      const targetTeam = teams[teamIndex];
      const targetPoints = points[teamIndex];
 
      this[targetTeam].push(teamData);
      this[targetPoints] += stats.wins;
      this[targetTeam].sort((a: any, b: any) => b.points - a.points);
    }


    this.setScores();
  }
  

  sortByPlace() {
    if (this.sortByPlaceBool === false) {
      this.jonah.sort((a: any, b: any) => a.placeName.localeCompare(b.placeName));
      this.isaiah.sort((a: any, b: any) => a.placeName.localeCompare(b.placeName));
      this.dad.sort((a: any, b: any) => a.placeName.localeCompare(b.placeName));
      this.mom.sort((a: any, b: any) => a.placeName.localeCompare(b.placeName));

      this.sortByPlaceBool = true;
    } else {
      this.jonah.sort((a: any, b: any) => b.points - a.points);
      this.isaiah.sort((a: any, b: any) => b.points - a.points);
      this.dad.sort((a: any, b: any) => b.points - a.points);
      this.mom.sort((a: any, b: any) => b.points - a.points);

      this.sortByPlaceBool = false;
    }
  }

  async setScores() {
    const docRef = doc(this.db, "games", "0");

    await updateDoc(docRef, {
      "dad": this.dadPoints,
      "isaiah": this.isaiahPoints,
      "jonah": this.jonahPoints,
      "mom": this.momPoints
    });
  }

  async setTeams() {
    const docRef = doc(this.db, "teams", "0");

    await updateDoc(docRef, {
      "dad": this.teams[3].nhlTeams,
      "isaiah": this.teams[1].nhlTeams,
      "jonah": this.teams[0].nhlTeams,
      "mom": this.teams[2].nhlTeams
    });
  }
}


