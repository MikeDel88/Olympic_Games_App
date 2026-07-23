import {Component, OnInit, inject } from '@angular/core';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {MedalsChartComponent} from "../../shared/components/medals-chart/medals-chart.component";
import {DataService} from "../../core/services/data.service";
import {Olympics} from "../../models/olympic/olympic.model";
import {getCountries, getTotalJOs, sumOfAllMedalsYears} from "../../core/utils/olympic.utils";
import {Router} from "@angular/router";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {MedalsChartDatas} from "../../shared/components/medals-chart/interfaces/medals-chart-datas.interface";

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    MedalsChartComponent,
    LoaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true
})
export class HomeComponent implements OnInit {

  error!: string | undefined

  totalCountries!: number;
  totalJOs!: number;
  medalsChartDatas!: MedalsChartDatas;

  private dataService= inject(DataService)
  private readonly router = inject(Router)

  ngOnInit() {
    this.getDatas()
  }

  private getDatas(): void {
    this.dataService.getOlympics()
      .subscribe({
        next: data => {
          if (data)
            this.updateUi(data)
          else
            this.router.navigateByUrl("/not-found")
        },
        error: (error: Error) => this.error = error.message
      })
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


