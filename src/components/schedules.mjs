import './resultsHeader.mjs';

const template = document.createElement('template');
template.innerHTML = `
    <results-header></results-header>
    <div id="current-schedules">
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
                '#current-schedules > ul',
            );
        }

        _renderCurrentDaySchedules() {
            this.$currentDaySchedulesList.innerHTML = '';

            Object.values(this._schedules).forEach(schedule => {
                const $scheduleItem = document.createElement('li');
                $scheduleItem.innerText = `${schedule.departureCity}, ${schedule.departureStation} - ${schedule.arrivalCity}, ${schedule.arrivalStation}`;
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
