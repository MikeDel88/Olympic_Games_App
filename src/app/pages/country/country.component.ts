import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, RouterLink} from '@angular/router';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {CountryChartComponent, CountryChartDatas} from "../../shared/components/country-chart/country-chart.component";


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
  private olympicUrl: string = './assets/mock/olympic.json';
  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;
  public countryChartDatas!: CountryChartDatas

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: any) => i.country === countryName);
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry?.participations.map((i: any) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map((i: any) => i.year) ?? [];
          const medals = selectedCountry?.participations.map((i: any) => i.medalsCount.toString()) ?? [];
          this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          const nbAthletes = selectedCountry?.participations.map((i: any) => i.athleteCount.toString()) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
          this.countryChartDatas = {
            years: years,
            medals: medals
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }
}
