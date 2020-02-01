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

    <results-header></results-header>

    <div id="results-list-body"></div>
`;



const registerComponent = () => {
    if (!window.customElements.get('app-schedules')) {
        window.customElements.define(
            'app-schedules',
            class extends HTMLElement {
                constructor() {
                    super();
                    this.root = this.attachShadow({ mode: 'open' });
                    this.root.appendChild(template.content.cloneNode(true));
                }

                connectedCallback() {
                    this.$currentDaySchedulesList = this.root.querySelector('#results-list-body');
                }

                render() {
                    this.$currentDaySchedulesList.innerHTML = '';
                    const $ul = document.createElement('ul');

                    this.schedulesList.forEach((item, index) => {
                        const $li = document.createElement('li');
                        const $scheduleItem = document.createElement('schedule-item');
                        $scheduleItem.item = { nro: index, ...item };

                        $li.appendChild($scheduleItem)
                        $ul.appendChild($li);
                    });

                    this.$currentDaySchedulesList.appendChild($ul);
                }

                set schedules(_schedules) {
                    this.schedulesList = Object.values(_schedules);
                    this.render();
                }
            }
        );
    }

    return Promise.resolve();
};

export const componentDefinedPromise = new Promise((resolve) => {
    (async () => {
        await import('./resultsHeader.mjs');

        return import('./scheduleItem.mjs')
            .then((module) => module.componentDefinedPromise)
            .then(registerComponent)
            .then(resolve);
    })();
});
