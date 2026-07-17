import { Component, input } from '@angular/core';
import {HeaderInfosComponent} from "../header-infos/header-infos.component";

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
    titlePage= input.required<string>()
    infos = input.required<{ label: string; count: number }[]>()
}
