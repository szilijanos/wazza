const template = document.createElement('template');

template.innerHTML = `
    <section id="search">
        <form id="searchForm" novalidate>
            <input type="text" id="route_from" placeholder="Honnan?" autofocus>
            <input type="text" id="route_to" placeholder="Hová?">
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
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));
            }
        },
    );
};

const init = async () => {
    registerComponent();
};

init();
