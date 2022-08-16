import { render, waitFor } from '@testing-library/react';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import React from 'react';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import StockQuote, { StockQuoteProps } from '.';
import { sleep } from 'utils/tests';

describe('StockQuote', () => {
  let fetchQuoteSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchQuoteSpy = jest.spyOn(StockingAPI, 'fetchQuote').mockImplementation();
  });

  it('should call StockingAPI with stockName provided by props', async () => {
    fetchQuoteSpy.mockImplementation(() => sleep(100));
    const { elements } = createSut({ stockName: 'Any' });
    expect(await elements.loadingIndicator()).toBeInTheDocument();
    await waitFor(() => expect(fetchQuoteSpy).toHaveBeenCalledWith('Any'));
  });

  it('should renders the quote information when it is found', async () => {
    fetchQuoteSpy.mockResolvedValue({
      name: 'PETR4.SA',
      lastPrice: 27.18,
      pricedAt: '2021-10-22',
    });

    const { elements } = createSut();
    expect(await elements.lastPrice()).toBeInTheDocument();
    expect(await elements.lastPrice()).toHaveTextContent('R$ 27,18');

    expect(await elements.pricedAt()).toBeInTheDocument();
    expect(await elements.pricedAt()).toHaveTextContent('Priced At: 22/10/2021');
  });

  it('should display not found error when stock name isn"t found', async () => {
    fetchQuoteSpy.mockRejectedValue(new StockNotFoundError('any'));
    const { elements } = createSut();

    expect(await elements.notFound()).toHaveTextContent('Stock with name "any" not found');
  });
});

function createSut(props: Partial<StockQuoteProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StockQuote stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const loadingIndicator = () => utils.findByTestId('quote-loading-indicator');
  const lastPrice = () => utils.findByTestId('quote-last-price');
  const pricedAt = () => utils.findByTestId('quote-priced-at');
  const notFound = () => utils.findByTestId('stock-not-found-message');

  return { ...utils, elements: { loadingIndicator, lastPrice, pricedAt, notFound } };
}
