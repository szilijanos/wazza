const template = document.createElement('template');
template.innerHTML = `
    <style>
        div.schedule-item {
            background: #fff;
            border-bottom: 1px solid #e0e2e7;
            position: relative;
            height: 110px;
            transition: background-color 0.3s;
            display: flex;
            flex-direction: row;
        }

        div.list-cell {
            color: #60646E;
            font-size: 13px;
            line-height: 20px;
            border-right: 1px solid #e0e2e7;
            padding: 10px;
            position: relative;
            flex: 1;
            text-align: center;
        }

        div.list-cell:first-child {
            border-left: 1px solid #e0e2e7;
        }

        span.nro {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #84888F;
        }

        span.pref {
            position: absolute;
            left: 32px;
            top: 12px;
            padding-left: 7px;
        }

        span.pref:not(:empty) {
            border-left: 1px solid #DDE2E8;
        }

        .pref > span svg {
            height: 14px;
            position: relative;
        }

        span.pref > span.icon-mav svg {
            height: 18px;
            top: -1px;
        }

        span.time {
            color: #0070FF;
            font-size: 21px;
            display: block;
            line-height: 40px;
        }

        span.city {
            font-size: 15px;
            font-weight: 600;
            display: block;
            line-height: 30px;
            margin: 0 40px;
            max-width: 250px;
            display: block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        span.station {
            font-size: 13px;
            display: block;
            margin: 0 40px;
            max-width: 185px;
            display: block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        span.toggle {
            width: 20px;
            height: 20px;
            position: absolute;
            bottom: 10px;
            left: 10px;
            cursor: pointer;
            transition: transform 0.3s;
        }

        span.toggle::before {
            content: "";
            position: absolute;
            top: 6px;
            left: 9px;
            z-index: 1;
            transform: scale3d(1, 1, 1);
            transition: transform 0.3s;
            width: 0;
            height: 0;
            display: block;
            border-left: 4px solid #F9F9FB;
            border-top: 4px solid transparent;
            border-right: 0;
            border-bottom: 4px solid transparent;
        }

        .toggle::after {
            content: "";
            background: #0070FF;
            z-index: 0;
            border-radius: 100% 100% 100% 100%;
            transform: scale3d(1, 1, 1);
            transition: background 0.3s,transform 0.3s;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }

        .transfer {
            color:
            #84888F;
            display: block;
            position: absolute;
            top: 10px;
            left: 0;
            right: 0;
        }

        .transferNr {
            color:
            #0070FF;
        }

        .vehicleDiv {
            position: absolute;
            top: 35px;
            left: 0;
            right: 0;
        }

        .vehicleBox {
            display: inline-block;
            height: 1.7em;
            line-height: 1.7em;
            color: #ffffff;
            border-radius: 3px;
            padding: 0px 3px 0px 3px;
            margin: 0px 4px 0px 0px;
        }

        .vehicleBox.bus {
            background-color: #FEAE46;
            color: #000000;
        }

        .vehicleBox.local {
            background-color:
            #888888;
        }

        .vehicleBox.train {
            background-color:
            #0070FF;
        }

        .routemap {
            height: 4px;
            margin: auto;
            position: absolute;
            top: 70px;
            bottom: auto;
            left: 4px;
            right: 4px;
        }

        .routemap::before {
            left: -12px;
            content: "";
            width: 6px;
            height: 6px;
            border: 4px solid #60646E;
            position: absolute;
            top: -5px;
            border-radius: 100% 100% 100% 100%;
        }

        .routemap::after {
            content: "";
            right: -12px;
            background: #60646E;
            width: 6px;
            height: 6px;
            border: 4px solid #60646E;
            position: absolute;
            top: -5px;
            border-radius: 100% 100% 100% 100%;
        }

        .routemap .line {
            background:
            #60646E;
            float: left;
            height: 4px;
            position: relative;
            -webkit-transition: background 0.3s;
            -moz-transition: background 0.3s;
            transition: background 0.3s;
        }

        .routemap .dot {
            cursor: pointer;
            width: 10px;
            height: 10px;
            background:
            #0070FF;
            top: -3px;
            left: 50%;
            z-index: 1;
            position: absolute;
            border-radius: 100% 100% 100% 100%;
            transform: translateX(-50%);
        }

        .traveldata {
            color: #84888F;
            position: absolute;
            left: 0;
            right: 0;
            top: 80px;
            bottom: auto;
        }
    </style>

    <div class="schedule-item">
        <div id="departure" class="list-cell">
            <span class="nro"></span>
            <span class="pref">
                <span class='icon-mav'>
                    <svg width="15" height="26" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 15 26" enable-background="new 0 0 15 26" xml:space="preserve"><polygon id="XMLID_11_" fill="none" points="5,20.8 4.1,22.6 10.9,22.6 10,20.8"></polygon><polygon id="XMLID_10_" fill="none" points="10.2,3.2 7.5,1.4 4.8,3.2 7.4,4.9 7.6,4.9"></polygon><path fill="#0070FF" d="M14.8,11.1L14.8,11.1l0-0.7l-1.1-5.5H9.4L12,3.2l-4.5-3L3,3.2l2.5,1.7H1.2l-1.1,5.6v0.6V17l2.6,3.8l-2.5,4.9h2.3l0.7-1.3h8.6l0.7,1.3h2.3l-2.5-4.9l2.6-3.8V11.1z M7.5,12.9c0.9,0,1.7,0.7,1.7,1.7c0,0.9-0.7,1.7-1.7,1.7c-0.9,0-1.7-0.7-1.7-1.7C5.8,13.6,6.6,12.9,7.5,12.9z M4.8,3.2l2.7-1.8l2.7,1.8L7.6,4.9H7.4L4.8,3.2z M1.2,11.2l0-0.5l0.9-4.7H7v5.3H1.2z M4.1,22.6L5,20.8H10l0.9,1.8H4.1z M13.8,11.2H8V5.9h4.9l0.9,4.6V11.2z"></path><polygon id="XMLID_3_" fill="#FFFFFF" points="8,5.9 8,11.2 13.8,11.2 13.8,10.6 12.9,5.9"></polygon><polygon id="XMLID_2_" fill="#FFFFFF" points="7,5.9 2.1,5.9 1.2,10.7 1.2,11.2 7,11.2"></polygon><circle id="XMLID_1_" fill="#FFFFFF" cx="7.5" cy="14.6" r="1.7"></circle>
                    </svg>
                </span>
            </span>
            <span class="time"></span>
            <span class="city"></span>
            <span class="station"></span>
            <span class="toggle" data-tooltip="Útvonal részletei..."></span>
        </div>

        <div id="details" class="list-cell">
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

        <div id="arrival" class="list-cell">
            <span class="time"></span>
            <span class="city"></span>
            <span class="station"></span>
            <div class="right_corner_info">
                <span class="icons">
                    <span class="icon_ic" data-tooltip="Intercity járat"></span>
                </span>
            </div>
            <div class="travel_map_shortcut" data-tooltip="Megállók és térkép"></div>
        </div>
    </div>
`;


window.customElements.define(
    'schedule-item',
    class extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: 'open' });
            this.root.appendChild(template.content.cloneNode(true));
        }

        render() {
            this.root.querySelector('#departure > span.nro').textContent = String(this.itemData.nro + 1).padStart(2,'0');
            this.root.querySelector('#departure > span.city').textContent = this.itemData.departureCity;
            this.root.querySelector('#departure > span.station').textContent = this.itemData.departureStation;
            this.root.querySelector('#departure > span.time').textContent = this.itemData.indulasi_ido;
            this.root.querySelector('#arrival > span.city').textContent = this.itemData.arrivalCity;
            this.root.querySelector('#arrival > span.station').textContent = this.itemData.arrivalStation;
            this.root.querySelector('#arrival > span.time').textContent = this.itemData.erkezesi_ido;

            this.root.querySelector('#details > span.transfer').innerHTML =
            `<span class="transferNr">${this.itemData.atszallasok_szama} átszállás</span>${this.itemData.explanations.length > 0 && ' | lásd részletek...'}`;

            const getVehicleBoxMarkup = (item) => {
                const vehicles = [
                    {
                        type: 'bus',
                        keyOfLineCode: '15'
                    },
                    {
                        type: 'train',
                        keyOfLineCode: '16'
                    }
                ];

                const currentVehicle = vehicles[Number(item['11']) - 1];
                const keyOfLineCode = item['38'].length > 0 ? '38' : currentVehicle.keyOfLineCode;

                return `<div class="vehicleBox ${currentVehicle.type}">${item[keyOfLineCode]}</div>`
            }

            this.root.querySelector('#details > div.vehicleDiv').innerHTML =
                Object.values(this.itemData.kifejtes_postjson.runs)
                    .reduce((acc, item) => {
                        if (item[56] === 'Vehicle') {
                            return `${acc}
                                    ${getVehicleBoxMarkup(item)}
                                    <div class="vehicleBox local">Helyi</div>
                                    `.trim()
                        }

                        return `${acc}${getVehicleBoxMarkup(item)}`
                    },'');

            this.root.querySelector('#details > div.routemap').innerHTML =
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

            this.root.querySelector('#details > span.traveldata').textContent = `${this.itemData.totalDistance.toFixed(1)} km — ${this.itemData.osszido.split(':').reduce((acc, time, index) => `${acc} ${ index === 0 ? Number(time) : time} ${['óra', 'perc'][index]}`, '')}`;
        }

        set item(value) {
            this.itemData = value;
            this.render();
        }
    },
);
