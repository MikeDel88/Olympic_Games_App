
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {OlympicApi} from "../apis/olympic-api.api";
import {Olympic, Olympics} from "../../models/olympic/olympic.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly olympicApi = inject(OlympicApi)

  getOlympics(): Observable<Olympics>{
    return this.olympicApi.getAll()
  }

  getOlympic(countryId: number): Observable<Olympic | undefined> {
    return this.olympicApi.get(countryId)
  }

}








