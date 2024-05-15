import { Component } from '@angular/core';
import { Languages } from './Components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angularcalendar';
  language = Languages.ENGLISH;
}
