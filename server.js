const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/weather/:city:state', async (req, res) => {
    const city = req.params.city;
    const state = req.params.state;
    const apiKey = process.env.API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city},${state}&lang=pt`;

    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            res.send(response.data);
        } else {
            throw new Error(`API call failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        res.status(500).send({ error: 'Erro ao buscar dados meteorológicos' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
