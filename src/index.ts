import { plot } from 'asciichart';
import Table from 'cli-table';
import fs from 'fs';
import { getCurrentData } from './yahoo';
import { options, plotConfig, printOptions } from './config';
import { readFromLogs, writeToLog } from './fileHelper';

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
    console.log(plot(sums, plotConfig));
  }

  const runCrawling = () => {
    setTimeout(
      () => {
        Promise.all(
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
            console.log(`Time: ${new Date().toLocaleTimeString()}`);
            table.push(['TOTAL', '', `${sum.toFixed(2)} ${currency}`]);
            console.log(table.toString());
            sums.push(sum);
            console.log(plot(sums, plotConfig));
            writeToLog(sum);
            runCrawling();
          })
          .catch((error) => {
            console.error(error);
          });
      },
      options.timeout ? 1000 * options.timeout : 1000 * 60
    );
  };
  runCrawling();
}
