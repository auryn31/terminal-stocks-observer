import axios from 'axios';
import { HistoricalPrice, StockPrice } from '../models';

const BASE_URL = 'https://finance.yahoo.com';

const getCurrentData = (ticker: string): Promise<StockPrice> => {
  return axios
    .get<String>(`${BASE_URL}/quote/${ticker}/`)
    .then((data) => {
      const content = data.data;
      let startPosition = content.indexOf(`"${ticker}":{"sourceInterval"`) + `"${ticker}":`.length;
      let index = startPosition;
      let bracketsCounter = 0;
      for (let i = index; i < content.length; i++) {
        if (content[i] === '{') {
          bracketsCounter++;
        }
        if (content[i] === '}') {
          bracketsCounter--;
        }
        if (bracketsCounter === 0) {
          index = i;
          break;
        }
      }
      try {
        const result: StockPrice = JSON.parse(
          content.substr(startPosition, index - startPosition + 1)
        );
        return result;
      } catch (error) {
        return Promise.reject(`Could not parse data for ${ticker}`);
      }
    })
    .catch((error) => {
      return Promise.reject(`Could not load data for ${ticker}`);
    });
};

const getHistoricalPrices = (
  startMonth: number,
  startDay: number,
  startYear: number,
  endMonth: number,
  endDay: number,
  endYear: number,
  ticker: string,
  frequency: string
): Promise<Array<HistoricalPrice>> => {
  const startDate = Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0) / 1000);
  const endDate = Math.floor(Date.UTC(endYear, endMonth, endDay, 0, 0, 0) / 1000);

  return axios
    .get<String>(
      `${BASE_URL}/quote/${ticker}/history?period1=${startDate}&period2=${endDate}&interval=${frequency}&filter=history&frequency=${frequency}`
    )
    .then((data) => {
      try {
        const dateParser = (key: string, value: any) => {
          if (key === 'date') {
            return new Date(value);
          }
          return value;
        };
        const prices: Array<HistoricalPrice> = JSON.parse(
          data.data.split('HistoricalPriceStore":{"prices":')[1].split(',"isPending')[0],
          dateParser
        );
        return prices;
      } catch (error) {
        return Promise.reject(`Could not load historical data for ${ticker}`);
      }
    });
};

export { getCurrentData, getHistoricalPrices };
