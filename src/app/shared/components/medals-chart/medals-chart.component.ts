import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  OnDestroy,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import Chart, {TooltipModel} from 'chart.js/auto';
import {Router} from '@angular/router';
import {AccessibilityChart} from '../../accessibility/accessibility-chart.interface';
import {ChartColors} from "../../styles/colors-chart.style";
import {getCountriesName} from "../../../core/utils/olympic.utils";
import {MedalsChartDatas} from "./interfaces/medals-chart-datas.interface";
import {BreakpointService} from "../../responsive/breakpoint.service";




@Component({
  selector: 'app-medals-chart',
  standalone: true,
  imports: [],
  templateUrl: './medals-chart.component.html',
  styleUrl: './medals-chart.component.scss'
})
export class MedalsChartComponent implements OnInit, OnDestroy, AccessibilityChart {

  medalsChart!: Chart<"bar", number[], string>;

  private tooltipEl?: HTMLDivElement;

  private breakpointService = inject(BreakpointService)

  readonly datas: InputSignal<MedalsChartDatas> = input.required<MedalsChartDatas>();

  readonly activeIndex: WritableSignal<number | null> = signal(null);

  readonly ariaLabel: Signal<string> = computed(() => {
    const index = this.activeIndex();
    if (index === null) {
      return 'Graphique du nombre de médailles par pays. Utilisez les flèches pour parcourir les pays.';
    }
    const country = this.datas().countries[index];
    const medals = this.datas().sumOfAllMedalsYears[index];
    return `${country.name} : ${medals} médailles. Appuyez sur Entrée pour voir le détail.`;
  });

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.buildChart(this.datas());
  }

  ngOnDestroy(): void {
    this.tooltipEl?.remove();
  }

  onKeydown(event: KeyboardEvent): void {
    const countries = this.datas().countries;
    const current = this.activeIndex();
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.setActiveSlice(current === null ? 0 : (current + 1) % countries.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.setActiveSlice(current === null ? countries.length - 1 : (current - 1 + countries.length) % countries.length);
        break;
      case 'Enter':
      case ' ':
        if (current !== null) {
          event.preventDefault();
          this.navigateToCountry(countries[current].id)
        }
        break;
      case 'Escape':
        this.onClearActiveSlice();
        break;
    }
  }

  setActiveSlice(index: number): void {
    this.activeIndex.set(index);
    const arc = this.medalsChart.getDatasetMeta(0).data[index];
    this.medalsChart.setActiveElements([{datasetIndex: 0, index}]);
    this.medalsChart.tooltip?.setActiveElements([{datasetIndex: 0, index}], {x: arc.x, y: arc.y});
    this.medalsChart.update();
  }

  onClearActiveSlice(): void {
    this.activeIndex.set(null);
    this.medalsChart.setActiveElements([]);
    this.medalsChart.tooltip?.setActiveElements([], {x: 0, y: 0});
    this.medalsChart.update();
  }

  onClickCountry(): void {
    const activeElements = this.medalsChart.getActiveElements();
    if (activeElements.length > 0) {
      const country = this.datas().countries[activeElements[0].index];
      this.navigateToCountry(country.id)
    }
  }

  private navigateToCountry(id: number): void {
    this.router.navigateByUrl(`/country/${id}`)
  }

  private buildChart(datas: MedalsChartDatas) {
    this.medalsChart = new Chart("MedalsChart", {
      type: 'bar',
      data: {
        labels: getCountriesName(datas.countries),
        datasets: [{
          label: 'Medals',
          barThickness: 'flex',
          data: datas.sumOfAllMedalsYears,
          backgroundColor: Object.values(ChartColors),
        }],
      },
      options: {
        responsive: true,
        aspectRatio: this.breakpointService.isDesktop() ? 2.5 : 1,
        maintainAspectRatio: true,
        indexAxis: "y",
        plugins: {
          tooltip: {
            enabled: false,
            external: context => this.renderTooltip(context)
          }
        }
      }
    });
  }

  private renderTooltip(context: { chart: Chart, tooltip: TooltipModel<"bar"> }): void {
    const {chart, tooltip} = context;

    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.classList.add('chart-tooltip');
      chart.canvas.parentElement?.appendChild(this.tooltipEl);
    }

    if (tooltip.opacity === 0) {
      this.tooltipEl.style.opacity = '0';
      return;
    }

    const dataPoint = tooltip.dataPoints[0];
    this.tooltipEl.innerHTML = `
      <div class="chart-tooltip-title">${dataPoint.label}</div>
      <div>🥇 ${dataPoint.formattedValue}</div>
    `;

    this.tooltipEl.style.opacity = '1';
    this.tooltipEl.style.left = `${chart.canvas.offsetLeft + tooltip.caretX}px`;
    this.tooltipEl.style.top = `${chart.canvas.offsetTop + tooltip.caretY}px`;
  }
}
