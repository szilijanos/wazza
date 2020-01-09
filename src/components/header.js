const template = document.createElement('template');
template.innerHTML = `
    <header>
        Here comes the navbar
    </header>
`;

window.customElements.define(
    'app-header',
    class extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
        }
    },
);
