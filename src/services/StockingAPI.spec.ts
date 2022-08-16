import { StockingAPI, StockNotFoundError, stockingAPIInstance } from './StockingAPI';

describe('StockingAPI', () => {
  let getApiSpy: jest.SpyInstance;

  beforeEach(() => {
    getApiSpy = jest.spyOn(stockingAPIInstance, 'get').mockResolvedValue({});
  });

  describe('fetchQuote', () => {
    it('should calls get with correct params', async () => {
      await StockingAPI.fetchQuote('any');
      expect(getApiSpy).toHaveBeenCalledWith('/stock/any/quote');
    });
    it('should throws StockNotFound when axios return 404 status code', async () => {
      getApiSpy.mockRejectedValue({
        response: { status: 404 },
      });
      const sut = StockingAPI.fetchQuote('any');
      await expect(sut).rejects.toThrow(new StockNotFoundError('any'));
    });
    it('should throw the error when get method throws', async () => {
      getApiSpy.mockRejectedValue(new Error('any'));
      const sut = StockingAPI.fetchQuote('any');
      await expect(sut).rejects.toThrow(new Error('any'));
    });
  });

  describe('fetchHistory', () => {
    it('should calls get with correct params', async () => {
      await StockingAPI.fetchHistory('any', new Date('2021-10-01'), new Date('2021-10-20'));
      expect(getApiSpy).toHaveBeenCalledWith('/stocks/any/history?from=2021-10-01&to=2021-10-20');
    });
    it('should throws StockNotFound when axios return 404 status code', async () => {
      getApiSpy.mockRejectedValue({
        response: { status: 404 },
      });
      const sut = StockingAPI.fetchHistory('any', new Date('2021-10-01'), new Date('2021-10-20'));
      await expect(sut).rejects.toThrow(new StockNotFoundError('any'));
    });
    it('should throw the error when get method throws', async () => {
      getApiSpy.mockRejectedValue(new Error('any'));
      const sut = StockingAPI.fetchHistory('any', new Date('2021-10-01'), new Date('2021-10-20'));
      await expect(sut).rejects.toThrow(new Error('any'));
    });
  });

  describe('fetchStockGains', () => {
    it('should calls get with correct params', async () => {
      await StockingAPI.fetchStockGains('any', new Date('2021-10-01'), 10);
      expect(getApiSpy).toHaveBeenCalledWith('/stocks/any/gains?purchasedAt=2021-10-01&purchasedAmount=10');
    });
    it('should throws StockNotFound when axios return 404 status code', async () => {
      getApiSpy.mockRejectedValue({
        response: { status: 404 },
      });
      const sut = StockingAPI.fetchStockGains('any', new Date('2021-10-01'), 10);
      await expect(sut).rejects.toThrow(new StockNotFoundError('any'));
    });
    it('should throw the error when get method throws', async () => {
      getApiSpy.mockRejectedValue(new Error('any'));
      const sut = StockingAPI.fetchStockGains('any', new Date('2021-10-01'), 10);
      await expect(sut).rejects.toThrow(new Error('any'));
    });
  });

  describe('fetchStockComparison', () => {
    it('should calls get with correct params', async () => {
      await StockingAPI.fetchStockComparison('any', ['any 1', 'any 2']);
      expect(getApiSpy).toHaveBeenCalledWith('/stocks/any/compare', {
        params: { stocksToCompare: ['any 1', 'any 2'] },
      });
    });
    it('should throws StockNotFound when axios return 404 status code', async () => {
      getApiSpy.mockRejectedValue({
        response: { status: 404 },
      });
      const sut = StockingAPI.fetchStockComparison('any', ['any 1', 'any 2']);
      await expect(sut).rejects.toThrow(new StockNotFoundError('any'));
    });
    it('should throw the error when get method throws', async () => {
      getApiSpy.mockRejectedValue(new Error('any'));
      const sut = StockingAPI.fetchStockComparison('any', ['any 1', 'any 2']);
      await expect(sut).rejects.toThrow(new Error('any'));
    });
  });
});
