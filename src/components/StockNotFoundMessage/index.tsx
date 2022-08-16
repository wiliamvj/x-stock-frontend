import { Box, Typography } from '@material-ui/core';
import React from 'react';

type Props = {
  stockName: string;
};

export default function StockNotFoundMessage({ stockName }: Props) {
  return (
    <Box>
      <Typography variant="body2" color="tomato" data-testid="stock-not-found-message">
        Stock with name "{stockName}" not found
      </Typography>
    </Box>
  );
}
