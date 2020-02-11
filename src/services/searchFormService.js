function searchRoute(from, to) {
    console.log(from, to);

    const q = {
        func: 'getRoutes',
        params: {
            datum: '2020-12-12',
            erk_stype: 'megallo',
            ext_settings: 'block',
            filtering: 0,
            helyi: 'No',
            honnan: 'Budapest',
            honnan_eovx: '653878',
            honnan_eovy: '236802',
            honnan_ls_id: 0,
            honnan_settlement_id: 1357,
            honnan_site_code: 0,
            honnan_zoom: 7,
            hour: '21',
            hova: 'Mezőberény+vá.',
            hova_eovx: '799979.85',
            hova_eovy: '165263.05',
            hova_ls_id: 27500707,
            hova_settlement_id: '1962',
            hova_site_code: 0,
            hova_zoom: 9,
            ind_stype: 'megallo',
            keresztul_stype: 'megallo',
            maxatszallas: '5',
            maxvar: '240',
            maxwalk: '700',
            min: '17',
            napszak: 0,
            naptipus: 0,
            odavissza: 0,
            preferencia: '0',
            rendezes: '1',
            submitted: 1,
            talalatok: 1,
            target: 0,
            utirany: 'oda',
            var: '0',
        },
    };

    fetch('https://menetrendek.hu/menetrend/interface/index.php', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(q),
    })
        .then(response => response.body.json())
        .then(data => console.log({ data }))
        .catch(err => console.log({ err }));
}

export default {
    searchRoute,
};
