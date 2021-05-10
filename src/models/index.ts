interface StockPrice {
  sourceInterval: number;
  quoteSourceName: string;
  regularMarketOpen: FiftyTwoWeekHigh;
  exchange: string;
  regularMarketTime: FiftyTwoWeekHigh;
  fiftyTwoWeekRange: { [key: string]: string };
  regularMarketDayHigh: FiftyTwoWeekHigh;
  shortName: string;
  longName: string;
  exchangeTimezoneName: string;
  regularMarketChange: FiftyTwoWeekHigh;
  regularMarketPreviousClose: FiftyTwoWeekHigh;
  fiftyTwoWeekHighChange: FiftyTwoWeekHigh;
  exchangeTimezoneShortName: string;
  fiftyTwoWeekLowChange: FiftyTwoWeekHigh;
  exchangeDataDelayedBy: number;
  regularMarketDayLow: FiftyTwoWeekHigh;
  priceHint: number;
  currency: string;
  regularMarketPrice: FiftyTwoWeekHigh;
  regularMarketVolume: RegularMarketVolume;
  isLoading: boolean;
  triggerable: boolean;
  gmtOffSetMilliseconds: number;
  firstTradeDateMilliseconds: number;
  region: string;
  marketState: string;
  quoteType: string;
  invalid: boolean;
  symbol: string;
  language: string;
  fiftyTwoWeekLowChangePercent: FiftyTwoWeekHigh;
  regularMarketDayRange: { [key: string]: string };
  messageBoardId: string;
  fiftyTwoWeekHigh: FiftyTwoWeekHigh;
  fiftyTwoWeekHighChangePercent: FiftyTwoWeekHigh;
  uuid: string;
  market: string;
  fiftyTwoWeekLow: FiftyTwoWeekHigh;
  regularMarketChangePercent: FiftyTwoWeekHigh;
  fullExchangeName: string;
  tradeable: boolean;
}

interface FiftyTwoWeekHigh {
  raw: number;
  fmt: string;
}

interface RegularMarketVolume {
  raw: number;
  fmt: string;
  longFmt: string;
}
interface HistoricalPrice {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose: number;
}

export { StockPrice, HistoricalPrice };
