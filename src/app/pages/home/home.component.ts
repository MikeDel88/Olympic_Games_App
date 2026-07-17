import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {MedalsChartComponent, MedalsChartDatas} from "../../shared/components/medals-chart/medals-chart.component";

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
  private olympicUrl: string = './assets/mock/olympic.json';
  public totalCountries: number = 0
  public totalJOs: number = 0
  public error!:string
  public medalsChartDatas!: MedalsChartDatas

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
          const countries = data.map((i: any) => i.country);
          this.totalCountries = countries.length;
          const medals = data.map((i: any) => i.participations.map((i: any) => (i.medalsCount)));
          const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));
          this.medalsChartDatas = {
            countries: countries,
            sumOfAllMedalsYears: sumOfAllMedalsYears
          };
        }
      },
      (error:HttpErrorResponse) => {
        this.error = error.message
      }
    )
  }
}

