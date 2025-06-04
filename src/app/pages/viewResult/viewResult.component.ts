import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  message: string;
  data: {
    stats: {
      passed: number;
      failed: number;
      accepted: number;
    };
    student: Array<{
      id: string;
      studentId: string;
      examId: string;
      score: number;
      status: string;
      percentage: string;
      student: {
        id: string;
        userId: string;
        user: {
          name: string;
          email: string;
        };
      };
    }>;
  };
}

@Component({
  selector: 'app-viewResult',
  templateUrl: './viewResult.component.html',
  styleUrls: ['./viewResult.component.css']
})
export class ViewResultComponent implements OnInit {
  @ViewChild('pie-chart') chart!: ElementRef;
  @ViewChild('dataTable') tableRef!: ElementRef;
  quizId!: any;
  apiUrl = 'https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/exam';

  stats: any = {};
  students: any[] = [];
  loading = true;
  error: string | null = null;
  passRetio!: Number;
  examLength!: number;
  hasStudents = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id')
    this.examLength = Number(this.route.snapshot.paramMap.get('length'))
    this.fetchExamResults(this.quizId);
  }

  fetchExamResults(examId: string) {
    this.loading = true;
    this.error = null;

    this.http.get<ApiResponse>(`${this.apiUrl}/${this.quizId}/students`)
      .subscribe({
        next: async (res) => {
          if (res.message === 'success') {
            this.stats = res.data?.stats || {};
            this.students = res.data?.student || [];
            this.hasStudents = this.students.length > 0;

            if (this.hasStudents) {
              this.passRetio = +(((this.stats.passed + this.stats.accepted) / this.students.length) * 100).toFixed(2);
              await this.drawChart();
              await this.initDataTable();
            }
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Submission error:', err);
          this.error = 'Failed to load exam data.';
          this.loading = false;
        }
      });
  }
  async drawChart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const ApexCharts = (await import('apexcharts')).default;
    const chartOptions = {
      series: [this.stats.passed, this.stats.accepted, this.stats.failed],
      colors: ["#16a34a", "#F9A825", "#EA173F"],
      chart: {
        height: 420,
        width: "100%",
        type: "pie",
      },
      stroke: {
        colors: ["white"],
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -45
          }
        },
      },
      labels: ["Pass", "Acceptable", "Failed"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      }
    };

    const chartContainer = document.getElementById("pie-chart");
    if (chartContainer && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(chartContainer, chartOptions);
      chart.render();
    }
  }
  async initDataTable() {
    if (!isPlatformBrowser(this.platformId)) return;

    const { DataTable } = await import('simple-datatables');
    new DataTable("#pagination-table", {
      sortable: true,
      paging: false,
      searchable: true,
      sensitivity: "base",
      ignorePunctuation: true
    });
  }




}