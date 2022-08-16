import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from 'App';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import { StockingAPI } from 'services/StockingAPI';

describe('App', () => {
  let stockingAPISpies: { [key: string]: jest.SpyInstance | null } = {
    fetchQuote: null,
    fetchHistory: null,
    fetchStockGains: null,
    fetchStockComparison: null,
  };

  beforeEach(() => {
    stockingAPISpies.fetchQuote = jest.spyOn(StockingAPI, 'fetchQuote').mockImplementation();
    stockingAPISpies.fetchHistory = jest.spyOn(StockingAPI, 'fetchHistory').mockImplementation();
    stockingAPISpies.fetchStockGains = jest.spyOn(StockingAPI, 'fetchStockGains').mockImplementation();
    stockingAPISpies.fetchStockComparison = jest.spyOn(StockingAPI, 'fetchStockComparison').mockImplementation();
  });

  it('should renders the stock name need message when stock name is empty', async () => {
    const { elements } = createSut();
    expect(await elements.stockNameNeed()).toBeInTheDocument();
  });

  it('should be able navigate between all tabs', () => {
    const { elements, routines } = createSut();

    routines.fillTheSearch('IBM');

    routines.navigateToTab('quote');
    expect(elements.stockQuote()).toBeInTheDocument();

    expect(stockingAPISpies.fetchQuote).toBeCalled();

    routines.navigateToTab('history');
    expect(elements.stockHistory()).toBeInTheDocument();

    routines.navigateToTab('compare');
    expect(elements.stocksCompare()).toBeInTheDocument();

    routines.navigateToTab('gains');
    expect(elements.stockGains()).toBeInTheDocument();
  });
});

function createSut() {
  const utils = render(
    <ReactQueryTestingProvider>
      <App />
    </ReactQueryTestingProvider>
  );

  const stockNameNeed = () => utils.findByTestId('stock-name-need');
  const searchInput = utils.getByTestId('search-input');
  const stockQuote = () => utils.getByTestId('stock-quote');
  const stockHistory = () => utils.getByTestId('stock-history');
  const stockGains = () => utils.getByTestId('stock-gains');
  const stocksCompare = () => utils.getByTestId('stocks-compare');

  const elements = {
    stockNameNeed,
    stockGains,
    stockQuote,
    stockHistory,
    stocksCompare,
    searchInput,
  };

  const routines = {
    navigateToTab,
    fillTheSearch,
  };

  return { elements, routines, ...utils };

  function navigateToTab(tabName: string) {
    act(() => {
      fireEvent.click(utils.getByTestId(`tab-button-${tabName}`));
    });
  }

  function fillTheSearch(stockName: string) {
    act(() => {
      userEvent.type(elements.searchInput, `${stockName}{enter}`);
    });
  }
}
