import mapperService from '../services/data-mapper-service.js'

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

    <div class="expanded-details"></div>
`;

const registerComponent = (dependencies) => {
    window.customElements.define(
        'schedule-item',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true))

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.appendChild(styleNode);
            }

            render() {
                // TODO make a service that builds up a state from the raw data, and get data from there
                const rawData = this.itemData.kifejtes_postjson.runs;
                const lastIndex = Object.keys(rawData).length - 1;

                const $ = (selector) => this.root.querySelector(selector);

                $('.departure > span.nro').textContent = String(this.itemData.nro + 1).padStart(2,'0');
                $('.departure > span.pref').innerHTML =
                    Object.values(rawData)
                        .reduce((acc, item) => {
                            const details = mapperService.route.getVehicleDetails(item);
                            return `${acc}<img alt="${details.type}" class="icon-${details.type}" src="./assets/icons/icon-${details.type}.svg"  width="15" height="20">`
                        }, '');

                $('.departure > span.city').textContent = mapperService.departure.getStationCity(rawData[0]);
                $('.departure > span.station').textContent = mapperService.departure.getStationName(rawData[0]);
                $('.departure > span.time').textContent = mapperService.departure.getTimeString(rawData[0]);
                $('.arrival > span.city').textContent =  mapperService.arrival.getStationCity(rawData[lastIndex]);
                $('.arrival > span.station').textContent =  mapperService.arrival.getStationName(rawData[lastIndex]);
                $('.arrival > span.time').textContent = mapperService.arrival.getTimeString(rawData[lastIndex]);

                const runDayInfo = () => Object.values(rawData).reduce(
                    (acc, item, index) => {
                        const current = mapperService.route.getDaysRunning(item);
                        const regexDailyAndWorkdaysOnly = /naponta|munkanapokon/;

                        if (regexDailyAndWorkdaysOnly.test(current) && (index === 0 || acc === current)) {
                            return current;
                        }

                        return 'lásd részletek...';
                    }, ''
                );

                $('.short-details > span.transfer').innerHTML = `
                    <span class="transferNr">
                        ${lastIndex} átszállás
                    </span> | ${runDayInfo()}`;

                const getVehicleBoxMarkup = (item) => {
                    const currentVehicle = mapperService.route.getVehicleDetails(item);

                    return `<div class="vehicleBox ${currentVehicle.type}">
                                ${currentVehicle.lineNumber}
                            </div>`
                }

                $('.short-details > div.vehicleDiv').innerHTML =
                    Object.values(rawData)
                        .reduce((acc, item) => {
                            if (mapperService.route.isLocalTransportNecessaryAfter(item)) {
                                return `${acc}
                                        ${getVehicleBoxMarkup(item)}
                                        <div class="vehicleBox local">Helyi</div>
                                        `.trim()
                            }

                            return `${acc}${getVehicleBoxMarkup(item)}`
                        },'');

                const totalDistance = mapperService.route.getTotalDistance(Object.values(rawData));
                $('.short-details > div.routemap').innerHTML =
                    Object.values(rawData)
                        .reduce((acc, item, index, arr) => {
                            if (arr.length === 1) {
                                return {
                                    html: `<div class="line" style="width: 100%"></div>`
                                };
                            }

                            const itemDistance = mapperService.route.getDistance(item);

                            if (index === 0) {
                                const currentOffset = itemDistance;
                                const progressPercentage = currentOffset / totalDistance * 100;

                                return {
                                    dotLeftOffset: currentOffset,
                                    lineWidth: currentOffset,
                                    html: `<div class="line" style="width: ${progressPercentage}%"></div>
                                            <div class="dot"  style="left:  ${progressPercentage}%"></div>`
                                };
                            }

                            if (index < arr.length - 1) {
                                const currentOffset = acc.dotLeftOffset + itemDistance;

                                return {
                                    dotLeftOffset: currentOffset,
                                    lineWidth: itemDistance,
                                    html: `${acc.html}
                                        <div class="line" style="width: ${itemDistance / totalDistance * 100}%"></div>
                                        <div class="dot" style="left: ${currentOffset / totalDistance * 100}%"></div>`
                                };
                            }

                            return {
                                html: `${acc.html}
                                        <div class="line" style="width : ${itemDistance / totalDistance * 100}%"></div>`
                            };
                        },
                        null).html;

                $('.short-details > span.traveldata').textContent = `
                    ${totalDistance.toFixed(Number.isInteger(totalDistance) ? 0 : 1)} km — ${mapperService.route.getTotalTimeString(Object.values(rawData)).split(':').reduce((acc, time, index) => `${acc} ${ index === 0 ? Number(time) : time} ${['óra', 'perc'][index]}`, '')}`;

                const $expandedDetails = $('div.expanded-details');
                const $scheduleItem = $('.schedule-item-container');

                $scheduleItem.addEventListener('click', () => {
                    const haveDetailsExpandedClass = [...$expandedDetails.classList].some((cls) => cls === 'expanded');

                    window.requestAnimationFrame(() => {
                        $expandedDetails.classList.toggle('expanded', !haveDetailsExpandedClass)
                    });
                });

                const buildDepartureLine = (item, index) => `
                    <div class="left">
                        <div class="time">
                            <strong>${mapperService.departure.getTimeString(item)}</strong>
                            ${index === 0 ? '<br>Indulás' : ''}
                        </div>
                    </div>
                    <div class="middle">
                        <div class="city">${mapperService.departure.getStationCity(item)}</div>
                        <div class="station">${mapperService.departure.getStationName(item)}</div>
                        <div class="step-info">
                            <div class="duration">
                                ${mapperService.route.getDistance(item)} km
                                <br>
                                ${mapperService.route.getDurationInMinutes(item)} perc
                            </div>
                            <div></div>
                            <div class="cl"></div>
                            <div class="operator"></div>
                        </div>
                    </div>
                    <div class="right"></div>
                `;

                const buildTransferLine = (item) => `
                    <div class="left">
                        <div class="time">
                            <strong>${mapperService.arrival.getTimeString(item)}</strong>
                        </div>
                    </div>
                    <div class="middle">
                        <div class="step-details">
                            <div class="city">
                                ${mapperService.arrival.getStationCity(item)}
                            </div>
                            <div class="station">
                                ${mapperService.arrival.getStationName(item)}
                            </div>
                        </div>
                    </div>
                    <div class="right"></div>
                `;

                const buildTerminusLine = (item) => `
                    <div class="left">
                        <div class="time">
                            <strong>${mapperService.arrival.getTimeString(item)}</strong>
                            <br>Érkezés
                        </div>
                    </div>
                    <div class="middle">
                        <div class="step-details">
                            <div class="city">
                                ${mapperService.arrival.getStationCity(item)}
                            </div>
                            <div class="station">
                                ${mapperService.arrival.getStationName(item)}
                            </div>
                        </div>
                    </div>
                    <div class="right"></div>
                `;

                const buildDetails = (acc, item, index, arr) => {
                    const isFirstStep = index === 0;
                    const isLastStep = index === arr.length - 1;
                    const isOneBeforeLastStep = index === arr.length - 2;
                    const isMultipleStepsTravel = arr.length > 1;
                    const isInterimStep = isMultipleStepsTravel && !isLastStep;

                    return `
                        ${acc}
                        ${isFirstStep ? `<div class="step departure-station">${buildDepartureLine(item, index)}</div>` : ''}
                        ${(isFirstStep && isMultipleStepsTravel) ? `<div class="step transfer">${buildTransferLine(item, index)}</div>` : ''}

                        ${isInterimStep ? `
                                <div class="step interim">
                                    ${buildDepartureLine(arr[index + 1], index + 1)}
                                </div>
                                ${isOneBeforeLastStep ? '' : `<div class="step transfer">
                                    ${buildTransferLine(item, index)}
                                </div>`}
                            ` : ''}

                        ${isLastStep ? `<div class="step terminus">${buildTerminusLine(item, index)}</div>` : ''}
                    `;
                }

                const stepsMarkup = Object.values(rawData)
                    .reduce((acc, item, index, arr) => buildDetails(acc, item, index, arr), '');

                $expandedDetails.innerHTML = `
                    <div class="travel-steps">
                        ${stepsMarkup}
                    </div>`;
            }

            set item(value) {
                this.itemData = value;
                this.render();
            }
        }
    );
}

const init = async () => {
    if (!window.customElements.get('schedule-item')) {
        const style = await fetch('./assets/css/scheduleItemStyles.css')
            .then(response => response.text());

        registerComponent({style});
    }
}

init();
