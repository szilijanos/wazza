import './routeItem.js';

import idbService from '../../../services/idbService.js';

const template = document.createElement('template');

template.innerHTML = `
    <style>
        ul {
            padding-inline-start: 0;
            margin-block-start:   0;
            margin-block-end:     0;
        }

        li {
            list-style-type: none;
        }
    </style>

    <section id="routes"></section>
`;

const registerComponent = () => {
    window.customElements.define(
        'routes-page',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                this.$routesSection = this.root.querySelector('#routes');
                this.routesListData = [];
            }

            connectedCallback() {
                this.$form = this.root.querySelector('#routes-form');

                idbService.getRoutesList().then(list => {
                    this.routesListUpdateHandler({ detail: list });
                });

                document.addEventListener(
                    'Routes::Update',
                    this.routesListUpdateHandler.bind(this),
                );
            }

            disconnectedCallback() {
                document.removeEventListener(
                    'Routes::Update',
                    this.routesListUpdateHandler.bind(this),
                );
            }

            routesListUpdateHandler({ detail }) {
                console.log(detail);
                this.routesListData = detail;
                this.render();
            }

            render() {
                this.$routesSection.innerHTML = '';
                const $ul = document.createElement('ul');

                Object.values(this.routesListData).forEach(item => {
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
        await customElements.whenDefined('route-item');

        registerComponent();
    }
};

init();
