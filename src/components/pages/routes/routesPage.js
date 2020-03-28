import './routeItem.js';

import idbService from '../../../services/idbService.js';

const template = document.createElement('template');

template.innerHTML = '<section id="routes"></section>';

const registerComponent = (dependencies) => {
    window.customElements.define(
        'routes-page',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.prepend(styleNode);

                this.$routesSection = this.root.querySelector('#routes');
                this.routesListData = [];
            }

            connectedCallback() {
                this.$form = this.root.querySelector('#routes-form');
                this.routesListChangeHandler = this.routesListUpdateHandler.bind(this);

                idbService.getRoutesList()
                    .then((list) => {
                        this.routesListChangeHandler({
                            detail: list,
                        });
                    });

                document.addEventListener('Routes::Update', this.routesListChangeHandler);
            }

            disconnectedCallback() {
                document.removeEventListener('Routes::Update', this.routesListChangeHandler);
            }

            routesListUpdateHandler({ detail }) {
                this.routesListData = detail;
                this.render();
            }

            render() {
                this.$routesSection.innerHTML = '';
                const $ul = document.createElement('ul');

                Object.values(this.routesListData).forEach((item) => {
                    const $li = document.createElement('li');
                    const $routeListItem = document.createElement('route-item');
                    $routeListItem.item = item;

                    $li.appendChild($routeListItem);
                    $ul.appendChild($li);
                });

                requestAnimationFrame(() => {
                    this.$routesSection.appendChild($ul);
                });
            }
        },
    );
};

const init = async () => {
    if (!window.customElements.get('routes-page')) {
        const style =
            await fetch('./assets/css/routePageStyles.css')
                .then((response) => response.text());

        registerComponent({ style });
    }
};

init();
