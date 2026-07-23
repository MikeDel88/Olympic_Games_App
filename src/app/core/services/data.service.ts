
import { Injectable, inject } from '@angular/core';
import {Observable, tap} from 'rxjs';
import {OlympicApi} from "../apis/olympic-api.api";
import {Olympic, Olympics} from "../../models/olympic/olympic.model";
import {sortByLeaders} from "../utils/olympic.utils";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly olympicApi = inject(OlympicApi)

  getOlympics(): Observable<Olympics>{
    return this.olympicApi.getAll().pipe(
      tap(results => results.sort(sortByLeaders))
    )
  }

  getOlympic(countryId: number): Observable<Olympic | undefined> {
    return this.olympicApi.get(countryId)
  }

}








