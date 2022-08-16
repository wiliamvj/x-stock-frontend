import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { sleep } from 'utils/tests';
import { StockGains, StockGainsProps } from '.';

describe('StockGains', () => {
  let fetchStockGainsSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchStockGainsSpy = jest.spyOn(StockingAPI, 'fetchStockGains').mockResolvedValue(validStockGains());
  });

  it('should display the inputs correctly', () => {
    const { elements } = createSut();

    expect(elements.purchaseAmountInput().value).toBe('10');
    expect(elements.purchaseDateInput().value).toBe('');
  });

  it('should should fetch the stock gains when all data is valid', async () => {
    fetchStockGainsSpy.mockImplementation(() => sleep(100));

    const { elements, fillInputs } = createSut({
      stockName: 'Any',
    });

    fillInputs();

    await waitFor(() => expect(fetchStockGainsSpy).toHaveBeenCalledWith('Any', new Date('2020-01-01'), 11));
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });

  it('should display the gains, the old price and the current price', async () => {
    const { elements, fillInputs } = createSut({
      stockName: 'Any',
    });

    fillInputs();

    expect(await elements.gainsLabel()).toHaveTextContent('+ R$ 2,40');
    expect(await elements.oldPriceLabel()).toHaveTextContent('R$ 14,11');
    expect(await elements.currentPriceLabel()).toHaveTextContent('R$ 14,35');
  });

  it('should display the loss when gains is negative', async () => {
    fetchStockGainsSpy.mockResolvedValue(validStockLoss());
    const { elements, fillInputs } = createSut({
      stockName: 'Any',
    });

    fillInputs();

    expect(await elements.gainsLabel()).toHaveTextContent('- R$ 2,40');
    expect(await elements.oldPriceLabel()).toHaveTextContent('R$ 14,35');
    expect(await elements.currentPriceLabel()).toHaveTextContent('R$ 14,11');
  });

  it('should display not found message when StockingAPI throw the StockNotFoundError', async () => {
    fetchStockGainsSpy.mockRejectedValue(new StockNotFoundError('Any'));

    const { elements, fillInputs } = createSut({
      stockName: 'Any',
    });

    fillInputs();

    expect(await elements.notFound()).toBeInTheDocument();
  });
});

function createSut(props: Partial<StockGainsProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StockGains stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const purchaseAmountInput = () => utils.getByTestId('gains-amount-input') as HTMLInputElement;
  const purchaseDateInput = () => utils.getByTestId('gains-date-input') as HTMLInputElement;
  const loadingIndicator = () => utils.findByTestId('gains-loading-indicator');
  const gainsLabel = () => utils.findByTestId('gains-label');
  const oldPriceLabel = () => utils.findByTestId('gains-old-price-label');
  const currentPriceLabel = () => utils.findByTestId('gains-current-price-label');
  const notFound = () => utils.findByTestId('stock-not-found-message');

  const elements = {
    purchaseAmountInput,
    purchaseDateInput,
    loadingIndicator,
    currentPriceLabel,
    oldPriceLabel,
    gainsLabel,
    notFound,
  };

  return { elements, ...utils, fillInputs };

  function fillInputs() {
    act(() => {
      fireEvent.change(elements.purchaseAmountInput(), { target: { value: '11' } });
      fireEvent.change(elements.purchaseDateInput(), { target: { value: '2020-01-01' } });
    });
  }
}

function validStockGains() {
  return {
    name: 'USIM5.SA',
    lastPrice: 14.35,
    priceAtDate: 14.11,
    purchasedAmount: 10,
    purchasedAt: '2021-01-20',
    capitalGains: 2.4000000000000057,
  };
}

function validStockLoss() {
  return {
    name: 'USIM5.SA',
    lastPrice: 14.11,
    priceAtDate: 14.35,
    purchasedAmount: 10,
    purchasedAt: '2021-01-20',
    capitalGains: -2.4000000000000057,
  };
}
