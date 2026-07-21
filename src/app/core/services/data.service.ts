
import { Injectable, inject } from '@angular/core';
import {Observable, tap} from 'rxjs';
import {OlympicApi} from "../apis/olympic-api.api";
import {Olympic, Olympics} from "../../models/olympic/olympic.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly olympicApi = inject(OlympicApi)

  getOlympics(): Observable<Olympics>{
    return this.olympicApi.getAll().pipe(
      tap(results => {
        results.sort(this.sortByCountry)
      })
    )
  }

  getOlympic(countryId: number): Observable<Olympic | undefined> {
    return this.olympicApi.get(countryId)
  }

  sortByCountry = (a:Olympic, b: Olympic) => {
    const olympicA = a.country.toLocaleUpperCase();
    const olympicB = b.country.toLocaleUpperCase();
    return (olympicA < olympicB) ? -1 : (olympicA > olympicB) ? 1 : 0;
  }

}








