import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from '../Services/Jwt/jwt.service';
import { PlayerService } from '../Services/Player/player.service';
import { Player } from '../Services/Player/player.model';
import { DatesService } from '../Services/Dates/dates.service';
import { Date } from '../Services/Dates/dates.model';
import { AggregateService } from '../Services/Aggregate/aggregate.service';
import { AggregatedData } from '../Services/Aggregate/aggregate.model';

@Component({
  selector: 'admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [PlayerService, JwtService, DatesService, AggregateService]
})
export class AdminPanelComponent implements OnInit {
  public players: Player[] = [];
  public dates: Date[] = [];
  public aggregatedData : AggregatedData | null = null;

  constructor(private playerService: PlayerService, private datesService: DatesService, private aggregateService: AggregateService,) { }

  ngOnInit() {
    this.playerService.getPlayers().subscribe(players => {
      this.players = players;
    });

    this.datesService.getDates().subscribe(dates => {
      this.dates = dates;
    });

    this.aggregateService.getData().subscribe(aggregatedData => {
      this.aggregatedData = aggregatedData;
    });
    
  }
}