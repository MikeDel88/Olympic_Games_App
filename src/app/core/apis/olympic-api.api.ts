import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Olympic, Olympics} from "../../models/olympic/olympic.model";
import { Injectable, inject } from '@angular/core';
import {Observable, map, retry, catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OlympicApi {

  private readonly http = inject(HttpClient)

  private readonly olympicUrl: string = './assets/mock/olympic.json';

  getAll(): Observable<Olympics> {
    return this.http.get<Olympics>(this.olympicUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  get(countryId: number): Observable<Olympic | undefined> {
    return this.http.get<Olympics>(this.olympicUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
      .pipe(
        map(olympics => {
          return olympics.find(olympic => olympic.id === countryId)
        })
      )
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Une erreur est survenue lors de la requête."

    switch(error.status) {
      case 404: errorMessage = "Aucune donnée.";
      break;
      case 500: errorMessage = "Le serveur n'a pas répondu";
      break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
