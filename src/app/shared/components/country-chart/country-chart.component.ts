import {Component, inject, input, InputSignal, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {ChartColors} from "../../styles/colors-chart.style";
import {CountryChartDatas} from "./interfaces/country-chart-datas.interfaces";
import {BreakpointService} from "../../responsive/breakpoint.service";

@Component({
  selector: 'app-country-chart',
  standalone: true,
  imports: [],
  templateUrl: './country-chart.component.html',
  styleUrl: './country-chart.component.scss'
})
export class CountryChartComponent implements OnInit {

  countryChart!: Chart<"line", string[], number>;

  private readonly breakpointService = inject(BreakpointService)

  datas: InputSignal<CountryChartDatas> = input.required<CountryChartDatas>();

  ngOnInit(): void {
    this.buildChart(this.datas());
  }

  buildChart(datas: CountryChartDatas) {
    this.countryChart = new Chart("CountryChart", {
      type: 'line',
      data: {
        labels: datas.years,
        datasets: [
          {
            label: "medals",
            pointStyle: false,
            data: datas.medals,
            backgroundColor: ChartColors.teal
          },
        ]
      },
      options: {
        aspectRatio: this.breakpointService.isDesktop() ? 2.5 : 1,
        scales: {
          y: {
            min: 0
          }
        }
      }
    });
  }
}
