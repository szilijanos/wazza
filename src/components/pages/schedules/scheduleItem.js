import './scheduleItemDetails.js';

const template = document.createElement('template');
template.innerHTML = `
    <div class="schedule-item-container">

        <div class="departure list-cell">
            <span class="nro"></span>
            <span class="pref"></span>
            <span class="time"></span>
            <span class="city"></span>
            <span class="station"></span>
            <span class="toggle" data-tooltip="Útvonal részletei..."></span>
        </div>

        <div class="short-details list-cell">
            <span class="transfer">
                <span class="transferNr"></span>
            </span>
            <div class="vehicleDiv">
                <div class="vehicleBox train">803</div>
                <div class="vehicleBox local">Helyi</div>
                <div class="vehicleBox train">Z70</div>
            </div>
            <div class="routemap"></div>
            <span class="traveldata"></span>
        </div>

        <div class="arrival list-cell">
            <span class="time"></span>
            <span class="city"></span>
            <span class="station"></span>
            <div class="right_corner_info">
                <span class="icons">
                    <span class="icon_ic" data-tooltip="Intercity járat"></span>
                </span>
            </div>
        </div>

    </div>

    <schedule-item-details></schedule-item-details>
`;

const registerComponent = (dependencies) => {
    window.customElements.define(
        'schedule-item',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.prepend(styleNode);

                this.$details = this.root.querySelector('schedule-item-details');
                this.$scheduleItem = this.root.querySelector('.schedule-item-container');

                // TODO make expanded to be a custom attribute
                this.expandDetails = () => {
                    const haveDetailsExpandedClass = [...this.$details.classList].some(
                        (className) => className === 'expanded'
                    );

                    window.requestAnimationFrame(() => {
                        this.$details.classList.toggle('expanded', !haveDetailsExpandedClass);
                    });
                };
            }

            connectedCallback() {
                this.$scheduleItem.addEventListener('click', this.expandDetails);
            }

            disconnectedCallback() {
                this.$scheduleItem.removeEventListener('click', this.expandDetails);
            }

            render() {
                const lastIndex = Object.keys(this.itemData.route.steps).length - 1;

                // TODO: move this into utils
                const $ = (selector) => this.root.querySelector(selector);

                $('.departure > span.nro').textContent = String(this.itemData.nro + 1).padStart(2, '0');

                $('.departure > span.pref').innerHTML = this.itemData.route.steps.reduce(
                    (acc, step) => {
                        const { vehicleDetails } = step;
                        return `${acc}<img alt="${vehicleDetails.type}" class="icon-${vehicleDetails.type}" src="./assets/icons/icon-${vehicleDetails.type}.svg"  width="15" height="20">`;
                    },
                    '',
                );

                $('.departure > span.city').textContent = this.itemData.departure.city;
                $('.departure > span.station').textContent = this.itemData.departure.station;
                $('.departure > span.time').textContent = this.itemData.departure.timeString;

                $('.arrival > span.city').textContent = this.itemData.arrival.city;
                $('.arrival > span.station').textContent = this.itemData.arrival.station;

                $('.arrival > span.time').textContent = this.itemData.arrival.timeString;

                $('.short-details > span.transfer').innerHTML = `
                    <span class="transferNr">
                        ${lastIndex} átszállás
                    </span> | ${this.itemData.route.daysRunning}`;

                const getVehicleBoxMarkup = (step) => {
                    const { type, lineNumber } = step.vehicleDetails;

                    return `<div class="vehicleBox ${type}">
                                ${lineNumber}
                            </div>`;
                };

                $('.short-details > div.vehicleDiv').innerHTML = this.itemData.route.steps.reduce(
                    (acc, step) => {
                        if (step.isLocalTransportNecessaryAfter) {
                            return `${acc}
                                    ${getVehicleBoxMarkup(step)}
                                    <div class="vehicleBox local">Helyi</div>
                                    `.trim();
                        }

                        return `${acc}${getVehicleBoxMarkup(step)}`;
                    },
                    '',
                );

                const { totalDistance } = this.itemData.route;

                $('.short-details > div.routemap').innerHTML = Object.values(this.itemData.route.steps).reduce(
                    (acc, item, index, arr) => {
                        if (arr.length === 1) {
                            return {
                                html: '<div class="line" style="width: 100%"></div>',
                            };
                        }

                        const itemDistance = item.distance;

                        if (index === 0) {
                            const currentOffset = itemDistance;
                            const progressPercentage = (currentOffset / totalDistance) * 100;

                            return {
                                dotLeftOffset: currentOffset,
                                lineWidth: currentOffset,
                                html: `
                                    <div class="line" style="width: ${progressPercentage}%"></div>
                                    <div class="dot"  style="left:  ${progressPercentage}%"></div>`,
                            };
                        }

                        if (index < arr.length - 1) {
                            const currentOffset = acc.dotLeftOffset + itemDistance;

                            return {
                                dotLeftOffset: currentOffset,
                                lineWidth: itemDistance,
                                html: `${acc.html}
                                        <div class="line" style="width: ${(itemDistance /
                                            totalDistance) *
                                            100}%"></div>
                                        <div class="dot" style="left: ${(currentOffset /
                                            totalDistance) *
                                            100}%"></div>`,
                            };
                        }

                        return {
                            html: `${acc.html}<div class="line" style="width : ${(itemDistance /
                                totalDistance) *
                                100}%"></div>`,
                        };
                    },
                    null,
                ).html;

                const getTravelSummaryData = () => {
                    const km = totalDistance.toFixed(Number.isInteger(totalDistance) ? 0 : 1);
                    const duration = this.itemData.route.totalTime
                        .split(':')
                        .reduce(
                            (acc, time, index) => `${acc} ${index === 0 ? Number(time) : time} ${
                                ['óra', 'perc'][index]
                            }`,
                            '',
                        );

                    return `${km} km — ${duration}`;
                };

                $('.short-details > span.traveldata').textContent = getTravelSummaryData();
            }

            set item(value) {
                this.itemData = value;
                this.render();
                this.$details.details = value; // TODO separate from value, what really is needed for the details
            }
        },
    );
};

const init = async () => {
    if (!window.customElements.get('schedule-item')) {
        const style =
            await fetch('./assets/css/scheduleItemStyles.css')
                .then((res) => res.text());

        // Can't this be lazy loaded on first open/expand?
        await customElements.whenDefined('schedule-item-details');

        registerComponent({ style });
    }
};

init();
