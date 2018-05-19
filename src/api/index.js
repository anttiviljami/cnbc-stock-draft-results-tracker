import * as yahooFinance from 'yahoo-finance';

import { teams } from './teams';

export async function apiHandler(req, res) {
  const stocks = await yahooFinance.quote({
    symbol: 'AAPL',
    modules: ['price'],
  }); 
  res.send({ stocks, teams });
}