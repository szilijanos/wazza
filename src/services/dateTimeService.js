const getDateString = (date) => date.toJSON().split('T')[0];

const date = {
    tomorrow: () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);

        return getDateString(today);
    }
};

export default {
    date
};
