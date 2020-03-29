import idbService from '../../../services/idbService.js';

import pageState from '../../../state/pageState.js';

const template = document.createElement('template');
template.innerHTML = `
    <div class='route'>
        <span class="date"></span>
        <span class="description"></span>
        <button class="delete">Törlés</button>
    </div>
`;

const registerComponent = (dependencies) => {
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
                this.$routeItemDate = this.$routeItem.querySelector('span.date');
                this.$routeItemDeleteCta = this.$routeItem.querySelector('button.delete');
            }

            connectedCallback() {
                this.routeSelectedHandler = this.showSchedulesForRoute.bind(this);
                this.$routeItemDescription.addEventListener('click', this.routeSelectedHandler);

                this.routeDeleteHandler = this.deleteRoute.bind(this);
                this.$routeItemDeleteCta.addEventListener('click', this.routeDeleteHandler);

                pageState.schedules.value.selectedRouteSchedules.handlers = [
                    (event) => RouteItem.dispatchSchedulesUpdate(event)
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
                idbService.getRouteSchedules(this.itemData)
                    .then((schedules) => {
                        pageState.schedules.value.selectedRouteSchedules = schedules.result;

                        pageState.schedules.value.selectedRouteSchedules.handlers = [
                            (event) => RouteItem.dispatchSchedulesUpdate(event)
                        ];
                    });
            }

            deleteRoute() {
                // TODO confirmation popup
                idbService.deleteRoute(this.itemData.key)
                    .then((schedules) => {
                        pageState.routes.value.savedRoutes = [...schedules];
                    });
            }

            render() {
                const { dateContent, descriptionContent } = this.itemData;

                this.$routeItemDescription.textContent = descriptionContent;
                this.$routeItemDate.textContent = dateContent;
            }

            set item(value) {
                // e.g.: 2020-01-01 - from - to
                const result = value.match(/^(\d{4}-\d{2}-\d{2}) - (.*)$/);
                if (!result) {
                    return;
                }

                const [key, dateContent, descriptionContent] = result;
                this.itemData = { key, dateContent, descriptionContent };
                this.render();
            }
        },
    );
};

const init = async () => {
    if (!window.customElements.get('route-item')) {
        const style =
            await fetch('./assets/css/routeItemStyles.css')
                .then((response) => response.text());

        registerComponent({ style });
    }
};

init();
