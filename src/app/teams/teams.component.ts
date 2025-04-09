import { Component, OnInit, inject } from '@angular/core';
import { StatsService } from '../service/stats.service';
import { RosterComponent } from './roster/roster.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Team } from '../shared/team.type';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatGridListModule, MatButtonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  dialog = inject(MatDialog);


  atlanticTeams: Team[] = [];
  metropolitanTeams: Team[] = [];
  centralTeams: Team[] = [];
  pacificTeams: Team[] = [];

  roster: any[] = [];

  getTeamsByDivision(division: string) {
    switch (division) {
      case 'Atlantic':
        return this.atlanticTeams;
      case 'Metropolitan':
        return this.metropolitanTeams;
      case 'Central':
        return this.centralTeams;
      case 'Pacific':
        return this.pacificTeams;
      default:
        return [];
    }
  }


  constructor(private statsApi: StatsService) { }

  ngOnInit(): void {
    this.statsApi.getStats().subscribe((data: any) => {
      if (data) {
        const getTeamsByDivision = (divisionAbbrev: string) => {
          return data.standings
            .filter((conf: any) => conf.divisionAbbrev === divisionAbbrev)
            .map((stats: any) => ({
              conferenceAbbrev: stats.conferenceAbbrev,
              divisionAbbrev: stats.divisionAbbrev,
              placeName: stats.placeName.default,
              teamAbbrev: stats.teamAbbrev,
              teamLogo: stats.teamLogo,
              teamName: stats.teamCommonName.default
            }))
            .sort((a: any, b: any) => a.placeName.localeCompare(b.placeName));
        };

        this.atlanticTeams = getTeamsByDivision("A");
        this.metropolitanTeams = getTeamsByDivision("M");
        this.centralTeams = getTeamsByDivision("C");
        this.pacificTeams = getTeamsByDivision("P")
      }
    });
  }
}
