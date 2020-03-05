// import searchFormService from '../../../services/searchFormService.js';

// TODO remove this and use searchFormService from live data
import mockData from '../../../mockData/Tihany_Dombovar.js';

import idbService from '../../../services/idbService.js';

import pageState from '../../../state/pageState.js';

const template = document.createElement('template');

template.innerHTML = `
    <section id="search">
        <form id="search-form" novalidate>
            <input type="text" id="route_from" placeholder="Honnan?" autofocus autocomplete="off">
            <input type="text" id="route_to" placeholder="Hová?" autocomplete="off">
            <input type="date">
            <input type="time">

            <!-- TODO: REMOVE INLINE STYLE WHEN STYLED FROM SCSS -->
            <input style="display:block" type="submit" value="Keresés"></input>
        </form>
    </section>
`;

const registerComponent = () => {
    window.customElements.define(
        'search-page',
        class SearchPage extends HTMLElement {
            isValid;

            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                // TODO validation...
                this.isValid = true;
            }

            connectedCallback() {
                this.$form = this.root.querySelector('#search-form');
                this.$form.addEventListener('submit', this.handleSubmit.bind(this));

                this.inputs = {
                    $from: this.root.querySelector('input#route_from'),
                    $to: this.root.querySelector('input#route_to'),
                };

                pageState.routes.value.savedRoutes.handlers = [
                    event => SearchPage.dispatchRoutesUpdate(event),
                ];
            }

            async handleSubmit(event) {
                event.preventDefault();

                // TODO: Validation...
                if (this.isValid) {
                    const { $from, $to } = this.inputs;

                    const queryData = {
                        from: $from.value,
                        to: $to.value,
                    };

                    // LIVE DATA:
                    //  const result = await searchFormService.searchRoute(queryData);

                    // MOCK DATA:
                    const result = JSON.stringify(mockData);

                    SearchPage.processResponse(result, queryData);
                }
            }

            static dispatchRoutesUpdate(event) {
                document.dispatchEvent(
                    new CustomEvent('Routes::Update', {
                        detail: { ...event.newValue },
                    }),
                );
            }

            static async processResponse(result, { from, to }) {
                const savedRoutesList = await idbService.putRoute({
                    name: `${from} - ${to}`,
                    result,
                });

                pageState.routes.value.savedRoutes = [...savedRoutesList];
            }
        },
    );
};

const init = async () => {
    registerComponent();
};

init();
