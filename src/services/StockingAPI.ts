import axios, { HeadersDefaults } from 'axios';
import { Formatter } from 'utils/formatter';

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

export const stockingAPIInstance = axios.create({
  baseURL: 'http://localhost:3001',
});

stockingAPIInstance.defaults.headers = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndpbGlhbWpvYXF1aW1AZ21haWwuY29tIiwiaWF0IjoxNjYwNjgwMTQ5LCJleHAiOjE2NjUwMDAxNDksInN1YiI6IldpbGlhbSBKb2FxdWltIn0.Nqln4nCMDeU-EEtEqQEo7jdkuJx-MWuB13GM6bD-1ZM`,
} as CommonHeaderProperties;

export class StockingAPI {
  static async fetchQuote(stockName: string) {
    try {
      const { data } = await stockingAPIInstance.get<Quote>(
        `/stock/${stockName}/quote`
      );

      console.log(data);

      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }

  static async fetchHistory(
    stockName: string,
    initialDate: Date,
    finalDate: Date
  ) {
    try {
      const from = Formatter.isoText(initialDate);
      const to = Formatter.isoText(finalDate);
      const url = `/stocks/${stockName}/history?from=${from}&to=${to}`;
      const { data } = await stockingAPIInstance.get<History>(url);
      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }

  static async fetchStockGains(
    stockName: string,
    purchasedAt: Date,
    amount: number
  ) {
    try {
      const purchasedAtTxt = Formatter.isoText(purchasedAt);
      const url = `/stocks/${stockName}/gains?purchasedAt=${purchasedAtTxt}&purchasedAmount=${amount}`;
      const { data } = await stockingAPIInstance.get<StockGains>(url);
      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }

  static async fetchStockComparison(
    stockName: string,
    stocksToCompare: string[]
  ) {
    try {
      const url = `/stocks/${stockName}/compare`;
      const { data } = await stockingAPIInstance.get<ComparisonResult>(url, {
        params: { stocksToCompare: stocksToCompare },
      });

      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }
}

export class StockNotFoundError extends Error {
  constructor(stockName: string) {
    super(`Stock with name ${stockName} not found`);
  }
}

export type Quote = {
  name: string;
  lastPrice: number;
  pricedAt: string;
};

type ComparisonResult = {
  lastPrices: Quote[];
};

type History = {
  name: string;
  prices: HistoryEntry[];
};

type HistoryEntry = {
  opening: number;
  low: number;
  high: number;
  closing: number;
  pricedAt: string;
  volume: number;
};

type StockGains = {
  name: string;
  lastPrice: number;
  priceAtDate: number;
  purchasedAmount: number;
  purchasedAt: string;
  capitalGains: number;
};
