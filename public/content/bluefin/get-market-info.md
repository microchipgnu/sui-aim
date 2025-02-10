# Bluefin Market Data

## Biggest Price Movers

Let's get the market data from Bluefin. Make sure to get percentage correct.

{% ai #getBluefinMarketData model="openai/gpt-4o-mini" tools="*" /%}

What are the biggest price movers? Give me a good list and information about them (if there is any).

{% ai #getBiggestPriceMovers model="openai/gpt-4o-mini" structuredOutputs="{biggestMovers:[ticker: string, priceChange: number, priceChangePercent: number]}" /%}

{% debug($getBiggestPriceMovers.structuredOutputs) %}