import mapperService from '../services/data-mapper-service.js'

const template = document.createElement('template');
template.innerHTML = `
    <div part="schedule-item-container" class="schedule-item-container">
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
    <div class="expanded-details expanded"></div>
`;


window.customElements.define(
    'schedule-item',
    class extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: 'open' });
            this.root.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            fetch('./assets/css/scheduleItemStyles.css')
                .then(response => response.text())
                .then(data => {
                    const styleNode = document.createElement('style');
                    styleNode.innerHTML = data;
                    this.root.appendChild(styleNode);
                })
        }

        render() {
            this.root.querySelector('.departure > span.nro').textContent = String(this.itemData.nro + 1).padStart(2,'0');
            this.root.querySelector('.departure > span.pref').innerHTML =
                Object.values(this.itemData.kifejtes_postjson.runs)
                    .reduce((acc, item) => {
                        const details = mapperService.getVehicleDetails(item);
                        return `${acc}<img alt="${details.type}" class="icon-${details.type}" src="./assets/icons/icon-${details.type}.svg"  width="15" height="20">`
                    }, '');

            this.root.querySelector('.departure > span.city').textContent = this.itemData.departureCity;
            this.root.querySelector('.departure > span.station').textContent = this.itemData.departureStation;
            this.root.querySelector('.departure > span.time').textContent = this.itemData.indulasi_ido;
            this.root.querySelector('.arrival > span.city').textContent = this.itemData.arrivalCity;
            this.root.querySelector('.arrival > span.station').textContent = this.itemData.arrivalStation;
            this.root.querySelector('.arrival > span.time').textContent = this.itemData.erkezesi_ido;

            this.root.querySelector('.short-details > span.transfer').innerHTML =
            `<span class="transferNr">${this.itemData.atszallasok_szama} átszállás</span> | ${/naponta|munkanapokon/.test(this.itemData.talalat_kozlekedik) ? this.itemData.talalat_kozlekedik : 'lásd részletek...'}`;

            const getVehicleBoxMarkup = (item) => {
                const currentVehicle = mapperService.getVehicleDetails(item);

                return `<div class="vehicleBox ${currentVehicle.type}">
                            ${currentVehicle.lineNumber}
                        </div>`
            }

            this.root.querySelector('.short-details > div.vehicleDiv').innerHTML =
                Object.values(this.itemData.kifejtes_postjson.runs)
                    .reduce((acc, item) => {
                        if (mapperService.isLocalTransportNecessaryAfter(item)) {
                            return `${acc}
                                    ${getVehicleBoxMarkup(item)}
                                    <div class="vehicleBox local">Helyi</div>
                                    `.trim()
                        }

                        return `${acc}${getVehicleBoxMarkup(item)}`
                    },'');

            this.root.querySelector('.short-details > div.routemap').innerHTML =
                Object.values(this.itemData.jaratinfok)
                    .reduce((acc, item, index, arr) => {
                        if (arr.length === 1) {
                            return {
                                html: `<div class="line" style="width: 100%"></div>`
                            };
                        }

                        if (index === 0) {
                            const currentOffset = item.distance;
                            const progressPercentage = currentOffset / this.itemData.totalDistance * 100;

                            return {
                                dotLeftOffset: currentOffset,
                                lineWidth: currentOffset,
                                html: ` <div class="line" style="width: ${progressPercentage}%"></div>
                                        <div class="dot"  style="left:  ${progressPercentage}%"></div>
                                        `.trim()
                            };
                        }

                        if (index < arr.length - 1) {
                            const currentOffset = acc.dotLeftOffset + item.distance;

                            return {
                                dotLeftOffset: currentOffset,
                                lineWidth: item.distance,
                                html: `${acc.html}
                                    <div class="line" style="width: ${item.distance / this.itemData.totalDistance * 100}%"></div>
                                    <div class="dot" style="left: ${currentOffset / this.itemData.totalDistance * 100}%"></div>
                                    `.trim()
                            };
                        }

                        return {
                            html: `${acc.html}
                                <div class="line" style="width : ${item.distance / this.itemData.totalDistance * 100}%"></div>
                                `.trim()
                        };
                    },
                    null).html;

            this.root.querySelector('.short-details > span.traveldata').textContent = `${this.itemData.totalDistance.toFixed(Number.isInteger(this.itemData.totalDistance) ? 0 : 1)} km — ${this.itemData.osszido.split(':').reduce((acc, time, index) => `${acc} ${ index === 0 ? Number(time) : time} ${['óra', 'perc'][index]}`, '')}`;

            const $expandedDetails = this.root.querySelector('div.expanded-details');
            const $scheduleItem = this.root.querySelector('.schedule-item-container');

            $scheduleItem.addEventListener('click', () => {
                const haveDetailsExpandedClass = [...$expandedDetails.classList].some((cls) => cls === 'expanded');
                $expandedDetails.classList.toggle('expanded', !haveDetailsExpandedClass)
            });


            const buildLeftDiv = (item, index) =>`
                <div>
                    <div class="time">
                        <strong>${mapperService.getDepartureTimeString(item)}</strong>
                        ${index === 0 && '<br>Indulás'}
                    </div>
                </div>`;


            const stepsMarkup = Object.values(this.itemData.kifejtes_postjson.runs)
                .reduce((acc, item, index) => `${acc}<div class="step">${buildLeftDiv(item, index)}</div>`, '');

            $expandedDetails.innerHTML =
                `<div class="travel-steps">${stepsMarkup}</div>`;
        }

        set item(value) {
            this.itemData = value;
            this.render();
        }
    },
);
