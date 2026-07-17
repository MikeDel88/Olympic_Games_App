import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-infos',
  standalone: true,
  imports: [],
  templateUrl: './header-infos.component.html',
  styleUrl: './header-infos.component.scss'
})
export class HeaderInfosComponent {
    label = input.required<string>();
    count = input.required<number>();
}
