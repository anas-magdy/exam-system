import { Component, Input, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  imports: [NgxChartsModule],
})
export class PieChartComponent implements OnInit {
  @Input() pass!: number;
  @Input() accepted!: number;
  @Input() faild!: number;
  pieChartData = [
    { name: 'Pass', value: 0 },
    { name: 'Accepted', value: 0 },
    { name: 'Faild', value: 0 },
  ];

  colorScheme: any = {
    domain: ['#226522', '#ffe628', '#ff2626'],
  };

  legendPosition: any = 'below';

  constructor() {}

  ngOnInit() {
    this.pieChartData = [
      { name: 'Pass', value: this.pass },
      { name: 'Accepted', value: this.accepted },
      { name: 'Faild', value: this.faild },
    ];
  }
}
