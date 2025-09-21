import React from 'react';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './templates';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppRoutes />
  </ThemeProvider>
);
export default App;
