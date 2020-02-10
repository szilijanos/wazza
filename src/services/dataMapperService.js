// WARNING these indices are actually received as string props from the server, however JS is smart enough to coerce them to strings
// rework might be considered
const map = {
    departureTime: 6, // count in minutes from last midnight
    arrivalTime: 7,
    distance: 8,
    vehicleType: 11,
    buslineCode: 15,
    trainLineCode: 16,
    departureStation: 23,
    arrivalStation: 24,
    daysRunning: 29,
    lineName: 38,
    interStationTransitMethod: 56,
};

const vehicles = [
    {
        type: 'bus',
        keyOfLineCode: map.buslineCode,
    },
    {
        type: 'train',
        keyOfLineCode: map.trainLineCode,
    },
    {
        type: 'ship',
        keyOfLineCode: map.trainLineCode,
    },
];

function getVehicleDetails(item) {
    return {
        type: vehicles[item[map.vehicleType] - 1].type,
        lineNumber:
            item[map.lineName].length > 0
                ? item[map.lineName]
                : item[vehicles[item[map.vehicleType] - 1].keyOfLineCode],
    };
}

function getTimeStringFromMinutes(minutes) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const min = String(Math.floor(minutes % 60)).padStart(2, '0');

    return `${hour}:${min}`;
}

function getStationCity(item, mapKey) {
    const station = item[mapKey];
    return station.includes(',') ? station.split(',')[0].trim() : station;
}

function getStationName(item, mapKey) {
    const station = item[mapKey];
    return station.includes(',') ? station.split(',')[1].trim() : '';
}

function isLocalTransportNecessaryAfter(item) {
    return item[map.interStationTransitMethod] === 'Vehicle';
}

const departure = {
    getTimeString: item => getTimeStringFromMinutes(item[map.departureTime]),
    getStationName: item => getStationName(item, map.departureStation),
    getStationCity: item => getStationCity(item, map.departureStation),
};

const arrival = {
    getTimeString: item => getTimeStringFromMinutes(item[map.arrivalTime]),
    getStationName: item => getStationName(item, map.arrivalStation),
    getStationCity: item => getStationCity(item, map.arrivalStation),
};

const route = {
    getDaysRunning: item => item[map.daysRunning],
    getDistance: item => Number(item[map.distance] / 1000),
    getTotalDistance: routeItemArray =>
        routeItemArray.reduce((acc, item) => acc + Number(item[map.distance] / 1000), 0),
    getDurationInMinutes: item => item[map.arrivalTime] - item[map.departureTime],
    getTotalTimeString: routeItemArray =>
        getTimeStringFromMinutes(
            routeItemArray[routeItemArray.length - 1][map.arrivalTime] -
                routeItemArray[0][map.departureTime],
        ),
    getVehicleDetails,
    isLocalTransportNecessaryAfter,
};

export default {
    arrival,
    departure,
    route,
};
