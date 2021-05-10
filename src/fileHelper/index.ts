import fs from 'fs';
import { options } from '../config';

const readFromLogs = () => {
  if (options.log) {
    if (fs.existsSync(options.log)) {
      return fs
        .readFileSync(options.log)
        .toString()
        .split('\n')
        .map((it) => Number(it.split(',')[1]))
        .filter((it) => !isNaN(it));
    } else {
      fs.writeFileSync(options.log, '');
    }
  }
  return [];
};

const writeToLog = (sum: number) => {
  if (options.log) {
    fs.appendFileSync(
      options.log,
      `${new Date().toLocaleDateString('en-US')}T${new Date().toLocaleTimeString()}, ${sum}\n`
    );
  }
};

export { readFromLogs, writeToLog };
