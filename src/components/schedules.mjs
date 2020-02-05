import './resultsHeader.mjs';
import './scheduleItem.mjs';

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
};

const init = async () => {
    if (!window.customElements.get('app-schedules')) {
        await Promise.all([
            customElements.whenDefined('results-header'),
            customElements.whenDefined('schedule-item'),
        ]);

        registerComponent();
    }
}

init();
