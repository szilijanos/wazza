const template = document.createElement('template');
template.innerHTML = `
    <footer>
        version: x, last update: DD/MM/YYYY
    </footer>
`;

window.customElements.define('app-footer', class extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
});
