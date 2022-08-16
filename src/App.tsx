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

const Results = [
  {
    symbol: 'APLE',
    name: 'Apple Hospitality REIT Inc',
    type: 'Equity',
    region: 'United States',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'UTC-04',
    currency: 'USD',
    matchScore: '0.8889',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    type: 'Equity',
    region: 'United States',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'UTC-04',
    currency: 'USD',
    matchScore: '0.7143',
  },
  {
    symbol: 'AAPL34.SAO',
    name: 'Apple Inc',
    type: 'Equity',
    region: 'Brazil/Sao Paolo',
    marketOpen: '10:00',
    marketClose: '17:30',
    timezone: 'UTC-03',
    currency: 'BRL',
    matchScore: '0.7143',
  },
  {
    symbol: 'APC.DEX',
    name: 'Apple Inc',
    type: 'Equity',
    region: 'XETRA',
    marketOpen: '08:00',
    marketClose: '20:00',
    timezone: 'UTC+02',
    currency: 'EUR',
    matchScore: '0.7143',
  },
  {
    symbol: 'APC.FRK',
    name: 'Apple Inc',
    type: 'Equity',
    region: 'Frankfurt',
    marketOpen: '08:00',
    marketClose: '20:00',
    timezone: 'UTC+02',
    currency: 'EUR',
    matchScore: '0.7143',
  },
  {
    symbol: 'AGPL',
    name: 'Apple Green Holding Inc',
    type: 'Equity',
    region: 'United States',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'UTC-04',
    currency: 'USD',
    matchScore: '0.6667',
  },
  {
    symbol: '0R2V.LON',
    name: 'Apple Inc.',
    type: 'Equity',
    region: 'United Kingdom',
    marketOpen: '08:00',
    marketClose: '16:30',
    timezone: 'UTC+01',
    currency: 'USD',
    matchScore: '0.6667',
  },
  {
    symbol: 'APRU',
    name: 'Apple Rush Company Inc',
    type: 'Equity',
    region: 'United States',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'UTC-04',
    currency: 'USD',
    matchScore: '0.4444',
  },
  {
    symbol: '500014.BSE',
    name: 'Apple Finance Limited',
    type: 'Equity',
    region: 'India/Bombay',
    marketOpen: '09:15',
    marketClose: '15:30',
    timezone: 'UTC+5.5',
    currency: 'INR',
    matchScore: '0.3846',
  },
  {
    symbol: '603020.SHH',
    name: 'Apple Flavor Fragrance Group Company Ltd',
    type: 'Equity',
    region: 'Shanghai',
    marketOpen: '09:30',
    marketClose: '15:00',
    timezone: 'UTC+08',
    currency: 'CNY',
    matchScore: '0.2222',
  },
];

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
