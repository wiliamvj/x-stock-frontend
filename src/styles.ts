import { InputBase, Tabs as MUITabs, Tab as MUITab, Toolbar as MUIToolbar } from '@material-ui/core';
import { styled, alpha } from '@mui/material/styles';

export const Tabs = styled(MUITabs)(() => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#fff',
  },
}));

export const Toolbar = styled(MUIToolbar)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export const Tab = styled(MUITab)(() => ({}));

export const SearchBox = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

export const SearchIconBox = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SearchInput = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));
