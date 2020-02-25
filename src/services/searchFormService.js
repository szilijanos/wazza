function searchRoute({ from, to }) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    const queryJson = {
        func: 'getRoutes',
        params: {
            datum: '2020-05-17',
            erk_stype: 'megallo',
            ext_settings: 'block',
            filtering: 0,
            helyi: 'No',
            honnan: from,
            hour: '00',
            hova: to,
            ind_stype: 'megallo',
            keresztul_stype: 'megallo',
            maxatszallas: '5',
            maxvar: '240',
            maxwalk: '700',
            min: '39',
            naptipus: 0,
            preferencia: '0',
        },
    };

    const payload = `json=${encodeURIComponent(JSON.stringify(queryJson))}`;

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        redirect: 'follow',
        body: payload,
    };

    const serverUrl = 'http://127.0.0.1:5501';

    return fetch(serverUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .then(response => response.text())
        .catch(error => console.log('error', error)); // TODO
}

export default {
    searchRoute,
};
