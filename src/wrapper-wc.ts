import './polyfills';
import {
  enableProdMode,
  NgModuleRef,
  ApplicationRef,
  NgZone,
  InjectionToken
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { CounterContext } from './CounterContext';

if (environment.production) {
  enableProdMode();
}

class WrapperWebComponent extends HTMLElement {
  wasRendered = false;

  constructor() {    
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['counter'];
  }

  get counter() {
    return this.getAttribute('counter');
  }

  set counter(value) {
    this.setAttribute('counter', value);
  }

  /**
   * Get the element to which the app component is attached to from the shadow root
   */
  get _appComponent() {
    return this.shadowRoot.querySelector('#app-component');
  }

  /**
   * bootstrap angular
   */
  async _bootstrapAngular() {
   
    const counterContext = new CounterContext();
    counterContext.counter = Number.parseInt(this.counter);

    return platformBrowserDynamic([
      { 
        provide: CounterContext,
        useValue: counterContext,
      }
    ]).bootstrapModule(AppModule);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.wasRendered) {
      this.render();
    }
  }

  render() {
    debugger;
    if (this.wasRendered) {
      const oldElement = this.shadowRoot.getElementById('app-counter');
      this.shadowRoot.removeChild(oldElement);
    }

    //const docFragment = document.createDocumentFragment();
    if (!this.wasRendered) {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.appendChild(document.createTextNode(':host { height: 100%; display: block; }'));
      this.shadowRoot.appendChild(style);
    }
    const appElement = document.createElement('app-counter');

    Object.defineProperty(appElement, 'ownerDocument', { value: this.shadowRoot });
    appElement.setAttribute('id', 'app-component');
    //docFragment.appendChild(appElement);
    this.shadowRoot.appendChild(appElement);

    this._bootstrapAngular()
      .then((moduleRef: NgModuleRef<AppModule>) => {
        const app: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        const ngZone: NgZone = moduleRef.injector.get(NgZone);
        ngZone.run(() => { 
          const compRef = app.bootstrap(AppComponent, this._appComponent);
        });
        this.wasRendered = true;
      })
      .catch(err => console.error(err));
  }
}

export default WrapperWebComponent;
