(async () => {
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
            <app-schedules></app-schedules>
        </main>

        <app-footer></app-footer>
    `;

    const registerComponent = () => {
        if (!window.customElements.get('my-schedules-app')){
            window.customElements.define('my-schedules-app',
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
                            const result = await import('../mockData/Kkhalas_Budapest.js').then(
                                (module) => module.default,
                            );

                            this.$schedules = $currentDaySchedulesList;

                            this.$schedules.schedules = result.results.talalatok;

                            window.requestAnimationFrame(() => {
                                this.style.display = 'block';
                            });
                        })();
                    }
                }
            );
        }
    };

    await import('./components/header.js');
    await import('./components/footer.js');
    await import('./components/schedules.mjs')
        .then((module) => module.componentDefinedPromise)
        .then(registerComponent)
})();
