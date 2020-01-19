import './resultsHeader.mjs';
import './scheduleItem.mjs';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ul {
            padding-inline-start: 0;
        }
    </style>

    <results-header></results-header>

    <div id="results-list-body">
        <ul></ul>
    </div>
`;

window.customElements.define(
    'app-schedules',
    class extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this.$currentDaySchedulesList = this._shadowRoot.querySelector(
                '#results-list-body > ul',
            );
        }

        _renderCurrentDaySchedules() {
            this.$currentDaySchedulesList.innerHTML = '';

            Object.values(this._schedules).forEach((item, index) => {
                const $scheduleItem = document.createElement('schedule-item');
                $scheduleItem.nro = String(index).padStart(2,'0');

                this.$currentDaySchedulesList.appendChild($scheduleItem);
            });
        }

        set schedules(schedules) {
            this._schedules = schedules;
            this._renderCurrentDaySchedules();
        }

        get schedules() {
            return this._schedules;
        }
    },
);
