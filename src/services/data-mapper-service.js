const vehicleDataMap = {
    vehicleType: 11,
    buslineCode: 15,
    trainLineCode: 16,
    lineName: 38,
    interStationTransitMethod: 56,
};

const vehicles = [
    {
        type: 'bus',
        keyOfLineCode: vehicleDataMap.buslineCode,
    },
    {
        type: 'train',
        keyOfLineCode: vehicleDataMap.trainLineCode,
    },
];

const getVehicleDetails = item => ({
    type: vehicles[item[vehicleDataMap.vehicleType] - 1].type,
    lineNumber:
        item[vehicleDataMap.lineName].length > 0
            ? item[vehicleDataMap.lineName]
            : item[vehicles[item[vehicleDataMap.vehicleType] - 1].keyOfLineCode],
});

const isLocalTransportNecessaryAfter = item =>
    item[vehicleDataMap.interStationTransitMethod] === 'Vehicle';

export default {
    getVehicleDetails,
    isLocalTransportNecessaryAfter,
};
