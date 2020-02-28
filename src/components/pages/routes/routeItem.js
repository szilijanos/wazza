import idbService from '../../../services/idbService.js';

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
            }

            disconnectedCallback() {
                this.$routeItem.removeEventListener('click', this.showSchedulesForRoute.bind(this));
            }

            showSchedulesForRoute() {
                // TODO
                idbService.getRouteSchedules(this.itemData).then(schedules => {
                    console.log(schedules);
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
