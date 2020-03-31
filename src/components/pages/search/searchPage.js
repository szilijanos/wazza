import searchFormService from '../../../services/searchFormService.js';
import dataConversionService from '../../../services/dataConversionService.js';
import idbService from '../../../services/idbService.js';
import dateTimeService from '../../../services/dateTimeService.js';

// TODO remove this and use searchFormService from live data
// import mockData from '../../../mockData/Tihany_Dombovar.js';

import pageState from '../../../state/pageState.js';

const template = document.createElement('template');

template.innerHTML = `
    <section id="search">
        <form id="search-form" novalidate>
            <input type="text" id="routeFrom" placeholder="Honnan?" autofocus autocomplete="off">
            <input type="text" id="routeTo" placeholder="Hová?" autocomplete="off">
            <input type="date" id="routeDate">
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
                    $from: this.root.querySelector('input#routeFrom'),
                    $to: this.root.querySelector('input#routeTo'),
                    $date: this.root.querySelector('input#routeDate'),
                };

                this.inputs.$date.value = dateTimeService.date.tomorrow();

                pageState.routes.value.savedRoutes.handlers = [
                    (event) => SearchPage.dispatchRoutesUpdate(event)
                ];
            }

            async handleSubmit(event) {
                event.preventDefault();

                // TODO: Validation...
                if (this.isValid) {
                    const { $from, $to, $date } = this.inputs;

                    const queryData = {
                        from: $from.value,
                        to: $to.value,
                        date: $date.value
                    };

                    const result = dataConversionService.extract(
                        // LIVE DATA:
                        await searchFormService.searchRoute(queryData)

                        // MOCK DATA:
                        // JSON.stringify(mockData)
                    );

                    SearchPage.processResponse(result, queryData);
                }
            }

            static dispatchRoutesUpdate(event) {
                document.dispatchEvent(
                    new CustomEvent('Routes::Update', {
                        detail: {
                            ...event.newValue
                        }
                    })
                );
            }

            static async processResponse(result, { from, to, date }) {
                // Todo: proper async validation to city names
                const dateRegex = /^(\d{4}-\d{2}-\d{2})/;
                if (!dateRegex.test(date)
                    || from.length === 0
                    || to.length === 0) {
                    return;
                }

                pageState.routes.value.savedRoutes = [
                    ...(await idbService.putRoute({
                        name: `${date} - ${from} - ${to}`,
                        result: await result,
                    }))
                ];

                // TODO catch - handle unsuccessful case
            }
        }
    );
};

const init = async () => {
    registerComponent();
};

init();
