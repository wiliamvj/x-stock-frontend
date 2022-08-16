import { CircularProgress, TextField, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import StockNotFoundMessage from 'components/StockNotFoundMessage';
import { isValid } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { Formatter } from 'utils/formatter';
import { Form } from './styles';

function useFetchStockGains(stockName: string, purchasedAt: Date | null, amount: number) {
  return useQuery(
    ['quote', stockName, purchasedAt, amount],
    () => StockingAPI.fetchStockGains(stockName, purchasedAt as Date, amount),
    {
      enabled: !!stockName && isValid(purchasedAt) && amount > 0,
    }
  );
}

export type StockGainsProps = {
  stockName: string;
};

export function StockGains({ stockName }: StockGainsProps) {
  const [amount, setAmount] = useState(10);
  const [date, setDate] = useState<Date | null>(null);

  const { data, isLoading, error } = useFetchStockGains(stockName, date, amount);

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextDate = new Date(event.target.value);
    if (isValid(nextDate)) {
      setDate(nextDate);
    }
  }

  const dateIsoText = useMemo(() => (date ? Formatter.isoText(date) : ''), [date]);

  const todayIsoText = useMemo(() => {
    return Formatter.isoText(new Date());
  }, []);

  const signal = (data?.capitalGains ?? 0) < 0 ? '-' : '+';
  const textIndicator = signal === '-' ? 'Loss' : 'Gains';

  return (
    <Box data-testid="stock-gains">
      <Form>
        <TextField
          type="number"
          value={amount}
          label="Purchase Stock Amount"
          onChange={(e) => setAmount(Number(e.target.value))}
          inputProps={{ 'data-testid': 'gains-amount-input' }}
        />
        <TextField
          type="date"
          value={dateIsoText}
          label="Purchase Date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleDateChange}
          inputProps={{ 'data-testid': 'gains-date-input', max: todayIsoText }}
        />
      </Form>
      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress data-testid="gains-loading-indicator" />
        </Box>
      )}
      {!isLoading && data && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="gray">
            {textIndicator}
          </Typography>
          <Typography data-testid="gains-label" variant="h2" color={data.capitalGains > 0 ? 'limegreen' : 'red'}>
            {signal} {Formatter.brlCurrency(Math.abs(data.capitalGains))}
          </Typography>
          <Box>
            <Typography data-testid="gains-old-price-label" color="gray" align="center">
              Price at {Formatter.dateUTC(new Date(data.purchasedAt), 'dd/MM/yyyy')}:{' '}
              {Formatter.brlCurrency(data.priceAtDate)}
            </Typography>
            <Typography data-testid="gains-current-price-label" color="gray" align="center">
              Price today: {Formatter.brlCurrency(data.lastPrice)}
            </Typography>
          </Box>
        </Box>
      )}
      {!isLoading && error instanceof StockNotFoundError && (
        <Box display="flex" justifyContent="center">
          <StockNotFoundMessage stockName={stockName} />
        </Box>
      )}
    </Box>
  );
}
