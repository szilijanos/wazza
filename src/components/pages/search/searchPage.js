import searchFormService from '../../../services/searchFormService.js';
import idbService from '../../../services/idbService.js';

import { pageState } from '../../../state/pageState.js';

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
        class extends HTMLElement {
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
            }

            async handleSubmit(event) {
                event.preventDefault();

                // TODO...
                if (this.isValid) {
                    const { $from, $to } = this.inputs;

                    const queryData = {
                        from: $from.value,
                        to: $to.value,
                    };

                    const result = await searchFormService.searchRoute(queryData);

                    this.processResponse(result, queryData);
                }
            }

            dispatchRoutesUpdate(event) {
                document.dispatchEvent(
                    new CustomEvent('Routes::Update', {
                        detail: { ...event.newValue },
                    }),
                );
                console.log(this, event.newValue);
            }

            async processResponse(result, { from, to }) {
                const savedRoutesList = await idbService.add({
                    name: `${from} - ${to}`,
                    result,
                });

                pageState.routes.value.savedRoutes.handlers = [
                    event => this.dispatchRoutesUpdate(event),
                ];
                pageState.routes.value.savedRoutes = [...savedRoutesList];
                console.log(this);
            }
        },
    );
};

const init = async () => {
    registerComponent();
};

init();
