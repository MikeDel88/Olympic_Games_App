import {Component, OnInit, inject, DestroyRef } from '@angular/core';
import {HeaderComponent} from "../../shared/components/header/header.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MedalsChartComponent, MedalsChartDatas} from "../../shared/components/medals-chart/medals-chart.component";
import {DataService} from "../../core/services/data.service";
import {Olympics} from "../../models/olympic/olympic.model";
import {getCountries, getTotalJOs, sumOfAllMedalsYears} from "../../core/utils/olympic.utils";

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MedalsChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true
})
export class HomeComponent implements OnInit {
  totalCountries!: number;
  totalJOs!: number;
  error!:string;
  medalsChartDatas!: MedalsChartDatas;

  private destroyRef = inject(DestroyRef);
  private dataService= inject(DataService)

  ngOnInit() {
    this.dataService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => { if (data && data.length > 0) this.updateUi(data) })
  }

  private updateUi(data: Olympics) {
    this.totalJOs = getTotalJOs(data)
    const countries = getCountries(data);
    this.totalCountries = countries.length;
    this.medalsChartDatas = {
      countries: countries,
      sumOfAllMedalsYears: sumOfAllMedalsYears(data)
    };
  }
}


