import { Component, input, OnInit, InputSignal } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-country-chart',
  standalone: true,
  imports: [],
  templateUrl: './country-chart.component.html',
  styleUrl: './country-chart.component.scss'
})
export class CountryChartComponent implements OnInit {

  countryChart!: Chart<"line", string[], number>;

  years: InputSignal<number[]> = input<number[]>([])
  medals: InputSignal<string[]> = input<string[]>([])

  ngOnInit(): void {
    this.buildChart(this.years(), this.medals());
  }

  buildChart(years: number[], medals: string[]) {
    const lineChart = new Chart("CountryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.countryChart = lineChart;
  }
}
