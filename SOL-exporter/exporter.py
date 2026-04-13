import time
import requests
from prometheus_client import start_http_server, Gauge

SOL_PRICE = Gauge('crypto_price_usd', 'Current price of cryptocurrency', ['symbol'])

def fetch_data():
    try:
        response = requests.get('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT')
        price = response.json()['price']
        SOL_PRICE.labels(symbol='SOL').set(float(price))
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == '__main__':
    start_http_server(8000)
    print("Solana Exporter started on port 8000")
    while True:
        fetch_data()
        time.sleep(15)
