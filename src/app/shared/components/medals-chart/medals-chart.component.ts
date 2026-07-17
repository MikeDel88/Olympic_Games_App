import { Component, input, InputSignal, OnInit  } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medals-chart',
  standalone: true,
  imports: [],
  templateUrl: './medals-chart.component.html',
  styleUrl: './medals-chart.component.scss'
})
export class MedalsChartComponent implements OnInit  {

  public medalsChart!: Chart<"pie", number[], string>;

  countries: InputSignal<string[]> = input<string[]>([])
  sumOfAllMedalsYears: InputSignal<number[]> = input<number[]>([])

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildPieChart(this.countries(), this.sumOfAllMedalsYears());
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("MedalsChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.medalsChart = pieChart;
  }
}
