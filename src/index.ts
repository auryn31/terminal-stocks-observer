import { plot } from 'asciichart';
import Table from 'cli-table';
import fs from 'fs';
import { getCurrentData } from './yahoo';
import { options, plotConfig, printOptions } from './config';
import { readFromLogs, writeToLog } from './fileHelper';
import moment from 'moment';

if (options.help || !options.config) {
  printOptions();
} else {
  const data = fs
    .readFileSync(options.config)
    .toString()
    .split('\n')
    .map((it) => {
      const line = it.split(',');
      return { ticker: line[0], amount: Number(line[1]) };
    });
  console.clear();
  let sums = readFromLogs();

  if (sums.length) {
    console.log(`Start crawling with log data:`);
    console.log(plot(sums.slice(-(options.plotWidth ?? 30)), plotConfig));
  }

  const crawlingIteration = () => {
    return Promise.all(
      data.map(async (it) => {
        const data = await getCurrentData(it.ticker);
        return { stockprice: data, amount: it.amount, ticker: it.ticker };
      })
    )
      .then((data) => {
        console.clear();
        const currency = data.length ? data[0].stockprice.currency : ' $';
        const table = new Table({
          head: ['Name', 'Ticker', `Sum in ${currency}`],
        });
        const sum = data
          .map((it) => {
            const sum = it.amount * it.stockprice.regularMarketPrice.raw;
            table.push([
              it.stockprice.shortName,
              it.ticker,
              `${sum.toFixed(2)} ${it.stockprice.currency}`,
            ]);
            return sum;
          })
          .reduce((a, b) => a + b);
        const momentFormat = 'HH:mm:SS';
        console.log(
          `Last run: ${moment().format(momentFormat)} \tNext run ${moment()
            .add(options.timeout ? options.timeout : 60, 'seconds')
            .format(momentFormat)}`
        );
        sums.push(sum);
        table.push(['ATH', '', `${Math.max(...sums).toFixed(2)} ${currency}`]);
        table.push(['TOTAL', '', `${sum.toFixed(2)} ${currency}`]);
        console.log(table.toString());
        console.log(plot(sums.slice(-(options.plotWidth ?? 30)), plotConfig));
        writeToLog(sum);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const startCrawlingInterval = () => {
    setTimeout(
      () => {
        crawlingIteration().then(startCrawlingInterval);
      },
      options.timeout ? 1000 * options.timeout : 1000 * 60
    );
  };
  crawlingIteration();
  startCrawlingInterval();
}
