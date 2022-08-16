import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      retry: false,
    },
  },
});

export default function ReactQueryTestingProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
