/* eslint-disable no-param-reassign */
// Actually we DO want to reassign in the set handler of the Proxy

// TODO - move this into a utils collection
function isObject(value) {
    return (typeof value === 'object' || typeof value === 'function') && value !== null;
}

const schema = {
    dbInstance: null,
    routes: {
        savedRoutes: [],
    },
};

const traps = {
    get: (node, prop) =>
        // console.log('get', {node, prop}, node[prop])
        node[prop],
    set: (node, prop, newValue) => {
        if (prop === 'handlers') {
            // new array of handlers should be assigned, because this won't be triggered on Array#push
            node.handlers = newValue;
            return true;
        }

        if (isObject(node[prop]) && typeof node[prop].value !== 'undefined') {
            const { handlers } = node[prop];
            // console.log('pre::set', node[prop].value, newValue)
            const oldValue = node[prop].value;
            node[prop] = new Proxy({ value: newValue }, traps);
            // console.log('post::set', node[prop].value, newValue)

            if (handlers && Array.isArray(handlers)) {
                handlers.forEach(fn =>
                    fn({
                        eventName: 'onChange',
                        newValue: node[prop].value,
                        oldValue,
                    }),
                );
            }

            return true;
        }

        // TODO: what if not an object?
        return false;
    },
};

function decorate(obj) {
    const state = new Proxy(
        Object.getOwnPropertyNames(obj).reduce((acc, prop) => {
            if (Array.isArray(obj[prop]) && typeof obj[prop] !== 'string') {
                acc[prop] = new Proxy(
                    {
                        value: obj[prop].map(item => new Proxy({ value: decorate(item) }, traps)),
                    },
                    traps,
                );
                return acc;
            }

            if (isObject(obj[prop])) {
                acc[prop] = { value: decorate(obj[prop]) };
                return acc;
            }

            acc[prop] = new Proxy(
                {
                    value: obj[prop],
                },
                traps,
            );

            return acc;
        }, {}),
        traps,
    );

    return state;
}

export const pageState = decorate(schema);
