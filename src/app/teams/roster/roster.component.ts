import { Component, inject, OnInit } from '@angular/core';
import {   MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent} from '@angular/material/dialog';
import { StatsService } from '../../service/stats.service';


@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.scss'
})
export class RosterComponent implements OnInit {

  constructor(private statsApi: StatsService) {}

  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    
  }

}
