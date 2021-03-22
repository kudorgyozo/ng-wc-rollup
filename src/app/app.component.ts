import { Component, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CounterContext } from 'src/CounterContext';

@Component({
  selector: 'app-counter',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-wc-rollup';

  constructor() {
  }

  @Input() counter = 0;
  @Output() countChanged = new EventEmitter<number>();

  inc() {
    this.counter++;
    this.countChanged.next(this.counter);
  }

  dec() {
    this.counter--;
    this.countChanged.next(this.counter);
  }
}
