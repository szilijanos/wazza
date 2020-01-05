import './components/header.js';
import './components/footer.js';
import './components/schedules.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            max-width: 800px;
            min-width: 600px;
            margin: 0 auto;
            display: block;
            background-color: #383842;
            border: 2px solid #606068;
            box-shadow: 0 5px 10px rgba(0,0,0,0.5);
        }
    </style>

    <app-header></app-header>

    <main>
        <app-schedules></app-schedules>
    </main>

    <app-footer></app-footer>
`;

export class App extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$schedules = this._shadowRoot.querySelector('app-schedules');
    }

    connectedCallback() {
        // Importing temporary development mocks' - to be removed when app is capable to access live data
        (async () => {
            const result = await import('../mockData/singleDaySchedules.js').then(
                _module => _module.default,
            );
            this.$schedules.schedules = result.results.talalatok;
        })();
    }
}

window.customElements.define('my-schedules-app', App);
