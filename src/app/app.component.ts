import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-wc-rollup';

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
