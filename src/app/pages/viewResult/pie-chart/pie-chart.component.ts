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
  chartView: [number, number] = [600, 450];

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
    this.setResponsiveView();
    window.addEventListener('resize', this.setResponsiveView.bind(this));

  }setResponsiveView() {
  const width = window.innerWidth;

  if (width < 480) {
    this.chartView = [300, 300];
  } else if (width < 768) {
    this.chartView = [400, 350];
  } else {
    this.chartView = [600, 450];
  }
}
}
