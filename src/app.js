import './components/header.js';
import './components/footer.js';
import './components/schedules.js';

const template = document.createElement('template');
template.innerHTML = `
    <app-header></app-header>

    <main>
        <app-schedules>
    </main>

    <app-footer></app-footer>
`;

export class App extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$schedules = this._shadowRoot.querySelector('app-schedules');
    }

    connectedCallback() {
        // Importing temporary development mocks' - to be removed when app is capable to access live data
        (async () => {
            const result = await import('../mockData/singleDaySchedules.js').then((_module) => _module.default)
            this.$schedules.schedules = result.results.talalatok;
        })();
    }
}

window.customElements.define('my-schedules-app', App);

