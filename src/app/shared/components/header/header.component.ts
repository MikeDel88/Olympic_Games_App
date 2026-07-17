import { Component, input, InputSignal } from '@angular/core';
import {HeaderInfos, HeaderInfosComponent} from "../header-infos/header-infos.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HeaderInfosComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    titlePage: InputSignal<string> = input.required<string>()
    infos: InputSignal<HeaderInfos[]> = input.required<HeaderInfos[]>()
}
