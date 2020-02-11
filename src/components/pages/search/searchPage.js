import searchFormService from '../../../services/searchFormService.js';

const template = document.createElement('template');

template.innerHTML = `
    <section id="search">
        <form id="search-form" novalidate>
            <input type="text" id="route_from" placeholder="Honnan?" autofocus autocomplete="off">
            <input type="text" id="route_to" placeholder="Hová?" autocomplete="off">
            <input type="date">
            <input type="time">
            <input type="submit" value="Keresés"></input>
        </form>
    </section>
`;

const registerComponent = () => {
    window.customElements.define(
        'search-page',
        class extends HTMLElement {
            isValid;

            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                // TODO validation...
                this.isValid = true;
            }

            handleSubmit(event) {
                event.preventDefault();

                // TODO...
                if (this.isValid) {
                    const { $from, $to } = this.inputs;

                    searchFormService.searchRoute({
                        from: $from.value,
                        to: $to.value,
                    });
                }
            }

            connectedCallback() {
                this.$form = this.root.querySelector('#search-form');
                this.$form.addEventListener('submit', this.handleSubmit.bind(this));

                this.inputs = {
                    $from: this.root.querySelector('input#route_from'),
                    $to: this.root.querySelector('input#route_to'),
                };
            }
        },
    );
};

const init = async () => {
    registerComponent();
};

init();
