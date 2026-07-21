import {Component, OnInit, inject, DestroyRef } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {CountryChartComponent} from "../../shared/components/country-chart/country-chart.component";
import {DataService} from "../../core/services/data.service";
import {
  getMedalsOlympic,
  getTotalAthletes,
  getTotalEntries, getTotalMedals,
  getYears,
} from "../../core/utils/olympic.utils";
import {Olympic} from "../../models/olympic/olympic.model";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {CountryChartDatas} from "../../shared/components/country-chart/interfaces/country-chart-datas.interfaces";


@Component({
  selector: 'app-country',
  imports: [
    HeaderComponent,
    CountryChartComponent,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './country.component.html',
  standalone: true,
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  countryChartDatas!: CountryChartDatas
  countryId!: number

  titlePage!: string
  totalEntries!: number
  totalMedals!: number
  totalAthletes!: number

  private destroyRef = inject(DestroyRef);
  private dataService= inject(DataService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  ngOnInit(): void {
    this.checkParams()
    this.getDatas()
  }

  private checkParams() {
    this.countryId = parseInt(this.route.snapshot.params["id"])

    if(isNaN(this.countryId))
      this.router.navigateByUrl("/not-found")
  }

  private getDatas() {
    this.dataService.getOlympic(this.countryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          if (data)
            this.updateUi(data)
          else
            this.router.navigateByUrl("/not-found")
        },
        error: () => this.router.navigateByUrl("/not-found")
      })
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
