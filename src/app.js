import './components/common/header.js';
import './components/common/footer.js';
import './components/pages/schedules/schedulesPage.js';
import './components/pages/search/searchPage.js';
import './components/pages/routes/routesPage.js';

import idbService from './services/idbService.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            width: 880px;
            margin: 0 auto;
            display: none;
            background-color: #383842;
            border: 2px solid #606068;
            box-shadow: 0 5px 10px rgba(0,0,0,0.5);
        }
    </style>

    <app-header></app-header>

    <main>
        <search-page></search-page>
        <routes-page></routes-page>
        <schedules-page></schedules-page>
    </main>

    <app-footer></app-footer>
`;

const registerComponent = () => {
    window.customElements.define(
        'my-schedules-app',
        class extends HTMLElement {
            constructor() {
                super();

                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));
            }

            connectedCallback() {
                window.requestAnimationFrame(() => {
                    this.style.display = 'block';
                });
            }
        },
    );
};

const init = async () => {
    if (!('serviceWorker' in navigator)) {
        // TODO: modal notification about the constraints this means
        console.log('Service Workers are not supported by your browser');
        return;
    }

    await navigator.serviceWorker.register('/src/service-worker.js')
        .catch((error) => {
        // TODO use this to notify the users the limitations this implies
            console.log('Service worker registration failed, error:', error);
        });

    if (!window.customElements.get('my-schedules-app')) {
        await idbService.getInstance();

        await Promise.all([
            customElements.whenDefined('app-header'),
            customElements.whenDefined('app-footer'),
            customElements.whenDefined('schedules-page'),
            customElements.whenDefined('search-page'),
            customElements.whenDefined('routes-page'),
        ]);

        registerComponent();
    }
};

init();
