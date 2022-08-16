import { act, render, fireEvent } from '@testing-library/react';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { Clock } from 'utils/clock';
import { sleep } from 'utils/tests';
import StockHistory, { StockHistoryProps } from '.';

describe('StockHistory', () => {
  let fetchHistorySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(Clock, 'now').mockReturnValue(new Date('2021-10-30T10:00:00.000Z'));
    fetchHistorySpy = jest.spyOn(StockingAPI, 'fetchHistory').mockResolvedValue(validHistory());
  });

  it('should display the loading indicator', async () => {
    fetchHistorySpy.mockImplementation(() => sleep(100));
    const { elements } = createSut();
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });

  it('should display the initial date picker and final date picker', async () => {
    jest.spyOn(Clock, 'now').mockReturnValue(new Date('2021-10-30T10:00:00.000Z'));
    const { elements } = createSut();

    expect((await elements.initialDate()).value).toBe('2021-09-30');
    expect((await elements.finalDate()).value).toBe('2021-10-30');
  });

  it('should display the DataGrid after load history', async () => {
    const { elements } = createSut();
    expect(await elements.dataGrid()).toBeInTheDocument();
  });

  it('should display not found error when stock name isn"t found', async () => {
    fetchHistorySpy.mockRejectedValue(new StockNotFoundError('any'));
    const { elements } = createSut();

    expect(await elements.notFound()).toHaveTextContent('Stock with name "any" not found');
  });

  it('should update the date of initial date picker and final date picker', async () => {
    const { elements } = createSut();

    const initialDateInput = await elements.initialDate();
    const finalDateInput = await elements.finalDate();

    act(() => {
      fireEvent.change(initialDateInput, { target: { value: '2020-10-01' } });
    });
    expect(initialDateInput.value).toBe('2020-10-01');

    act(() => {
      fireEvent.change(finalDateInput, { target: { value: '2021-10-01' } });
    });
    expect(finalDateInput.value).toBe('2021-10-01');
  });

  it('should display the error message when range date is invalid', async () => {
    const { elements } = createSut();

    const initialDateInput = await elements.initialDate();
    const finalDateInput = await elements.finalDate();

    act(() => {
      fireEvent.change(initialDateInput, { target: { value: '2021-10-01' } });
    });
    act(() => {
      fireEvent.change(finalDateInput, { target: { value: '2021-09-25' } });
    });

    expect(await elements.invalidDateRangeMessage()).toBeInTheDocument();
  });
});

function createSut(props: Partial<StockHistoryProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StockHistory stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const loadingIndicator = () => utils.findByTestId('history-loading-indicator');
  const initialDate = async () => (await utils.findByTestId('history-initial-date')) as HTMLInputElement;
  const finalDate = async () => (await utils.findByTestId('history-final-date')) as HTMLInputElement;
  const dataGrid = () => utils.findByRole('grid');
  const notFound = () => utils.findByTestId('stock-not-found-message');
  const invalidDateRangeMessage = () => utils.findByTestId('invalid-date-range-message');

  return {
    ...utils,
    elements: {
      loadingIndicator,
      initialDate,
      finalDate,
      dataGrid,
      notFound,
      invalidDateRangeMessage,
    },
  };
}

function validHistory() {
  return {
    name: 'any',
    prices: [
      {
        opening: 14.05,
        low: 13.77,
        high: 14.6,
        closing: 14.35,
        pricedAt: '2021-10-22',
        volume: 36461100,
      },
      {
        opening: 14.49,
        low: 13.77,
        high: 14.61,
        closing: 14.16,
        pricedAt: '2021-10-21',
        volume: 34002600,
      },
      {
        opening: 15.68,
        low: 14.85,
        high: 15.68,
        closing: 15.01,
        pricedAt: '2021-10-20',
        volume: 36340900,
      },
    ],
  };
}
