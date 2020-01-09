const template = document.createElement('template');
template.innerHTML = `
    <style>
        div.results-header-row {
            display: flex;
            flex-direction: row;
            background-color: #f2f4f6;
            height: 21px;
        }

        div.results-header-cell {
            flex: 1;
            color: #9D9FA2;
            font-size: 13px;
            line-height: 20px;
            text-align: center;
        }
    </style>

    <div class='results-header-row'>
        <div class='results-header-cell'>indulás</div>
        <div class='results-header-cell'>információk</div>
        <div class='results-header-cell'>érkezés</div>
    </div>
`;

export class ResultsHeader extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('results-header', ResultsHeader);
