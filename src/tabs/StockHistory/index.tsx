import { CircularProgress, TextField, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import {
  DataGrid,
  GridColumns,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { BoxCentered } from 'components/MaterialUIExtended';
import StockNotFoundMessage from 'components/StockNotFoundMessage';
import { isAfter, isBefore, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { Clock } from 'utils/clock';
import { Formatter } from 'utils/formatter';

export type StockHistoryProps = {
  stockName: string;
};

function useFetchStockHistory(
  stockName: string,
  initialDate: Date,
  finalDate: Date
) {
  return useQuery(
    ['quote', stockName, initialDate, finalDate],
    () => StockingAPI.fetchHistory(stockName, initialDate, finalDate),
    {
      enabled: !!stockName && isAfter(finalDate, initialDate),
    }
  );
}

const valueFormatterBRL = (params: GridValueFormatterParams) =>
  Formatter.brlCurrency(Number(params.value ?? 0));
const valueFormatterDate = (params: GridValueFormatterParams) =>
  Formatter.dateUTC(new Date(params.value as string), 'dd/MM/yyyy');

const columns: GridColumns = [
  {
    field: 'pricedAt',
    headerName: 'Date',
    width: 200,
    valueFormatter: valueFormatterDate,
  },
  {
    field: 'opening',
    headerName: 'Opening',
    width: 200,
    valueFormatter: valueFormatterBRL,
  },
  {
    field: 'low',
    headerName: 'Low',
    width: 200,
    valueFormatter: valueFormatterBRL,
  },
  {
    field: 'high',
    headerName: 'High',
    width: 200,
    valueFormatter: valueFormatterBRL,
  },
  {
    field: 'closing',
    headerName: 'Closing',
    width: 200,
    valueFormatter: valueFormatterBRL,
  },
];

export default function StockHistory({ stockName }: StockHistoryProps) {
  const [initialDate, setInitialDate] = useState(subDays(Clock.now(), 30));
  const [finalDate, setFinalDate] = useState(Clock.now());

  const {
    data: history,
    isLoading,
    error,
  } = useFetchStockHistory(stockName, initialDate, finalDate);

  const initialDateStr = useMemo(
    () => Formatter.isoText(initialDate),
    [initialDate]
  );
  const finalDateStr = useMemo(() => Formatter.isoText(finalDate), [finalDate]);

  const isInvalidRangeDate = useMemo(
    () => isBefore(finalDate, initialDate),
    [initialDate, finalDate]
  );

  function handleInitialDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInitialDate(new Date(event.target.value));
  }

  function handleFinalDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFinalDate(new Date(event.target.value));
  }

  const todayIsoText = useMemo(() => {
    return Formatter.isoText(new Date());
  }, []);

  return (
    <Box height="100%" data-testid="stock-history">
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="center" p={2}>
          <TextField
            type="date"
            label="Initial Date"
            onChange={handleInitialDateChange}
            value={initialDateStr}
            inputProps={{
              'data-testid': 'history-initial-date',
              max: todayIsoText,
            }}
          />
          <TextField
            type="date"
            label="Final Date"
            onChange={handleFinalDateChange}
            value={finalDateStr}
            inputProps={{
              'data-testid': 'history-final-date',
              max: todayIsoText,
            }}
          />
        </Box>
        {isInvalidRangeDate && (
          <Typography
            data-testid="invalid-date-range-message"
            align="center"
            color="red"
          >
            The final date need be greater than initial date!
          </Typography>
        )}
      </Box>
      {isLoading && (
        <BoxCentered>
          <CircularProgress data-testid="history-loading-indicator" />
        </BoxCentered>
      )}
      {!isLoading && history && (
        <Box p={2}>
          <DataGrid
            rowsPerPageOptions={[100]}
            disableColumnMenu
            columns={columns}
            rows={history.prices.map((price) => ({
              id: price.pricedAt,
              ...price,
            }))}
          />
        </Box>
      )}
      {error instanceof StockNotFoundError && (
        <Box display="flex" justifyContent="center">
          <StockNotFoundMessage stockName={stockName} />
        </Box>
      )}
    </Box>
  );
}
