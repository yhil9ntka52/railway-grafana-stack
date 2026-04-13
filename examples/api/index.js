const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
const port = 9091;

// Створюємо реєстр для метрик
const register = new client.Registry();

// Створюємо метрику для ціни Solana
const solPriceGauge = new client.Gauge({
  name: 'solana_price_usd',
  help: 'Current price of SOL/USDT from Binance'
});

register.registerMetric(solPriceGauge);

async function updateSolPrice() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
    const price = parseFloat(response.data.price);
    solPriceGauge.set(price);
    console.log(`SOL Price updated: ${price}`);
  } catch (error) {
    console.error('Error fetching price:', error.message);
  }
}

setInterval(updateSolPrice, 15000);
updateSolPrice();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`SOL Exporter listening at http://localhost:${port}/metrics`);
});
