import idbService from '../../../services/idbService.js';

import pageState from '../../../state/pageState.js';

const template = document.createElement('template');
template.innerHTML = `
    <div class='route'>

    </div>
`;

const registerComponent = dependencies => {
    window.customElements.define(
        'route-item',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.prepend(styleNode);

                this.$routeItem = this.root.querySelector('.route');
            }

            connectedCallback() {
                this.$routeItem.addEventListener('click', this.showSchedulesForRoute.bind(this));

                pageState.schedules.value.selectedRouteSchedules.handlers = [
                    event => this.dispatchSchedulesUpdate(event),
                ];
            }

            disconnectedCallback() {
                this.$routeItem.removeEventListener('click', this.showSchedulesForRoute.bind(this));
            }

            dispatchSchedulesUpdate(event) {
                document.dispatchEvent(
                    new CustomEvent('SelectedSchedule::Update', {
                        detail: { ...event.newValue },
                    }),
                );
                console.log(this, event.newValue);
            }

            showSchedulesForRoute() {
                // TODO
                idbService.getRouteSchedules(this.itemData).then(schedules => {
                    const parsedResult = Object.values(
                        JSON.parse(schedules.result).results.talalatok,
                    );
                    pageState.schedules.value.selectedRouteSchedules = [...parsedResult];

                    console.log(pageState.schedules.value.selectedRouteSchedules);
                });
            }

            render() {
                const htmlContent = this.itemData;
                this.$routeItem.innerHTML = htmlContent;
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
