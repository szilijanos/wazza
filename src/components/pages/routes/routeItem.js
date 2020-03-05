import idbService from '../../../services/idbService.js';

import pageState from '../../../state/pageState.js';

const template = document.createElement('template');
template.innerHTML = `
    <div class='route'>
        <span class="description"></span>
        <button class="delete">Törlés</button>
    </div>
`;

const registerComponent = dependencies => {
    window.customElements.define(
        'route-item',
        class RouteItem extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.prepend(styleNode);

                this.$routeItem = this.root.querySelector('.route');
                this.$routeItemDescription = this.$routeItem.querySelector('span.description');
                this.$routeItemDeleteCta = this.$routeItem.querySelector('button.delete');
            }

            connectedCallback() {
                this.routeSelectedHandler = this.showSchedulesForRoute.bind(this);
                this.$routeItemDescription.addEventListener('click', this.routeSelectedHandler);

                this.routeDeleteHandler = this.deleteRoute.bind(this);
                this.$routeItemDeleteCta.addEventListener('click', this.routeDeleteHandler);

                pageState.schedules.value.selectedRouteSchedules.handlers = [
                    event => this.dispatchSchedulesUpdate(event),
                ];
            }

            disconnectedCallback() {
                this.$routeItemDescription.removeEventListener('click', this.routeSelectedHandler);
                this.$routeItemDeleteCta.removeEventListener('click', this.routeDeleteHandler);
            }

            static dispatchSchedulesUpdate(event) {
                document.dispatchEvent(
                    new CustomEvent('SelectedSchedule::Update', {
                        detail: { ...event.newValue },
                    }),
                );
            }

            showSchedulesForRoute() {
                // TODO
                idbService.getRouteSchedules(this.itemData).then(schedules => {
                    const parsedResult = Object.values(
                        JSON.parse(schedules.result).results.talalatok,
                    );
                    pageState.schedules.value.selectedRouteSchedules = [...parsedResult];

                    pageState.schedules.value.selectedRouteSchedules.handlers = [
                        event => RouteItem.dispatchSchedulesUpdate(event),
                    ];
                });
            }

            deleteRoute() {
                // TODO confirmation popup
                idbService.deleteRoute(this.itemData).then(schedules => {
                    pageState.routes.value.savedRoutes = [...schedules];
                });
            }

            render() {
                const htmlContent = this.itemData;
                this.$routeItemDescription.innerHTML = htmlContent;
            }

            set item(value) {
                this.itemData = value;
                this.render();
            }
        },
    );
};

const init = async () => {
    if (!window.customElements.get('route-item')) {
        const style = await fetch('./assets/css/routeItemStyles.css').then(response =>
            response.text(),
        );

        registerComponent({ style });
    }
};

init();
