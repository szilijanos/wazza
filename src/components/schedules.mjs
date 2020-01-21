import './resultsHeader.mjs';
import './scheduleItem.mjs';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ul {
            padding-inline-start: 0;
        }

        li {
            list-style-type: none;
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
                const $li = document.createElement('li');
                const $scheduleItem = document.createElement('schedule-item');
                $li.appendChild($scheduleItem)
                $scheduleItem.setAttribute('nro', String(index + 1).padStart(2,'0'));

                this.$currentDaySchedulesList.appendChild($li);
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
