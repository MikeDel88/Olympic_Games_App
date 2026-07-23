import {inject, Injectable, Signal} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  isDesktop: Signal<boolean> = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Tablet, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map((result: BreakpointState): boolean => result.matches)),
    { initialValue: false }
  );
}
