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

  datas: InputSignal<CountryChartDatas> = input.required<CountryChartDatas>();

  ngOnInit(): void {
    this.buildChart(this.datas());
  }

  buildChart(datas: CountryChartDatas) {
    const lineChart = new Chart("CountryChart", {
      type: 'line',
      data: {
        labels: datas.years,
        datasets: [
          {
            label: "medals",
            data: datas.medals,
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

export type CountryChartDatas = {
  years: number[]
  medals: string[]
}
