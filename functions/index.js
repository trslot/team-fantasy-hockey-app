const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { stringify } = require('querystring');

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

// Serve Angular static files
app.use(express.static(path.join(__dirname, '../dist/team-fantasy-hockey-app/browser')));

// Fallback to index.html for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/team-fantasy-hockey-app/browser/index.html'));
});
});

exports.app = functions.https.onRequest(app);