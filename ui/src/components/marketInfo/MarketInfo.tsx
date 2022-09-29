import * as React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SavingsIcon from '@mui/icons-material/Savings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

import { ContextProviderType, useStateContext } from '../../contexts/ContextProvider';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#222222",
      light: "#222222",
      dark: "#bdbdbd",
      contrastText: "#333333",
    },
  },
  typography: {
    fontSize: 18,
    fontFamily: [
      "Montserrat",
      "sans-serif",
    ].join(','),
  },
});

export default function MarketInfo() {
  const { totalTVL, totalUserBalance, activePage } = useStateContext() as ContextProviderType;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'primary.contrastText',
          p: 2,
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
          width: '100%',
          color: 'primary.dark'
        }}>
        <Grid container direction="row" alignItems="center" padding={1}>
          <Grid item>
            {activePage === 'dashboard' ?
              <FontAwesomeIcon style={{ width: '75%' }} size="2x" icon={faWallet} /> :
              <ShowChartIcon color='success' />
            }
          </Grid>
          <Grid item paddingLeft={1}>
            <Typography >
              {activePage === 'dashboard' ?
                (<>Total User Balance: $ {totalUserBalance.toFixed(2)}</>) :
                (<>Total Market Size: $ {totalTVL.toFixed(2)}</>)
              }
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
