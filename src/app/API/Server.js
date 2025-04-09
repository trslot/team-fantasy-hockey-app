const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { stringify } = require('querystring');
const { parse } = require('path');
const app = express();

app.use(cors());

app.get('/stats', (req, res) => {
    // const { id } = req.params;

    const url = `https://api-web.nhle.com/v1/standings/now`;

    axios.get(url).then(response => {
        res.json(response.data)
    });

});

app.get('/schedule', (req, res) => {
    // const { id } = req.params;

    const url = `https://api-web.nhle.com/v1/schedule/now`;

    axios.get(url).then(response => {
        res.json(response.data)
    });

});

app.get(`/players` , (req, res) => {
    const playerId = stringify(req.query).substring(9);

    const url = `https://api-web.nhle.com/v1/player/${playerId}/landing`;

    axios.get(url).then(response => {
        res.json(response.data)
    });
});

app.get(`/rosters`, (req, res) => {
    const tempId = stringify(req.query).substring(7);

    const url = `https://api-web.nhle.com/v1/roster/${tempId}/current`;

    axios.get(url).then(response => {
        res.json(response.data)
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
