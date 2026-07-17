import { HttpClient } from '@angular/common/http';
import {Olympic, Olympics} from "../../models/olympic/olympic.model";
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OlympicApi {

  private readonly http = inject(HttpClient)

  private readonly olympicUrl: string = './assets/mock/olympic.json';

  getAll(): Observable<Olympics> {
    return this.http.get<Olympics>(this.olympicUrl)
  }

  get(country: string): Observable<Olympic | undefined> {
    return this.http.get<Olympics>(this.olympicUrl)
      .pipe(
        map(olympics => {
          return olympics.find(olympic => olympic.country === country)
        })
      )
  }
}
