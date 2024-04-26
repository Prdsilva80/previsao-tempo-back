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

app.get('/weather/:city/:uf', async (req, res) => {
    const { city, uf } = req.params;
    const apiKey = process.env.API_KEY;

    try {
        // Chamada à API do IBGE para verificar se a cidade pertence à UF
        const ibgeUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
        const ibgeResponse = await axios.get(ibgeUrl);
        const municipios = ibgeResponse.data.map(municipio => municipio.nome.toLowerCase());

        if (!municipios.includes(city.toLowerCase())) {
            return res.status(400).send({ error: 'A cidade não corresponde à UF fornecida.' });
        }

        // Realiza a chamada para a API do clima para condições atuais
        const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city},${uf}&lang=pt`;
        const currentWeatherResponse = await axios.get(currentWeatherUrl);

        // Realiza a chamada para a API do clima para previsão do tempo
        const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city},${uf}&days=3&lang=pt`;
        const forecastResponse = await axios.get(forecastUrl);

        if (currentWeatherResponse.status === 200 && forecastResponse.status === 200) {
            res.send({
                current: currentWeatherResponse.data,
                forecast: forecastResponse.data.forecast.forecastday
            });
        } else {
            throw new Error('API call failed');
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).send({ error: 'Erro ao buscar dados' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
