import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { useQuery } from 'react-query';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { Formatter } from 'utils/formatter';
import StockNotFoundMessage from 'components/StockNotFoundMessage';
import { BoxCentered } from 'components/MaterialUIExtended';

export type StockQuoteProps = {
  stockName: string;
};

function useFetchStockQuote(stockName: string) {
  return useQuery(
    ['quote', stockName],
    () => StockingAPI.fetchQuote(stockName),
    {
      enabled: !!stockName,
    }
  );
}

export default function StockQuote({ stockName }: StockQuoteProps) {
  const { data: quote, isLoading, error } = useFetchStockQuote(stockName);

  return (
    <BoxCentered testID="stock-quote">
      {isLoading && <CircularProgress data-testid="quote-loading-indicator" />}
      {!isLoading && quote && !error && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography data-testid="quote-last-price" variant="h2" color="grey">
            {Formatter.brlCurrency(quote?.lastPrice)}
          </Typography>
          <Typography
            data-testid="quote-priced-at"
            variant="caption"
            align="center"
          >
            Priced At: {quote?.pricedAt.split('-').reverse().join('/')}
          </Typography>
        </Box>
      )}
      {error instanceof StockNotFoundError && (
        <StockNotFoundMessage stockName={stockName} />
      )}
    </BoxCentered>
  );
}
