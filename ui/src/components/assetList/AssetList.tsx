import * as React from 'react';
import { useLocation } from 'react-router-dom';
import './assetList.scss';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UNIBA_CONTRACT, TOKEN_CONTRACTS, getTVL, getUserBalance, getDepositedByUser, getTokenAllowanceByUser, estimateGasDepositETH } from '../../api/unibank'
import { getTokenFeed } from '../../api/price_feeds'
import shadows, { Shadows } from "@mui/material/styles/shadows";
import { useStateContext, ContextProviderType } from '../../contexts/ContextProvider';
import AssetDetailsModal from '../assetModal/AssetModal';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Eth from '../../assets/eth.png';
import Usdc from '../../assets/usdc.png';
import Dai from '../../assets/dai.png';
import Wbtc from '../../assets/wbtc.png';
import Ubt from '../../assets/uniba.png';

function createData(
  name: string,
  price: string | null,
  value: string,
  valueUsd: string,
  apr: string,
) {
  return {
    name,
    price,
    value,
    valueUsd,
    apr,
  };
}

const theme = createTheme({
  shadows: shadows.map(() => 'none') as Shadows,
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
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "0",

        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '0',
          boxShadow: '0',
          borderRadius: '0',
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          fontWeight: "900 !important",
        }
      }
    }
  }
});

function bigNumberToFixedString(value: any, p: number, dec: number) {
  return (Number(value.toHexString()) / Math.pow(10, p)).toFixed(dec)
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { account, setMaxSupply, setOpenSupplyModal, setUserTokenBalance, setUserTokenAllowance, activePage, setModalType } = useStateContext() as ContextProviderType;
  const { row } = props;

  const handleOpenSupplyModal = (assetName: string, type: string) => {
    if (account !== "") {
      setModalType(type);
      setOpenSupplyModal(assetName);
      let userBalance = assetName !== 'ETH' ? getUserBalance(account, TOKEN_CONTRACTS[assetName.toLowerCase()]) : getUserBalance(account)
      let depositedByUser = assetName !== 'ETH' ? getDepositedByUser(account, TOKEN_CONTRACTS[assetName.toLowerCase()]) : getDepositedByUser(account)
      let tokenAllowanceByUser = assetName !== 'ETH' ? getTokenAllowanceByUser(account, UNIBA_CONTRACT, TOKEN_CONTRACTS[assetName.toLowerCase()]) : null
      let promises = assetName !== 'ETH' ? [userBalance, depositedByUser, tokenAllowanceByUser] : [userBalance, depositedByUser]
      Promise.all(promises).then((value) => {
        if (assetName !== 'ETH') {
          setMaxSupply(bigNumberToFixedString(value[0], 18, assetName === 'WBTC' ? 8 : 2));
        } else {
          estimateGasDepositETH(bigNumberToFixedString(value[0], 18, 8)).then((estimatedGas: any) => {
            let eGas = Number(bigNumberToFixedString(estimatedGas, 18, 18)) * 10 ** 9
            let maxS = Number(bigNumberToFixedString(value[0], 18, 18))
            setMaxSupply((maxS - eGas * 2).toFixed(4).toString());
          });
        }
        setUserTokenBalance(bigNumberToFixedString(value[1], 18, assetName === 'WBTC' ? 8 : 2));
        if (assetName !== 'ETH') setUserTokenAllowance(bigNumberToFixedString(value[2], 18, assetName === 'WBTC' ? 8 : 2))
      });
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { border: 'unset' } }}>
        <TableCell component="th" scope="row" sx={{ color: 'primary.dark' }}>
          <div className='IconName'>
            {{
              'eth': <img src={Eth} style={{ width: 50 }} />,
              'usdc': <img src={Usdc} style={{ width: 50 }} />,
              'dai': <img src={Dai} style={{ width: 50 }} />,
              'wbtc': <img src={Wbtc} style={{ width: 50 }} />,
              'ubt': <img src={Ubt} style={{ width: 50 }} />
            }[row.name.toLowerCase()]}

            <div className='Name'>
              {row.name}
            </div>
          </div>
        </TableCell>
        <TableCell align="center" sx={{ color: 'primary.dark' }}>{row.price}</TableCell>
        <TableCell align="center" sx={{ color: 'primary.dark' }}>{row.value}</TableCell>
        <TableCell align="center" sx={{ color: 'primary.dark' }}>{row.valueUsd}</TableCell>
        <TableCell align="center" sx={{ color: 'primary.dark' }}>{row.apr}</TableCell>
        <TableCell sx={{ color: 'primary.dark', p: '0', textAlign: 'center' }}>
          {activePage === 'dashboard' ? (<>
            <Button color='inherit' variant='outlined' sx={{ marginRight: 2, "&:hover": { bgcolor: "#2E8B57" } }} onClick={() => { handleOpenSupplyModal(row.name, "supply") }}>
              <AddIcon />
            </Button>
            <Button color='inherit' variant='outlined' sx={{ marginRight: 2, "&:hover": { bgcolor: "#B22222" } }} onClick={() => { handleOpenSupplyModal(row.name, "withdraw") }}>
              <RemoveIcon />
            </Button>
          </>)
            :
            (
              <Button color='inherit' variant='outlined' sx={{ marginRight: 2 }} onClick={() => {
                const link = {
                  'eth': 'https://www.coingecko.com/en/coins/ethereum',
                  'usdc': 'https://www.coingecko.com/en/coins/usd-coin',
                  'dai': 'https://www.coingecko.com/en/coins/dai',
                  'wbtc': 'https://www.coingecko.com/en/coins/wrapped-bitcoin',
                  'ubt': 'https://rinkeby.etherscan.io/token/0x518ce992c0a18f0f32a6656a8993195bcaec12f8'
                }[row.name.toLowerCase()];
                window.open(link, '_blank'); return false;
              }}>
                Details
              </Button>
            )
          }
          <AssetDetailsModal assetName={row.name} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const AssetList = () => {
  const [rows, setRows] = React.useState<any>([]);
  const { setTotalTVL, setTotalUserBalance, operationCompleted, setOperationCompleted, } = useStateContext() as ContextProviderType;
  const activePage = useLocation().pathname.split('/')[1]
  const { ethereum } = window;

  React.useEffect(() => {
    let _rows: any[] = []

    function convertToUSD(value: string, price: string, dec: number): string {
      return (Number(value) * Number(price)).toFixed(dec);
    }

    function calculateShare(tvl: string, mult: number, totalTvl: number) {
      let t = Number(tvl)
      if (totalTvl > 0 && t > 0) return t * mult / totalTvl
      return 0
    }

    function calculateApr(tvl: string, share: number, totalShare: number) {
      let t = Number(tvl)
      if (t > 0) {
        let aproxRewardPerDay = 5760
        let aproxRewards = aproxRewardPerDay * share / totalShare
        let percentageApr = aproxRewards / t * 100
        return `${percentageApr.toFixed(2)} %`
      }
      return "NaN"
    }

    function mockRows() {
      setRows([createData('ETH', "NaN", "NaN", "NaN", "NaN"),
      createData('WBTC', "NaN", "NaN", "NaN", "NaN"),
      createData('USDC', "NaN", "NaN", "NaN", "NaN"),
      createData('DAI', "NaN", "NaN", "NaN", "NaN"),
      createData('UBT', "NaN", "NaN", "NaN", "NaN")])
    }

    async function fetchRows() {
      let ethPrice = getTokenFeed("ethusd");
      let btcPrice = getTokenFeed("btcusd");
      let daiPrice = getTokenFeed("daiusd");
      let usdcPrice = getTokenFeed("usdcusd");
      let ethTvl = getTVL();
      let wbtcTvl = getTVL(TOKEN_CONTRACTS["wbtc"]);
      let usdcTvl = getTVL(TOKEN_CONTRACTS["usdc"]);
      let daiTvl = getTVL(TOKEN_CONTRACTS["dai"]);
      let ubtTvl = getTVL(TOKEN_CONTRACTS["ubt"]);

      let promises = [ethPrice, btcPrice, daiPrice, usdcPrice, ethTvl, wbtcTvl, usdcTvl, daiTvl, ubtTvl];

      if (activePage === 'dashboard') {
        const accounts: string[] = await ethereum.request({ method: 'eth_accounts' });
        let ethUserBalance = getDepositedByUser(accounts[0]);
        let wbtcUserBalance = getDepositedByUser(accounts[0], TOKEN_CONTRACTS["wbtc"]);
        let usdcUserBalance = getDepositedByUser(accounts[0], TOKEN_CONTRACTS["usdc"]);
        let daiUserBalance = getDepositedByUser(accounts[0], TOKEN_CONTRACTS["dai"]);
        let ubtUserBalance = getDepositedByUser(accounts[0], TOKEN_CONTRACTS["ubt"]);
        promises = [...promises, ethUserBalance, wbtcUserBalance, usdcUserBalance, daiUserBalance, ubtUserBalance];
      }

      Promise.all(promises).then((value) => {
        let ethP = bigNumberToFixedString(value[0].answer, 8, 2);
        let wbtcP = bigNumberToFixedString(value[1].answer, 8, 2);
        let usdcP = bigNumberToFixedString(value[2].answer, 8, 2);
        let daiP = bigNumberToFixedString(value[3].answer, 8, 2);

        let ethT = bigNumberToFixedString(value[4], 18, 3);
        let wbtcT = bigNumberToFixedString(value[5], 18, 8);
        let usdcT = bigNumberToFixedString(value[6], 18, 2);
        let daiT = bigNumberToFixedString(value[7], 18, 2);
        let ubtT = bigNumberToFixedString(value[8], 18, 2);

        setTotalTVL(Number(convertToUSD(ethP, ethT, 2)) + Number(convertToUSD(wbtcT, wbtcP, 2)) + Number(convertToUSD(usdcT, usdcP, 2)) + Number(convertToUSD(daiT, daiP, 2)) + Number(ubtT));
        let totalTvl = Number(ethT) + Number(wbtcT) + Number(usdcT) + Number(daiT) + Number(ubtT)

        let ethShare = calculateShare(ethT, 0.3, totalTvl)
        let wbtcShare = calculateShare(wbtcT, 0.3, totalTvl)
        let usdcShare = calculateShare(usdcT, 0.1, totalTvl)
        let daiShare = calculateShare(daiT, 0.1, totalTvl)
        let ubtShare = calculateShare(ubtT, 0.6, totalTvl)
        let totalShare = ethShare + wbtcShare + usdcShare + daiShare + ubtShare

        let ethApr = calculateApr(ethT, ethShare, totalShare)
        let wbtcApr = calculateApr(wbtcT, wbtcShare, totalShare)
        let usdcApr = calculateApr(usdcT, usdcShare, totalShare)
        let daiApr = calculateApr(daiT, daiShare, totalShare)
        let ubtApr = calculateApr(ubtT, ubtShare, totalShare)

        if (activePage === 'markets' || activePage === '') {
          _rows.push(createData("ETH", ethP, ethT, convertToUSD(ethT, ethP, 2), ethApr))
          _rows.push(createData("WBTC", wbtcP, wbtcT, convertToUSD(wbtcT, wbtcP, 2), wbtcApr))
          _rows.push(createData("USDC", usdcP, usdcT, convertToUSD(usdcT, usdcP, 2), usdcApr))
          _rows.push(createData("DAI", daiP, daiT, convertToUSD(daiT, daiP, 2), daiApr))
          _rows.push(createData("UBT", "1.00", ubtT, ubtT, ubtApr))
        } else if (activePage === "dashboard") {
          let ethB = bigNumberToFixedString(value[9], 18, 3);
          let wbtcB = bigNumberToFixedString(value[10], 18, 8);
          let usdcB = bigNumberToFixedString(value[11], 18, 2);
          let daiB = bigNumberToFixedString(value[12], 18, 2);
          let ubtB = bigNumberToFixedString(value[13], 18, 2);

          setTotalUserBalance(Number(convertToUSD(ethB, ethP, 2)) +
            Number(convertToUSD(wbtcB, wbtcP, 2)) +
            Number(convertToUSD(usdcB, usdcP, 2)) +
            Number(convertToUSD(daiB, daiP, 2)) +
            Number(ubtB))

          _rows.push(createData("ETH", ethP, ethB, convertToUSD(ethB, ethP, 2), ethApr))
          _rows.push(createData("WBTC", wbtcP, wbtcB, convertToUSD(wbtcB, wbtcP, 2), wbtcApr))
          _rows.push(createData("USDC", usdcP, usdcB, convertToUSD(usdcB, usdcP, 2), usdcApr))
          _rows.push(createData("DAI", daiP, daiB, convertToUSD(daiB, daiP, 2), daiApr))
          _rows.push(createData("UBT", "1.00", ubtB, ubtB, ubtApr))
        }

        setRows(_rows);
      })
    }

    mockRows()
    fetchRows()

    setOperationCompleted(false);
  }, [operationCompleted])

  let styleContainer = {
    bgcolor: '',
    boxShadow: 0,
  }

  let styleCells = {
    paddingTop: '1.5em',
    bgcolor: 'primary.contrastText',
    width: '200',
    color: '#bdbdbd',
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} variant={'outlined'} sx={styleContainer} >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.contrastText' }} >
              <TableCell style={{ ...styleCells, fontWeight: 670 }} align="center">Asset</TableCell>
              <TableCell style={{ ...styleCells, fontWeight: 670 }} align="center">Price ($)</TableCell>
              <TableCell style={{ ...styleCells, fontWeight: 670 }} align="center">{(activePage === 'dashboard') ? 'Balance' : 'TVL'}</TableCell>
              <TableCell style={{ ...styleCells, fontWeight: 670 }} align="center">{(activePage === 'dashboard') ? 'Balance' : 'TVL'} ($)</TableCell>
              <TableCell style={{ ...styleCells, fontWeight: 670 }} align="center">APR</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styleCells}>
            {rows!.map((row: any) => (
              <Row key={row!.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default AssetList;
