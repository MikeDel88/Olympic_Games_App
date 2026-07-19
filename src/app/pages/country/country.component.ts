import {Component, OnInit, inject, DestroyRef } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {CountryChartComponent, CountryChartDatas} from "../../shared/components/country-chart/country-chart.component";
import {DataService} from "../../core/services/data.service";
import {
  getMedalsOlympic,
  getTotalAthletes,
  getTotalEntries, getTotalMedals,
  getYears,
} from "../../core/utils/olympic.utils";
import {Olympic} from "../../models/olympic/olympic.model";


@Component({
  selector: 'app-country',
  imports: [
    HeaderComponent,
    CountryChartComponent,
    RouterLink
  ],
  templateUrl: './country.component.html',
  standalone: true,
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  error!: string;
  countryChartDatas!: CountryChartDatas
  titlePage!: string
  totalEntries!: number
  totalMedals!: number
  totalAthletes!: number

  private destroyRef = inject(DestroyRef);
  private dataService= inject(DataService)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.dataService.getOlympic(parseInt(this.route.snapshot.params["id"]))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => { if (data) this.updateUi(data) });
  }

  private updateUi(data: Olympic): void {
    this.titlePage = data.country
    this.totalAthletes = getTotalAthletes(data)
    this.totalEntries = getTotalEntries(data)
    this.totalMedals = getTotalMedals(data)
    this.countryChartDatas = {
      years: getYears(data),
      medals: getMedalsOlympic(data)
    }
  }
}
