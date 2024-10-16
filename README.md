# Azure Serverless Function for Cryptocurrency Price Tracking

This repository implements a serverless solution using **Azure Functions** to fetch and store cryptocurrency price data for Bitcoin, Matic, and Ethereum from the CoinGecko API. The function runs as a background job every 2 hours, fetching the latest price in USD, market cap in USD, and the 24-hour price change, and stores this data in a MongoDB database.

## Features

1. **Cron Job Using Azure Timer Function**: A scheduled function runs every two hours, fetching cryptocurrency data for Bitcoin, Matic, and Ethereum from the [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/introduction).
2. **Data Storage**: Cryptocurrency data is stored in MongoDB with fields including `price`, `market cap`, and `24-hour price change`.
3. **Azure Serverless**: Built using **Azure Functions**, making it a scalable and cost-effective solution for running background tasks.

## Prerequisites

- Azure Functions setup on your Azure account.
- MongoDB (self-hosted or a cloud service like MongoDB Atlas).
- CoinGecko API for cryptocurrency data.

### Environment Variables

Create a `.env` file and add the following variables:

```bash
MONGODB_URI=<your_mongodb_connection_string>
COINGECKO_API_KEY=<your_coingecko_api_key>
```
