import {inject, Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);
  isDesktop = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Tablet, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
}
