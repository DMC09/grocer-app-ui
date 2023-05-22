import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      light: '#c0c6d6',
      main: '#071236',
      dark: '#00041d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#EAEAEA',
      main: '#EAEAEA',
      dark: '#9e9e9e',
      contrastText: '#000',
    },
    background: {
        paper: '#5F1A37',
        default: '#757ce8'
      },
  },
});
