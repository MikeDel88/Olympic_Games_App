import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
    readonly message: InputSignal<string> = input.required<string>()
    readonly showSpinner: InputSignal<boolean> = input<boolean>(true)
}
