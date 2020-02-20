import mapperService from '../../../services/dataMapperService.js';

const template = document.createElement('template');

const registerComponent = dependencies => {
    window.customElements.define(
        'schedule-item-details',
        class extends HTMLElement {
            constructor() {
                super();
                this.root = this.attachShadow({ mode: 'open' });
                this.root.appendChild(template.content.cloneNode(true));

                const styleNode = document.createElement('style');
                styleNode.innerHTML = dependencies.style;
                this.root.prepend(styleNode);
            }

            render() {
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

                const buildTransferLine = item => `
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

                const buildTerminusLine = item => `
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
                        ${
                            isFirstStep
                                ? `<div class="step departure-station">${buildDepartureLine(
                                      item,
                                      index,
                                  )}</div>`
                                : ''
                        }
                        ${
                            isFirstStep && isMultipleStepsTravel
                                ? `<div class="step transfer">${buildTransferLine(
                                      item,
                                      index,
                                  )}</div>`
                                : ''
                        }

                        ${
                            isInterimStep
                                ? `
                            <div class="step interim">
                                ${buildDepartureLine(arr[index + 1], index + 1)}
                            </div>
                            ${
                                isOneBeforeLastStep
                                    ? ''
                                    : `<div class="step transfer">${buildTransferLine(
                                          item,
                                          index,
                                      )}</div>`
                            }
                        `
                                : ''
                        }

                        ${
                            isLastStep
                                ? `<div class="step terminus">${buildTerminusLine(
                                      item,
                                      index,
                                  )}</div>`
                                : ''
                        }
                    `;
                };

                const rawData = this.details.kifejtes_postjson.runs;
                const stepsMarkup = Object.values(rawData).reduce(
                    (acc, item, index, arr) => buildDetails(acc, item, index, arr),
                    '',
                );

                this.root.innerHTML += stepsMarkup;
            }

            connectedCallback() {
                this.render();
            }
        },
    );
};

const init = async () => {
    if (!window.customElements.get('schedule-item-details')) {
        const style = await fetch('./assets/css/scheduleItemDetailsStyles.css').then(response =>
            response.text(),
        );

        registerComponent({ style });
    }
};

init();
