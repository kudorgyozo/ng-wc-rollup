import './polyfills';
import {
  enableProdMode,
  NgModuleRef,
  ApplicationRef,
  NgZone,
  InjectionToken,
  ComponentRef
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

class WrapperWebComponent extends HTMLElement {

  appComponentRef: ComponentRef<AppComponent> = null;
  ngZone: NgZone;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['counter'];
  }

  get counter(): number {
    return Number.parseInt(this.getAttribute('counter'));
  }

  set counter(value) {
    this.setAttribute('counter', value.toString());
  }

  /**
   * callback, called when the element is added to the page
   */
  connectedCallback() {
    this.setup();
  }

  /**
   * called when an attribute changes
   */
  attributeChangedCallback(name, oldValue, newValue) {
    //TODO: probably wait for angular to finish
    if (this.appComponentRef) {
      this.ngZone.run(() => {
        this.appComponentRef.instance.counter = this.counter;
      });
    }
  }

  setup() {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(':host { height: 100%; display: block; }'));
    this.shadowRoot.appendChild(style);

    const appElement = document.createElement('app-counter');

    Object.defineProperty(appElement, 'ownerDocument', { value: this.shadowRoot });
    appElement.setAttribute('id', 'app-component');
    //docFragment.appendChild(appElement);
    this.shadowRoot.appendChild(appElement);

    let that = this;

    platformBrowserDynamic().bootstrapModule(AppModule)
      .then((moduleRef: NgModuleRef<AppModule>) => {
        const app: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        const ngZone: NgZone = moduleRef.injector.get(NgZone);
        that.ngZone = ngZone;
        ngZone.run(() => {
          that.appComponentRef = app.bootstrap(AppComponent, appElement);
          that.appComponentRef.instance.counter = this.counter;
          that.appComponentRef.instance.countChanged.subscribe((count: number) => that.countChanged(count));
        });
      })
      .catch(err => console.error(err));
  }

  countChanged(count: number) {
    const event = new CustomEvent<number>('countChanged', { detail: count });  
    this.dispatchEvent(event);
    console.log(`count changed (wrapper-wc): ${count}`); 
  }
}

export default WrapperWebComponent;
