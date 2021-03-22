import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationRef, Inject, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {
  constructor(@Inject(ApplicationRef)public appRef: ApplicationRef) {}
  public ngDoBootstrap(appRef: ApplicationRef) {} // override base bootstrap, don't remove this :)
}
