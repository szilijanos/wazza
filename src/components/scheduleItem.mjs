const template = document.createElement('template');
template.innerHTML = `
    <style>
        li.schedule-item {
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

        span.pref:not(:empty) {
            border-left: 1px solid #DDE2E8;
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
            -webkit-transition: transform 0.3s;
            -moz-transition: transform 0.3s;
            transition: transform 0.3s;
        }
    </style>

    <li class="schedule-item">
        <div class="list-cell">
            <span class="nro">01</span>
                <span class="pref"><span class='icon-mav'>
                    <svg width="15" height="26" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 15 26" enable-background="new 0 0 15 26" xml:space="preserve"><polygon id="XMLID_11_" fill="none" points="5,20.8 4.1,22.6 10.9,22.6 10,20.8"></polygon><polygon id="XMLID_10_" fill="none" points="10.2,3.2 7.5,1.4 4.8,3.2 7.4,4.9 7.6,4.9"></polygon><path fill="#0070FF" d="M14.8,11.1L14.8,11.1l0-0.7l-1.1-5.5H9.4L12,3.2l-4.5-3L3,3.2l2.5,1.7H1.2l-1.1,5.6v0.6V17l2.6,3.8l-2.5,4.9h2.3l0.7-1.3h8.6l0.7,1.3h2.3l-2.5-4.9l2.6-3.8V11.1z M7.5,12.9c0.9,0,1.7,0.7,1.7,1.7c0,0.9-0.7,1.7-1.7,1.7c-0.9,0-1.7-0.7-1.7-1.7C5.8,13.6,6.6,12.9,7.5,12.9z M4.8,3.2l2.7-1.8l2.7,1.8L7.6,4.9H7.4L4.8,3.2z M1.2,11.2l0-0.5l0.9-4.7H7v5.3H1.2z M4.1,22.6L5,20.8H10l0.9,1.8H4.1z M13.8,11.2H8V5.9h4.9l0.9,4.6V11.2z"></path><polygon id="XMLID_3_" fill="#FFFFFF" points="8,5.9 8,11.2 13.8,11.2 13.8,10.6 12.9,5.9"></polygon><polygon id="XMLID_2_" fill="#FFFFFF" points="7,5.9 2.1,5.9 1.2,10.7 1.2,11.2 7,11.2"></polygon><circle id="XMLID_1_" fill="#FFFFFF" cx="7.5" cy="14.6" r="1.7"></circle>
                    </svg>
                </span>
            </span>
            <span class="time">15:27</span>
            <span class="city">Pécs</span>
            <span class="station">autóbusz-állomás</span>
            <span class="toggle" data-tooltip="Útvonal részletei..."></span>
        </div>

        <div class="list-cell">
            <span class="transfer">
            <span class="transferNr">1 átszállás</span>
                | naponta
            </span>
            <div class="vehicleDiv">
                <div class="vehicleBox train">803</div>
                <div class="vehicleBox local">Helyi</div>
                <div class="vehicleBox train">Z70</div>
            </div>
            <div class="routemap">
                <div class="dot" style="left:79.15194346289752%;" title="" data-tooltip="Budapest-Nyugati pu."></div>
                <div class="line" style="width:79.15194346289752%;" data-class="grey"></div>
                <div class="line" style="width:20.84805653710248%;" data-class="grey"></div>
            </div>
            <span class="traveldata">
                283 km — 4 óra 30 perc
            </span>
        </div>

        <div class="list-cell">
            <span class="time">19:57</span>
            <span class="city">Zebegény vmh.</span>
            <span class="station"></span>
            <div class="right_corner_info">
                <span class="icons">
                    <span class="icon_ic" data-tooltip="Intercity járat"></span>
                </span>
            </div>
            <div class="travel_map_shortcut" data-tooltip="Megállók és térkép"></div>
        </div>
    </li>
`;



// $scheduleItem.innerText = `${schedule.departureCity}, ${schedule.departureStation} - ${schedule.arrivalCity}, $

window.customElements.define(
    'schedule-item',
    class extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
        }

        _renderCurrentDaySchedules() {
            this.$currentDaySchedulesList.innerHTML = '';
            // this.$currentDaySchedulesList.appendChild($scheduleItem);
        }
    },
);
