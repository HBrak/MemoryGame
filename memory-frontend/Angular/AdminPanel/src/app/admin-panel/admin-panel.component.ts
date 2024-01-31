import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from '../Services/Jwt/jwt.service';
import { PlayerService } from '../Services/Player/player.service';
import { Player } from '../Services/Player/player.model';
import { DatesService } from '../Services/Dates/dates.service';
import { Date } from '../Services/Dates/dates.model';
import { AggregateService } from '../Services/Aggregate/aggregate.service';
import { AggregatedData } from '../Services/Aggregate/aggregate.model';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [PlayerService, JwtService, DatesService, AggregateService]
})
export class AdminPanelComponent implements OnInit, AfterViewInit {

  @ViewChild('amountsChart') amountsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('datesChart') datesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('apiChart') apiChart!: ElementRef<HTMLCanvasElement>;

  public players: Player[] = [];
  public dates: Date[] = [];
  public aggregatedData : AggregatedData | null = null;

  constructor(private playerService: PlayerService, private datesService: DatesService, private aggregateService: AggregateService) { }

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

  ngAfterViewInit() {
    this.createAmountsChart();
    this.createDatesChart();
    this.createAPIChart();
  }

  createAmountsChart(){
    this.aggregateService.getData().subscribe(aggregatedData => {
      this.aggregatedData = aggregatedData;

      const amount_games = aggregatedData.aantal_spellen | 0;
      const amount_players = aggregatedData.aantal_spelers | 0;


      const ctx = this.amountsChart.nativeElement;
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Amount Games', 'Amount Players'],
          datasets: [{
            label: 'Aantallen',
            data: [amount_games, amount_players],
            borderWidth: 1
            }]
          },
          options: {
            scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  createDatesChart(){
    this.datesService.getDates().subscribe(dates => {
      this.dates = dates;

      const dateArray: string[] = dates.map(dateObject => dateObject.date);
      const valueArray: number[] = dates.map(dateObject => dateObject.value);

      const ctx = this.datesChart.nativeElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dateArray,
          datasets: [{
            label: 'Aantallen',
            data: valueArray,
            borderWidth: 1
            }]
          },
          options: {
            scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  createAPIChart(){
    this.aggregateService.getData().subscribe(aggregatedData => {
      this.aggregatedData = aggregatedData;


      const apiData = this.aggregatedData.api;

      const apiArray: string[] = apiData.map(Object => Object.api);
      const valueArray: number[] = apiData.map(Object => Object.aantal);

      const ctx = this.apiChart.nativeElement;
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: apiArray,
          datasets: [{
            label: 'Aantallen',
            data: valueArray,
            borderWidth: 1
            }]
          },
          options: {
            scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }


}