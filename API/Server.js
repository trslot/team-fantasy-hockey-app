const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const NHL_API = 'https://api-web.nhle.com/v1';

// Helper for NHL API requests
async function getNHLData(res, endpoint) {
    try {
        const response = await axios.get(`${NHL_API}${endpoint}`, {
            timeout: 15000
        });
        res.json(response.data);
    } catch (error) {
        console.error('NHL API request failed:', error.message);

        res.status(502).json({
            error: 'Failed to retrieve data from the NHL API'
        });
    }
}

app.get('/stats', (req, res) => {
    getNHLData(res, '/standings/now');
});

app.get('/schedule', (req, res) => {
    getNHLData(res, '/schedule/now');
});

app.get('/players', (req, res) => {
    const playerId = req.query.playerId;

    if (!playerId || !/^\d+$/.test(playerId)) {
        return res.status(400).json({
            error: 'Provide a valid playerId query parameter'
        });
    }

    getNHLData(res, `/player/${playerId}/landing`);
});

app.get('/rosters', (req, res) => {
    const teamId = req.query.teamId;

    if (!teamId || !/^[a-zA-Z]+$/.test(teamId)) {
        return res.status(400).json({
            error: 'Provide a valid teamId query parameter'
        });
    }

    getNHLData(res, `/roster/${teamId}/current`);
});

app.get('/seasons', (req, res) => {
    getNHLData(res, '/season');
});

app.get('/standing-seasons', (req, res) => {
    getNHLData(res, '/standings-season');
});

app.get('/past-stats', (req, res) => {
    const date = req.query.date;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
            error: 'Provide a date in YYYY-MM-DD format'
        });
    }

    getNHLData(res, `/standings/${date}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});