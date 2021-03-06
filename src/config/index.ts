import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.',
  },
  {
    name: 'timeout',
    type: Number,
    alias: 't',
    description: 'Timeout value in seconds',
    typeLabel: '<s>',
  },
  {
    name: 'log',
    alias: 'l',
    type: String,
    description: 'Where the results should saved',
  },
  {
    name: 'config',
    alias: 'c',
    type: String,
    description: 'Where the config is saved',
  },
  {
    name: 'plotHeight',
    alias: 'p',
    type: Number,
    description: 'How high the plot should be',
  },
  {
    name: 'plotWidth',
    alias: 'w',
    type: Number,
    description: 'How high the plot should be',
  },
];

const options = commandLineArgs(optionDefinitions) as Options;

const printOptions = () => {
  const usage = commandLineUsage([
    {
      header: 'Typical Example',
      content: 'A simple example demonstrating typical usage.',
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
    {
      content: 'Project home: {underline https://github.com/auryn31/terminal-stocks-observer.git}',
    },
  ]);
  console.log(usage);
};

const plotConfig = {
  height: options.plotHeight ?? 10,
  max: options.plotWidth ?? 20,
};

interface Options {
  timeout: number | undefined;
  plotHeight: number | undefined;
  plotWidth: number | undefined;
  config: string | undefined;
  log: string | undefined;
  help: boolean | undefined;
}

export { options, printOptions, plotConfig };
