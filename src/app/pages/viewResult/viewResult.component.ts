import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-viewResult',
  templateUrl: './viewResult.component.html',
  styleUrls: ['./viewResult.component.css']
})
export class ViewResultComponent implements AfterViewInit {
  @ViewChild('pie-chart') chart!: ElementRef;
  @ViewChild('dataTable') tableRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ApexCharts = (await import('apexcharts')).default;
      const chartOptions = {
        series: [80.8,1, 18.2],
        colors: ["#16BDCA", "#F9A825","#EA173F"],
        chart: {
          height: 420,
          width: "100%",
          type: "pie",
        },
        stroke: {
          colors: ["white"],
          lineCap: "",
        },
        plotOptions: {
          pie: {
            labels: {
              show: true,
            },
            size: "100%",
            dataLabels: {
              offset: -25
            }
          },
        },
        labels: ["Pass", "Acceptable","Failed"],
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Inter, sans-serif",
          },
        },
        legend: {
          position: "bottom",
          fontFamily: "Inter, sans-serif",
        },
        yaxis: {
          labels: {
            formatter: function (value: number) {
              return value + "%"
            },
          },
        },
        xaxis: {
          labels: {
            formatter: function (value: number) {
              return value + "%"
            },
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
      }
      if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(document.getElementById("pie-chart"), chartOptions);
        chart.render();
      }
      const { DataTable } = await import('simple-datatables');

      new DataTable("#pagination-table", {
        sortable: true,
        paging: false,
        searchable: true,
        sensitivity: "base",
        ignorePunctuation: true
      })
        ;
    }



  }
}
