const template = document.createElement('template');

const registerComponent = (dependencies) => {
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
                            <strong>${item.departure.timeString}</strong>
                            ${index === 0 ? '<br>Indulás' : ''}
                        </div>
                    </div>
                    <div class="middle">
                        <div class="city">
                            ${item.departure.city}
                        </div>
                        <div class="station">
                            ${item.departure.station}
                        </div>
                        <div class="step-info">
                            <div class="duration">
                                ${item.distance} km
                                <br>
                                ${item.durationInMinutes} perc
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
                            <strong>${item.arrival.timeString}</strong>
                        </div>
                    </div>
                    <div class="middle">
                        <div class="step-details">
                            <div class="city">
                                ${item.arrival.city}
                            </div>
                            <div class="station">
                                ${item.arrival.station}
                            </div>
                        </div>
                    </div>
                    <div class="right"></div>
                `;

                const buildTerminusLine = (item) => `
                    <div class="left">
                        <div class="time">
                            <strong>${item.arrival.timeString}</strong>
                            <br>Érkezés
                        </div>
                    </div>
                    <div class="middle">
                        <div class="step-details">
                            <div class="city">
                                ${item.arrival.city}
                            </div>
                            <div class="station">
                                ${item.arrival.station}
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

                    const getFirstStepMarkup = () => {
                        if (isFirstStep) {
                            return `
                                <div class="step departure-station">
                                    ${buildDepartureLine(item, index)}</div>
                                `;
                        }
                        return '';
                    };

                    const getTransferStepMarkup = () => {
                        if (isFirstStep && isMultipleStepsTravel) {
                            return `
                                <div class="step transfer">
                                    ${buildTransferLine(item)}
                                </div>
                            `;
                        }
                        return '';
                    };

                    const getNotTheOneBeforeLastStepMarkup = () => {
                        if (!isOneBeforeLastStep) {
                            return `
                                <div class="step transfer">
                                    ${buildTransferLine(arr[index + 1])}
                                </div>
                            `;
                        }
                        return '';
                    };

                    const getInterimStepMarkup = () => {
                        if (isInterimStep) {
                            return `
                                <div class="step interim">
                                    ${buildDepartureLine(arr[index + 1], index + 1)}
                                </div>
                                ${getNotTheOneBeforeLastStepMarkup()}
                            `;
                        }
                        return '';
                    };

                    const getLastStepMarkup = () => {
                        if (isLastStep) {
                            return `
                                <div class="step terminus">
                                    ${buildTerminusLine(item)}
                                </div>
                            `;
                        }
                        return '';
                    };

                    return `
                        ${acc}
                        ${getFirstStepMarkup()}
                        ${getTransferStepMarkup()}
                        ${getInterimStepMarkup()}
                        ${getLastStepMarkup()}
                    `;
                };

                const stepsMarkup = Object.values(this.details.route.steps).reduce(
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
        const style =
            await fetch('./assets/css/scheduleItemDetailsStyles.css')
                .then((res) => res.text());

        registerComponent({ style });
    }
};

init();
