const template = document.createElement('template');

template.innerHTML = `
    <section id="routes">
        <ul></ul>
    </section>
`;

const registerComponent = () => {
    window.customElements.define(
        'routes-page',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));
            }

            connectedCallback() {
                this.$form = this.root.querySelector('#routes-form');
            }
        },
    );
};

const init = async () => {
    registerComponent();
};

init();
