import Promise from 'bluebird';
import _ from 'lodash';
import alphaVantage from 'alphavantage';

import { teams } from './teams';

const alpha = alphaVantage({ key: process.env.ALPHA_VANTAGE_API_KEY });
const startDate = new Date('2018-04-26');
const now = new Date();

export async function apiHandler(req, res) {
  const stocks = _.flatMap(teams, 'picks');
  const { 'Stock Quotes': quotes } = await alpha.data.batch(_.map(stocks, 'symbol'));
  const btc = await alpha.crypto.intraday('btc', 'usd', );
  const btcPrice = _.get(_.find(btc['Time Series (Digital Currency Intraday)']), '1a. price (USD)', 0);
  const teamsWithPrices = teams.map((team) => {
    const { picks } = team;
    const picksWithPrices = picks.map((stock) => {
      const { symbol } = stock;
      const quote = _.find(quotes, { '1. symbol': stock.symbol });
      const stockPrice = _.get(quote, '2. price', 0);
      const price = symbol === 'BTX' ? Number(btcPrice) : Number(stockPrice);
      return { ...stock, price };
    })
    return { ...team, picks: picksWithPrices };
  });
  res.send({ teams: teamsWithPrices });
}

export async function getStartingPrices() {
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
}
