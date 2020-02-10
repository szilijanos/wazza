import './components/header.js';
import './components/footer.js';
import './components/schedules.js';
import './components/pages/searchPage.js';

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
        <!-- temporary placement of both pages until developed -->
        <!-- <search-page></search-page> -->
        <app-schedules></app-schedules>
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
                const $currentDaySchedulesList = this.root.querySelector('app-schedules');

                // Importing temporary development mocks' - to be removed when app is capable to access live data
                (async () => {
                    const result = await import('./mockData/Tihany_Dombovar.js').then(
                        module => module.default,
                    );

                    this.$schedules = $currentDaySchedulesList;
                    this.$schedules.schedules = result.results.talalatok;

                    window.requestAnimationFrame(() => {
                        this.style.display = 'block';
                    });
                })();
            }
        },
    );
};

const init = async () => {
    if (!('serviceWorker' in navigator)) {
        // TODO: modal notification about the constraints this means
        console.log(
            'Service Workers are not supported by your browser, thus only only features of this app are accesible',
        );
        return;
    }

    navigator.serviceWorker
        .register('/src/service-worker.js')
        .then(registration => {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(error => {
            // TODO use this to notify the users the limitations this implies
            console.log('Service worker registration failed, error:', error);
        });

    if (!window.customElements.get('my-schedules-app')) {
        await Promise.all([
            customElements.whenDefined('app-header'),
            customElements.whenDefined('app-footer'),
            customElements.whenDefined('app-schedules'),
            customElements.whenDefined('search-page'),
        ]);

        registerComponent();
    }
};

init();
