import { AppBar, Typography } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Box } from '@material-ui/system';
import { BoxCentered } from 'components/MaterialUIExtended';
import React, { useRef, useState } from 'react';
import {
  SearchBox,
  SearchIconBox,
  SearchInput,
  Tabs,
  Tab,
  Toolbar,
} from 'styles';
import { StockGains } from 'tabs/StockGains';
import StockHistory from 'tabs/StockHistory';
import StockQuote from 'tabs/StockQuote';
import StocksCompare from 'tabs/StocksCompare';

const TABS_INDEXES = {
  QUOTE: 0,
  HISTORY: 1,
  COMPARISON: 2,
  GAINS: 3,
};

export default function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [stockName, setStockName] = useState('');
  const [tab, setTab] = useState(0);

  function handleSubmitSearch(event: React.FormEvent) {
    event.preventDefault();
    setStockName(searchInputRef.current?.value ?? '');
  }

  return (
    <Box height="100%">
      <AppBar position="static">
        <Toolbar>
          <Tabs
            value={tab}
            onChange={(_, newTab) => setTab(newTab)}
            textColor="inherit"
          >
            <Tab label="Quote" data-testid="tab-button-quote" />
            <Tab label="History" data-testid="tab-button-history" />
            <Tab label="Comparison" data-testid="tab-button-compare" />
            <Tab label="Gains / Loss" data-testid="tab-button-gains" />
          </Tabs>
          <SearchBox onSubmit={handleSubmitSearch}>
            <SearchIconBox>
              <SearchIcon />
            </SearchIconBox>
            <SearchInput
              inputProps={{ 'data-testid': 'search-input' }}
              inputRef={searchInputRef}
              placeholder="Stock name..."
            />
          </SearchBox>
        </Toolbar>
      </AppBar>
      {Boolean(stockName) ? (
        <>
          {tab === TABS_INDEXES.QUOTE && <StockQuote stockName={stockName} />}
          {tab === TABS_INDEXES.HISTORY && (
            <StockHistory stockName={stockName} />
          )}
          {tab === TABS_INDEXES.COMPARISON && (
            <StocksCompare stockName={stockName} />
          )}
          {tab === TABS_INDEXES.GAINS && <StockGains stockName={stockName} />}
        </>
      ) : (
        <NeedFillStockName />
      )}
    </Box>
  );
}

function NeedFillStockName() {
  return (
    <BoxCentered testID="stock-name-need">
      <Typography color="gray" variant="h2">
        Search by a stock name above
      </Typography>
    </BoxCentered>
  );
}
