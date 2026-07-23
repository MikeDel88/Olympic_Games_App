import {Component, computed, inject, input, InputSignal, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import Chart from 'chart.js/auto';
import {ChartColors} from "../../styles/colors-chart.style";
import {CountryChartDatas} from "./interfaces/country-chart-datas.interface";
import {BreakpointService} from "../../responsive/breakpoint.service";
import {AccessibilityChart} from "../../accessibility/accessibility-chart.interface";

@Component({
  selector: 'app-country-chart',
  standalone: true,
  imports: [],
  templateUrl: './country-chart.component.html',
  styleUrl: './country-chart.component.scss'
})
export class CountryChartComponent implements OnInit, AccessibilityChart {

  countryChart!: Chart<"line", string[], number>;

  private readonly breakpointService: BreakpointService = inject(BreakpointService)

  datas: InputSignal<CountryChartDatas> = input.required<CountryChartDatas>();

  readonly activeIndex: WritableSignal<number | null> = signal(null);

  readonly ariaLabel: Signal<string> = computed((): string => {
    const index: number | null = this.activeIndex();
    if (index === null) {
      return 'Graphique du nombre de médailles par Jeux olympics. Utilisez les flèches pour parcourir les années.';
    }
    const year: number = this.datas().years[index]
    const medals: string = this.datas().medals[index]
    return `${year} : ${medals} médailles.`;
  });

  ngOnInit(): void {
    this.buildChart(this.datas());
  }

  private buildChart(datas: CountryChartDatas): void {
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

  onKeydown(event: KeyboardEvent): void {
    const years: number[] = this.datas().years;
    const current: number | null = this.activeIndex();
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.setActiveSlice(current === null ? 0 : (current + 1) % years.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.setActiveSlice(current === null ? years.length - 1 : (current - 1 + years.length) % years.length);
        break;
      case 'Escape':
        this.onClearActiveSlice();
        break;
    }
  }

  setActiveSlice(index: number): void {
    this.activeIndex.set(index);
    const arc = this.countryChart.getDatasetMeta(0).data[index];
    this.countryChart.setActiveElements([{datasetIndex: 0, index}]);
    this.countryChart.tooltip?.setActiveElements([{datasetIndex: 0, index}], {x: arc.x, y: arc.y});
    this.countryChart.update();
  }

  onClearActiveSlice(): void {
    this.activeIndex.set(null);
    this.countryChart.setActiveElements([]);
    this.countryChart.tooltip?.setActiveElements([], {x: 0, y: 0});
    this.countryChart.update();
  }
}
