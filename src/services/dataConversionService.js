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
    }
];

function getVehicleDetails(item) {
    return {
        type: vehicles[item[map.vehicleType] - 1].type,
        lineNumber: item[map.lineName].length > 0
            ? item[map.lineName]
            : item[vehicles[item[map.vehicleType] - 1].keyOfLineCode]
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

function getTotalTimeString(routeItemArray) {
    return getTimeStringFromMinutes(
        routeItemArray[routeItemArray.length - 1][map.arrivalTime] - routeItemArray[0][map.departureTime]
    );
}

const buildExtractedResults = (rawResults) => {
    const KEY_NAME_MAP = {
        results: 'talalatok',
        details: 'kifejtes_postjson'
    };

    const rawResultsArray = [
        ...Object.values(rawResults[KEY_NAME_MAP.results])
    ].reduce((acc, rawScheduleItem) => {
        acc.push(rawScheduleItem[KEY_NAME_MAP.details].runs);
        return acc;
    }, []);

    const extractedData =
        rawResultsArray.reduce((acc, item) => {
            const lastIndex = Object.keys(item).length - 1;

            const dataAssembly = {
                route: {
                    steps: Object.values(item)
                        .reduce((accSteps, step) => {
                            accSteps.push({
                                vehicleDetails: getVehicleDetails(step),
                                isLocalTransportNecessaryAfter: isLocalTransportNecessaryAfter(step),
                                departure: {
                                    timeString: getTimeStringFromMinutes(step[map.departureTime]),
                                    city: getStationCity(step, map.departureStation),
                                    station: getStationName(step, map.departureStation)
                                },
                                arrival: {
                                    timeString: getTimeStringFromMinutes(step[map.arrivalTime]),
                                    city: getStationCity(step, map.arrivalStation),
                                    station: getStationName(step, map.arrivalStation)
                                },
                                distance: Number(step[map.distance] / 1000),
                                durationInMinutes: step[map.arrivalTime] - step[map.departureTime],
                            });
                            return accSteps;
                        }, []),
                    daysRunning: Object.values(item)
                        .reduce((accDaysRunning, step, index) => {
                            const current = step.dayRunning;
                            const regexDailyAndWorkdaysOnly = /naponta|munkanapokon/;

                            if (regexDailyAndWorkdaysOnly.test(current)
                                    && (index === 0 || accDaysRunning === current)
                            ) {
                                return current;
                            }

                            return 'lásd részletek...';
                        }, ''),
                    totalTime: getTotalTimeString(Object.values(item)),
                    totalDistance: Object.values(item)
                        .reduce((accDist, step) => accDist + Number(step[map.distance] / 1000), 0),
                },
                arrival: {
                    city: getStationCity(item[lastIndex], map.arrivalStation),
                    station: getStationName(item[lastIndex], map.arrivalStation),
                    timeString: getTimeStringFromMinutes(item[lastIndex][map.arrivalTime])
                },
                departure: {
                    city: getStationCity(item[0], map.departureStation),
                    station: getStationName(item[0], map.departureStation),
                    timeString: getTimeStringFromMinutes(item[0][map.departureTime])
                }
            };

            acc.push(dataAssembly);

            return acc;
        }, []);

    return extractedData;
};

// TODO move the whole extraction logic to the backend
const extract = (rawData) => new Promise((resolve, reject) => {
    const parsed = JSON.parse(rawData);

    const { status, results } = parsed;
    if (status === 'success') {
        resolve(buildExtractedResults(results));
        return;
    }

    reject(new Error('Data server rejected request'));
});

export default {
    extract
};
