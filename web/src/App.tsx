import React from 'react';
import './index.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Routes from './templates';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
    primary: {
      light: '#00fece',
      main: '#00fece',
      dark: '#00fece',
      contrastText: '#fff',
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#00fece',
      main: '#00fece',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    },
    // error: will use the default color
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Routes />
  </MuiThemeProvider>
);
export default App;
