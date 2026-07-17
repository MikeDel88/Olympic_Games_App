import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-infos',
  standalone: true,
  imports: [],
  templateUrl: './header-infos.component.html',
  styleUrl: './header-infos.component.scss'
})
export class HeaderInfosComponent {
    infos = input.required<HeaderInfos>();
}

export type HeaderInfos = {
  label: string,
  count: number
}
