const BLUEFIN_API_URL = 'https://dapi.api.sui-prod.bluefin.io';

export const getBluefinExchangeInfo = async () => {
  const response = await fetch(`${BLUEFIN_API_URL}/exchangeInfo`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();

  return JSON.stringify(data);
}

export const getMarketData = async () => {
  const response = await fetch(`${BLUEFIN_API_URL}/marketData`, {
    method: 'GET',
    headers: {
      'accept': 'application/json' 
    }
  });
  const data = await response.json();
  return JSON.stringify(data);
}

export const getCandlestickData = async (interval = '1m') => {
  const response = await fetch(`${BLUEFIN_API_URL}/candlestickData?interval=${interval}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
