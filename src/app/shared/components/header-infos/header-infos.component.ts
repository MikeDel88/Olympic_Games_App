import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-header-infos',
  standalone: true,
  imports: [],
  templateUrl: './header-infos.component.html',
  styleUrl: './header-infos.component.scss'
})
export class HeaderInfosComponent {
    infos: InputSignal<HeaderInfos> = input.required<HeaderInfos>();
}

export type HeaderInfos = {
  label: string,
  count: number
}
