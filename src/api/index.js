import Promise from 'bluebird';
import _ from 'lodash';
import alphaVantage from 'alphavantage';
import { teams } from './teams';
import * as logger from 'winston';

const alpha = alphaVantage({ key: process.env.ALPHA_VANTAGE_API_KEY });

export async function apiHandler(req, res) {
  const [quotes, btcPrice] = await Promise.all([
    getStockQuotes(),
    getCurrentBitcoinPrice(),
  ]);
  const teamsWithPrices = teams.map((team) => {
    const { picks } = team;
    const picksWithPrices = picks.map((stock) => {
      const { symbol, close } = stock;
      const quote = _.find(quotes, { symbol });
      const stockPrice = _.get(quote, 'price', 0);
      const price = symbol === 'BTX' ? Number(btcPrice) : Number(stockPrice);
      const performance = price / close - 1;
      return { ...stock, price, performance };
    })
    const performance = _.mean(_.map(picksWithPrices, 'performance'));
    return { ...team, picks: picksWithPrices, performance };
  });
  res.send({ teams: _.orderBy(teamsWithPrices, 'performance', 'desc') });
}

async function getCurrentBitcoinPrice() {
  const btc = await alpha.crypto.intraday('btc', 'usd', );
  const btcPrice = _.get(_.find(btc['Time Series (Digital Currency Intraday)']), '1a. price (USD)', 0);
  logger.info('Current bitcoin price is:', btcPrice);
  return Number(btcPrice);
}

async function getStockQuotes() {
  const stocks = _.flatMap(teams, 'picks');
  const { 'Stock Quotes': quotes } = await alpha.data.batch(_.map(stocks, 'symbol'));
  logger.info('Fetched', quotes.length, 'quotes');
  return quotes.map((quote) => ({
    symbol: _.get(quote, '1. symbol'),
    price: _.get(quote, '2. price'),
  }))
}

/* Unused
async function getStartingPrices() {
  const stocks = _.flatMap(teams, 'picks');
  const prices = await Promise.map(stocks, async (stock) => 
    alpha.data.daily(stock.symbol).then(res => {
      console.log('Fetched', stock.symbol);
      const timeSeries = _.get(res, 'Time Series (Daily)', {});
      const day = timeSeries['2018-04-26'] || {};
      const close = Number(_.get(day, '4. close', 0));
      return { symbol: stock.symbol, close }
    })
  , { concurrency: 3 });
  return prices;
}*/
