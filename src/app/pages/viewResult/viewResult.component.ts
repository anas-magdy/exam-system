import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { environment } from '../../../environments/environments';

interface ExamStats {
  accepted: number;
  failed: number;
  passed: number;
}
@Component({
  selector: 'app-view-result',
  templateUrl: './viewResult.component.html',
  styleUrls: ['./viewResult.component.css'],
  imports: [PieChartComponent, FormsModule, CommonModule],
})
export class ViewResultComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartContainer', { static: false })
  pieChartContainer!: ElementRef;

  students: any[] = [];
  filteredStudents: any[] = [];
  paginatedStudents: any[] = [];
  stats!: ExamStats;
  searchText: string = '';
  loading: boolean = true;
  hasStudents: boolean = false;

  examLength: number = 0;
  passRetio!: number;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  sortKey: string = '';
  sortAsc: boolean = true;
  quizId: any;
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id');
    this.examLength = Number(this.route.snapshot.paramMap.get('length'));
    this.fetchResults();
    // await this.drawChart()
  }

  fetchResults(): void {
    this.loading = true;
    this.http
      .get<any>(`${this.apiBaseUrl}/exam/${this.quizId}/students`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.students = res.data.student || [];
          this.hasStudents = this.students.length > 0;
          this.stats = res.data.stats;
          console.log(this.stats);

          const totalStudents = this.students.length;
          this.passRetio =
            totalStudents > 0
              ? Number(
                  (
                    ((this.stats.passed + this.stats.accepted) /
                      totalStudents) *
                    100
                  ).toFixed(2)
                )
              : 0;

          this.filterStudents();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching results:', err);
          this.loading = false;
        },
      });
  }

  async ngAfterViewInit() {}

  // async drawChart() {
  //   if (!isPlatformBrowser(this.platformId)) return;
  //   const ApexCharts = (await import('apexcharts')).default;
  //   const chartOptions = {
  //     series: [this.stats.passed, this.stats.accepted, this.stats.failed],
  //     colors: ["#16a34a", "#F9A825", "#EA173F"],
  //     chart: {
  //       height: 420,
  //       width: "100%",
  //       type: "pie",
  //     },
  //     stroke: {
  //       colors: ["white"],
  //     },
  //     plotOptions: {
  //       pie: {
  //         labels: {
  //           show: true,
  //         },
  //         size: "100%",
  //         dataLabels: {
  //           offset: -45
  //         }
  //       },
  //     },
  //     labels: ["Pass", "Acceptable", "Failed"],
  //     dataLabels: {
  //       enabled: true,
  //       style: {
  //         fontFamily: "Inter, sans-serif",
  //       },
  //     },
  //     legend: {
  //       position: "bottom",
  //       fontFamily: "Inter, sans-serif",
  //     }
  //   };
  //   const chartContainer = document.getElementById("pie-chart");
  //   if (chartContainer && typeof ApexCharts !== 'undefined') {
  //     const chart = new ApexCharts(chartContainer, chartOptions);
  //     chart.render()
  //   }
  // }

  filterStudents(): void {
    this.filteredStudents = this.students.filter(
      (student) =>
        student.student.user.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        student.student.user.email
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePaginatedStudents();
  }

  updatePaginatedStudents(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredStudents.length) {
      this.currentPage++;
      this.updatePaginatedStudents();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedStudents();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedStudents();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(
      this.filteredStudents.length / this.itemsPerPage
    );
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  sortTable(key: string): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }

    this.filteredStudents.sort((a, b) => {
      let aValue = this.getSortValue(a, key);
      let bValue = this.getSortValue(b, key);

      if (aValue < bValue) return this.sortAsc ? -1 : 1;
      if (aValue > bValue) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.updatePaginatedStudents();
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getSortValue(item: any, key: string): string | number {
    switch (key) {
      case 'name':
        return item.student.user.name.toLowerCase();
      case 'email':
        return item.student.user.email.toLowerCase();
      case 'percentage':
        return item.percentage;
      case 'status':
        return item.status.toLowerCase();
      default:
        return '';
    }
  }
  trackById(index: number, item: any): string {
    return item.student._id;
  }
}
