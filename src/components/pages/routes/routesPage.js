const template = document.createElement('template');

template.innerHTML = `
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
                    const $routeListItem = document.createElement('p');
                    // $routeListItem.item = { ...item };

                    // TODO - make a routeListItem component and use that
                    $routeListItem.textContent = item;

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
    registerComponent();
};

init();
