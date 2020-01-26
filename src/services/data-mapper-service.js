// WARNING these indices are actually received as string props from the server, however JS is smart enough to coerce them to strings
// rework might be considered
const map = {
    departureTime: 6, // count in minutes from last midnight
    arrivalTime: 7,
    vehicleType: 11,
    buslineCode: 15,
    trainLineCode: 16,
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
];

const getVehicleDetails = item => ({
    type: vehicles[item[map.vehicleType] - 1].type,
    lineNumber:
        item[map.lineName].length > 0
            ? item[map.lineName]
            : item[vehicles[item[map.vehicleType] - 1].keyOfLineCode],
});

const getDepartureTimeString = item => {
    const hour = String(Math.floor(item[map.departureTime] / 60)).padStart(2, '0');
    const min = String(Math.floor(item[map.departureTime] % 60)).padStart(2, '0');

    return `${hour}:${min}`;
};

const isLocalTransportNecessaryAfter = item => item[map.interStationTransitMethod] === 'Vehicle';

export default {
    getVehicleDetails,
    getDepartureTimeString,
    isLocalTransportNecessaryAfter,
};
