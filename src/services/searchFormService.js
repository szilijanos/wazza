function searchRoute(/* from, to */) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    const queryJson = {
        func: 'getRoutes',
        params: {
            datum: '2020-03-17',
            erk_stype: 'megallo',
            ext_settings: 'block',
            filtering: 0,
            helyi: 'No',
            honnan: 'Budapest',
            hour: '00',
            hova: 'Kiskunhalas',
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

    const url = 'http://127.0.0.1:5501';
    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export default {
    searchRoute,
};
