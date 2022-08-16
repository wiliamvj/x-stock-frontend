import React from 'react';
import { act, render, fireEvent, waitFor, within } from '@testing-library/react';
import StocksCompare, { ColorsStockIndicator, StocksCompareProps } from '.';
import userEvent from '@testing-library/user-event';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { sleep } from 'utils/tests';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';

describe('StocksCompare', () => {
  let fetchStockComparisonSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchStockComparisonSpy = jest
      .spyOn(StockingAPI, 'fetchStockComparison')
      .mockResolvedValue(validComparisonResponse());
  });

  it('should be able of select the stocks to compare', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
    expect(stocksSelected[0]).toHaveTextContent('IBM');
    expect(elements.stockNameInput().value).toBe('');

    routines.typeInInputStockName('SATA{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected[0]).toHaveTextContent('SATA');
    expect(stocksSelected[1]).toHaveTextContent('IBM');
  });

  it('should prevent add stock already selected or empty string', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('IBM{enter}');
    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
    expect(stocksSelected[0]).toHaveTextContent('IBM');

    routines.typeInInputStockName('{space}{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);

    routines.typeInInputStockName('{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
  });

  it('should be able delete the stocks selected', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('AMBEV{enter}');

    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected).toHaveLength(2);

    await routines.deleteSelectedStock(1);

    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected).toHaveLength(1);
    expect(stocksSelected[0]).toHaveTextContent('AMBEV');
  });

  it('should load the comparison data after click compare button', async () => {
    fetchStockComparisonSpy.mockImplementation(() => sleep(200));
    const { elements, routines } = createSut({ stockName: 'Any' });

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('SATA{enter}');
    routines.clickInCompareButton();

    await waitFor(() => expect(fetchStockComparisonSpy).toHaveBeenCalledWith('Any', ['SATA', 'IBM']));
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });

  it('should display the comparison data after click compare button', async () => {
    const { elements, routines } = createSut({ stockName: 'Any' });

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('SATA{enter}');
    routines.clickInCompareButton();

    const stockComparing = await elements.stockRow(0);
    expect(stockComparing.elements.cell('name')).toHaveTextContent('IBM');
    expect(stockComparing.elements.cell('priced-at')).toHaveTextContent('27/10/2021');
    expect(stockComparing.elements.cell('price')).toHaveTextContent('R$ 125,17');
    routines.checkIfDontHaveAnyIndicator(stockComparing.elements.cell('price'));

    const stockToCompare1 = await elements.stockRow(1);
    expect(stockToCompare1.elements.cell('name')).toHaveTextContent('PETR4.SA');
    expect(stockToCompare1.elements.cell('priced-at')).toHaveTextContent('27/10/2021');
    expect(stockToCompare1.elements.cell('price')).toHaveTextContent('R$ 150,00');
    expect(stockToCompare1.elements.cell('price')).toHaveStyle(`background-color: ${ColorsStockIndicator.Up}`);
    routines.checkIfHasUpIndicator(stockToCompare1.elements.cell('price'));

    const stockToCompare2 = await elements.stockRow(2);
    expect(stockToCompare2.elements.cell('name')).toHaveTextContent('VALE3.SA');
    expect(stockToCompare2.elements.cell('priced-at')).toHaveTextContent('27/10/2021');
    expect(stockToCompare2.elements.cell('price')).toHaveTextContent('R$ 74,45');
    expect(stockToCompare2.elements.cell('price')).toHaveStyle(`background-color: ${ColorsStockIndicator.Down}`);
    routines.checkIfHasDownIndicator(stockToCompare2.elements.cell('price'));

    const stockToCompare3 = await elements.stockRow(3);
    expect(stockToCompare3.elements.cell('name')).toHaveTextContent('OUTRA.SA');
    expect(stockToCompare3.elements.cell('priced-at')).toHaveTextContent('27/10/2021');
    expect(stockToCompare3.elements.cell('price')).toHaveTextContent('R$ 125,17');
    expect(stockToCompare3.elements.cell('price')).toHaveStyle(`background-color: ${ColorsStockIndicator.Same}`);
    routines.checkIfDontHaveAnyIndicator(stockToCompare3.elements.cell('price'));
  });

  it('should display not found message when stock was not found', async () => {
    fetchStockComparisonSpy.mockRejectedValue(new StockNotFoundError('Any'));
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('SATA{enter}');
    routines.clickInCompareButton();

    expect(await elements.notFound()).toBeInTheDocument();
  });

  it('should display not stocks to compare', async () => {
    fetchStockComparisonSpy.mockResolvedValue(comparisonWithoutToCompareTarget());
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('SATA{enter}');
    routines.clickInCompareButton();

    expect(await elements.notFoundStocksToCompare()).toBeInTheDocument();
  });
});

function createSut(props: Partial<StocksCompareProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StocksCompare stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const stockNameInput = () => utils.getByTestId('stock-name-input') as HTMLInputElement;
  const compareButton = () => utils.getByTestId('compare-button') as HTMLInputElement;
  const stocksSelected = () => utils.findAllByTestId(/stock-selected-/);
  const stockSelected = (stockIndex: number) => utils.findByTestId(`stock-selected-${stockIndex}`);
  const loadingIndicator = () => utils.findByTestId('compare-loading-indicator');
  const notFound = () => utils.findByTestId('stock-not-found-message');
  const notFoundStocksToCompare = () => utils.findByTestId('not-found-stocks-to-compare');

  const stockRow = async (index: number) => {
    const row = await utils.findByTestId(`stock-row-${index}`);
    const rowUtils = within(row);
    const cell = (name: string) => rowUtils.getByTestId(`cell-${name}`);
    return { root: row, ...rowUtils, elements: { cell } };
  };

  const elements = {
    stockNameInput,
    stocksSelected,
    stockSelected,
    compareButton,
    loadingIndicator,
    stockRow,
    notFound,
    notFoundStocksToCompare,
  };

  const routines = {
    typeInInputStockName,
    deleteSelectedStock,
    clickInCompareButton,
    checkIfDontHaveAnyIndicator,
    checkIfHasDownIndicator,
    checkIfHasUpIndicator,
  };

  return { elements, routines, ...utils };

  function typeInInputStockName(text: string) {
    act(() => {
      userEvent.type(elements.stockNameInput(), text);
    });
  }

  async function deleteSelectedStock(stockIndex: number) {
    const stock = await elements.stockSelected(stockIndex);
    const deleteButton = stock.querySelector('.MuiChip-deleteIcon');
    act(() => {
      fireEvent.click(deleteButton as HTMLElement);
    });
  }

  function clickInCompareButton() {
    act(() => {
      fireEvent.click(elements.compareButton());
    });
  }

  function checkIfDontHaveAnyIndicator(element: HTMLElement) {
    const elementUtils = within(element);
    expect(elementUtils.queryByTestId('up-indicator')).not.toBeInTheDocument();
    expect(elementUtils.queryByTestId('down-indicator')).not.toBeInTheDocument();
  }

  function checkIfHasUpIndicator(element: HTMLElement) {
    const elementUtils = within(element);
    expect(elementUtils.getByTestId('up-indicator')).toBeInTheDocument();
  }

  function checkIfHasDownIndicator(element: HTMLElement) {
    const elementUtils = within(element);
    expect(elementUtils.getByTestId('down-indicator')).toBeInTheDocument();
  }
}

function validComparisonResponse() {
  return {
    lastPrices: [
      {
        name: 'IBM',
        lastPrice: 125.17,
        pricedAt: '2021-10-27',
      },
      {
        name: 'PETR4.SA',
        lastPrice: 150.0,
        pricedAt: '2021-10-27',
      },
      {
        name: 'VALE3.SA',
        lastPrice: 74.45,
        pricedAt: '2021-10-27',
      },
      {
        name: 'OUTRA.SA',
        lastPrice: 125.17,
        pricedAt: '2021-10-27',
      },
    ],
  };
}

function comparisonWithoutToCompareTarget() {
  return {
    lastPrices: [
      {
        name: 'IBM',
        lastPrice: 125.17,
        pricedAt: '2021-10-27',
      },
    ],
  };
}
