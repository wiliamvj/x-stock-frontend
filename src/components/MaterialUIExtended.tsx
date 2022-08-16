import { Box } from '@material-ui/system';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  testID?: string;
};

export function BoxCentered({ children, testID }: Props) {
  return (
    <Box data-testid={testID ?? ''} display="flex" alignItems="center" justifyContent="center" height="100%">
      {children}
    </Box>
  );
}
