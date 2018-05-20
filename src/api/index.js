import Promise from 'bluebird';
import _ from 'lodash';
import alphaVantage from 'alphavantage';
import { teams } from './teams';
import * as logger from 'winston';
import * as redis from './redis';

const cache = redis.create();
const alpha = alphaVantage({ key: process.env.ALPHA_VANTAGE_API_KEY });

export async function apiHandler(req, res) {
  const [quotes, btcPrice] = await Promise.all([
    getStockQuotes(),
    getCurrentBitcoinPrice(),
  ]);
  const teamsWithPrices = teams.map((team) => {
    const { picks } = team;
    const picksWithPrices = picks.map((stock) => {
      const { symbol, start } = stock;
      const quote = _.find(quotes, { symbol });
      const stockPrice = _.get(quote, 'price', 0);
      const current = symbol === 'BTX' ? Number(btcPrice) : Number(stockPrice);
      const performance = current / start - 1;
      return { ...stock, current, performance };
    })
    const performance = _.mean(_.map(picksWithPrices, 'performance'));
    return { ...team, picks: picksWithPrices, performance };
  });
  res.send({ teams: _.orderBy(teamsWithPrices, 'performance', 'desc') });
}

async function getCurrentBitcoinPrice() {
  const cached = await cache.getAsync('btc');
  if (cached) {
    logger.info('BTC CACHE HIT');
    return Number(cached);
  }
  try {
    const btc = await alpha.crypto.intraday('btc', 'usd');
    const btcPrice = _.get(_.find(btc['Time Series (Digital Currency Intraday)']), '1a. price (USD)', 0);
    logger.info('Current bitcoin price is:', btcPrice);
    cache.setAsync('btc', btcPrice, 'EX', 500);
    cache.setAsync('btc-stale', btcPrice);
    return Number(btcPrice);
  } catch (err) {
    logger.warn('Unable to fetch bitcoin price, using stale cache instead...');
    const stale = await cache.getAsync('btc-stale');
    return Number(stale);
  }
}

async function getStockQuotes() {
  const cached = await cache.getAsync('quotes');
  if (cached) {
    logger.info('Quotes CACHE HIT');
    return JSON.parse(cached);
  }
  const stocks = _.flatMap(teams, 'picks');
  try {
    const { 'Stock Quotes': quoteRows } = await alpha.data.batch(_.map(stocks, 'symbol'));
    const quotes = quoteRows.map((quote) => ({
      symbol: _.get(quote, '1. symbol'),
      price: _.get(quote, '2. price'),
    }))
    logger.info('Fetched', quotes.length, 'quotes');
    cache.setAsync('quotes', JSON.stringify(quotes), 'EX', 500);
    cache.setAsync('quotes-stale', JSON.stringify(quotes))
    return quotes;
  } catch (err) {
    logger.warn('Unable to fetch stock quotes, using stale cache instead...');
    const stale = await cache.getAsync('quotes-stale');
    return JSON.parse(stale);
  }
}

/* Unused
async function getStartingPrices() {
  const stocks = _.flatMap(teams, 'picks');
  const prices = await Promise.map(stocks, async (stock) => 
    alpha.data.daily(stock.symbol).then(res => {
      console.log('Fetched', stock.symbol);
      const timeSeries = _.get(res, 'Time Series (Daily)', {});
      const day = timeSeries['2018-04-26'] || {};
      const start = Number(_.get(day, '4. start', 0));
      return { symbol: stock.symbol, start }
    })
  , { concurrency: 3 });
  return prices;
}*/
