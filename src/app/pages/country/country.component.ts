import {Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
import {CountryChartDatas} from "../../shared/components/country-chart/interfaces/country-chart-datas.interface";


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

  error!: string | undefined

  countryChartDatas!: CountryChartDatas
  countryId!: number

  titlePage!: string
  totalEntries!: number
  totalMedals!: number
  totalAthletes!: number

  private dataService: DataService = inject(DataService)
  private route: ActivatedRoute = inject(ActivatedRoute)
  private router: Router = inject(Router)

  ngOnInit(): void {
    this.checkParams()
    this.getDatas()
  }

  private checkParams(): void {
    this.countryId = parseInt(this.route.snapshot.params["id"])

    if(isNaN(this.countryId))
      this.router.navigateByUrl("/not-found")
  }

  private getDatas(): void {
    this.dataService.getOlympic(this.countryId)
      .subscribe({
        next: (data: Olympic | undefined) => {
          if (data)
            this.updateUi(data)
          else
            this.router.navigateByUrl("/not-found")
        },
        error: (error: Error): string => this.error = error.message
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
