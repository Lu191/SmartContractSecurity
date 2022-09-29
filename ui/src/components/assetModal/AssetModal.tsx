import * as React from 'react';
import './assetModal.scss';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from 'react-spring';
import { useStateContext, ContextProviderType } from '../../contexts/ContextProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isMobile } from 'react-device-detect';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { approveToken, deposit, getTokenAllowanceByUser, TOKEN_CONTRACTS, UNIBA_CONTRACT, withdraw } from '../../api/unibank';
import { ethers } from 'ethers'
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface AssetType {
  children?: React.ReactElement;
  asset: string;
}

function VerticalLinearStepper(asset: AssetType) {
  const [activeStep, setActiveStep] = React.useState(0);
  const { maxSupply, userTokenBalance, modalType, userTokenAllowance, account, setUserTokenAllowance } = useStateContext() as ContextProviderType
  const [currentSupply, setCurrentSupply] = React.useState("");
  const [isTxSent, setIsTxSent] = React.useState<boolean>(false);
  const [error, setError] = React.useState<number>(0);
  const [statusLastTx, setStatusLastTx] = React.useState<string>('pending');

  const changeSupply = (event: any, amount?: string, type?: boolean) => {
    const whiteList = /^\d*\.?\d*$/;

    if (type) {
      setCurrentSupply(amount!)
    } else {
      if (event.target.value.length <= 20 && whiteList.test(event.target.value)) {
        setCurrentSupply(event.target.value)
      } else {
        event.target.value = currentSupply;
      }
    }
  }

  const changeWithdraw = (event: any, type?: boolean) => {
    const whiteList = /^\d*\.?\d*$/;

    if (type) {
      setCurrentSupply(userTokenBalance)
    } else {
      if (event.target.value.length <= 20 && whiteList.test(event.target.value)) {
        setCurrentSupply(event.target.value)
      } else {
        event.target.value = currentSupply;
      }
    }
  }

  let ethSteps = [
    {
      label: 'Supply',
      labelDescription: 'Supply your asset',
      components:
        (
          <>
            {!isTxSent ? <TextField
              value={currentSupply}
              onChange={changeSupply}
              id="input-with-icon-textfield"
              InputProps={{
                endAdornment: (
                  <Button variant="outlined" sx={{ margin: 1 }} onClick={(e) => { changeSupply(e, maxSupply, true) }} disabled={maxSupply === ""}>MAX</Button>
                ),
              }}
              variant="standard"
              error={error > 0}
              helperText={error === 1 ? "You don't have enough ETH" : ""}
            /> :
              <Fade in={isTxSent}>
                {statusLastTx === 'pending' ?
                  <Box style={{ textAlign: "center" }}>
                    <Typography sx={{ marginBottom: '1rem' }}>Your tx is in pending...</Typography>
                    <CircularProgress size={30} />
                  </Box>
                  : statusLastTx === 'success' ?
                  <Box style={{ textAlign: "center" }}>
                    <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                    <CheckCircleIcon color='success' fontSize='large' />
                  </Box>: statusLastTx === 'failed' ?
                  <Box style={{ textAlign: "center" }}>
                    <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                    <CancelIcon color='error' fontSize='large' />
                  </Box> : <></>}
              </Fade>
            }
          </>
        )
    },
    {
      label: 'Result',
      labelDescription: 'Last step',
      components:
        (<>
          <Typography>
            You successfully depostied your asset!
          </Typography>
        </>)
    },
  ]

  const tokenSteps = [
    {
      label: 'Approve',
      labelDescription: `Approve your asset, approved: ${userTokenAllowance !== '' ? userTokenAllowance : '0'}`,
      components: (
        <>
          {!isTxSent ? <TextField
            value={currentSupply}
            onChange={changeSupply}
            id="input-with-icon-textfield"
            InputProps={{
              endAdornment: (
                <Button variant="outlined" sx={{ margin: 1 }} onClick={(e) => { changeSupply(e, maxSupply, true) }} disabled={maxSupply === ""}>MAX</Button>
              ),
            }}
            variant="standard"
          /> :
            <Fade in={isTxSent}>
              {statusLastTx === 'pending' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx is in pending...</Typography>
                  <CircularProgress size={30} />
                </Box>
                : statusLastTx === 'success' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                  <CheckCircleIcon color='success' fontSize='large' />
                </Box>: statusLastTx === 'failed' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx has failed, please retry...</Typography>
                  <CancelIcon color='error' fontSize='large' />
                </Box> : <></>}
            </Fade>
          }
        </>
      ),
    },
    {
      label: 'Supply',
      labelDescription: 'Supply your asset',
      components:
        (<>
          {!isTxSent ? <TextField
            value={currentSupply}
            onChange={changeSupply}
            id="input-with-icon-textfield"
            InputProps={{
              endAdornment: (
                <Button variant="outlined" sx={{ margin: 1 }} onClick={(e) => { changeSupply(e, userTokenAllowance, true) }} disabled={maxSupply === ""}>MAX</Button>
              ),
            }}
            variant="standard"
            error={error > 0}
            helperText={error === 1 ? "You tried to supply more than what you have" : error === 2 ? "You tried to supply more than what you approved" : ""}
          /> :
            <Fade in={isTxSent}>
              {statusLastTx === 'pending' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx is in pending...</Typography>
                  <CircularProgress size={30} />
                </Box>
                : statusLastTx === 'success' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                  <CheckCircleIcon color='success' fontSize='large' />
                </Box>: statusLastTx === 'failed' ?
                  <Box style={{ textAlign: "center" }}>
                    <Typography sx={{ marginBottom: '1rem' }}>Your tx has failed, please retry...</Typography>
                    <CancelIcon color='error' fontSize='large' />
                  </Box> : <></>}
            </Fade>
          }
        </>)
    },
    {
      label: 'Result',
      labelDescription: 'Last step',
      components:
        (<>
          <Typography>
            You successfully depostied your asset!
          </Typography>
        </>)
    },
  ];

  const withdrawSteps = [
    {
      label: 'Withdraw',
      labelDescription: 'Withdraw your asset',
      components:
        (<>
          {!isTxSent ? <TextField
            value={currentSupply}
            onChange={changeWithdraw}
            id="input-with-icon-textfield"
            InputProps={{
              endAdornment: (
                <Button variant="outlined" sx={{ margin: 1 }} onClick={(e) => { changeWithdraw(e, true) }} disabled={userTokenBalance === ""}>MAX</Button>
              ),
            }}
            variant="standard"
            error={error > 0}
            helperText={error === 3 ? "You can't withdraw more than you deposited" : ""}
          /> :
            <Fade in={isTxSent}>
              {statusLastTx === 'pending' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx is in pending...</Typography>
                  <CircularProgress size={30} />
                </Box>
                : statusLastTx === 'success' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                  <CheckCircleIcon color='success' fontSize='large' />
                </Box>: statusLastTx === 'failed' ?
                <Box style={{ textAlign: "center" }}>
                  <Typography sx={{ marginBottom: '1rem' }}>Your tx has failed, please retry...</Typography>
                  <CancelIcon color='error' fontSize='large' />
                </Box> : <></>}
            </Fade>
          }
        </>)
    },
    {
      label: 'Result',
      labelDescription: 'Last step',
      components:
        (<>
          <Typography>
            You successfully withdraw your asset!
          </Typography>
        </>)
    },
  ];

  function bigNumberToFixedString(value: any, p: number, dec: number) {
    return (Number(value.toHexString()) / Math.pow(10, p)).toFixed(dec)
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePendingTx = async (hash: string) => {
    setIsTxSent(true);
    setStatusLastTx('pending');
    setError(0);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    let tx = await provider.getTransaction(hash)
    return tx.wait(1);
  }

  const successTxNext = () => {
    setStatusLastTx('success')
    setTimeout(() => {
      handleNext()
      setIsTxSent(false);
    }, 1000)
  }

  const handleApprove = async () => {
    setError(0)
    if (asset.asset !== 'ETH') {
      let txHash = await approveToken(TOKEN_CONTRACTS[asset.asset.toLowerCase()], currentSupply)
      handlePendingTx(txHash.hash).then(async () => {
        let tokenAllowanceByUser = await getTokenAllowanceByUser(account, UNIBA_CONTRACT, TOKEN_CONTRACTS[asset.asset.toLowerCase()])
        setUserTokenAllowance(bigNumberToFixedString(tokenAllowanceByUser, 18, asset.asset === 'WBTC' ? 8 : 2))
        successTxNext()
      }).catch(() => {
        setStatusLastTx('failed')
      });
    }
  }

  const handleDeposit = async () => {
    let txHash: any
    setError(0)
    if (Number(maxSupply) >= Number(currentSupply)) {
      txHash = await deposit(currentSupply)
      handlePendingTx(txHash.hash).then(() => {
        successTxNext()
      }).catch(() => {
        setStatusLastTx('failed')
      });
    } else {
      setError(1)
      setStatusLastTx('')
    }
  }

  const handleDepositToken = async () => {
    let txHash: any
    setError(0)
    if (Number(userTokenAllowance) >= Number(currentSupply)) {
      if (Number(maxSupply) >= Number(currentSupply)) { 
        txHash = await deposit(currentSupply, TOKEN_CONTRACTS[asset.asset.toLowerCase()])
        handlePendingTx(txHash.hash).then(() => {
          successTxNext()
        }).catch(() => {
          setStatusLastTx('failed')
        });
      } else {
        setError(1)
        setStatusLastTx('')
      }
    } else {
      setError(2)
      setStatusLastTx('')
    }
  }

  const handleWithdraw = async () => {
    let txHash: any;
    setError(0);
    if (Number(userTokenBalance) >= Number(currentSupply)) { 
      if (asset.asset !== 'ETH' && activeStep !== 2) {
        txHash = await withdraw(currentSupply, TOKEN_CONTRACTS[asset.asset.toLowerCase()])
      } else if (asset.asset === 'ETH' && activeStep !== 1) {
        txHash = await withdraw(currentSupply)
      }
      if (txHash !== undefined) {
        handlePendingTx(txHash.hash).then(() => {
          successTxNext()
        }).catch(() => {
          setStatusLastTx('failed')
        });
      }
    } else {
      setError(3)
      setStatusLastTx('')
    }
  }

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {(modalType === 'withdraw' ? withdrawSteps : (asset.asset === 'ETH' ? ethSteps : tokenSteps)).map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === activeStep ? (
                  <Typography variant="caption">{step.labelDescription}</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent transitionDuration={300}>
              <Box>
                {step.components}
              </Box>

              <Box sx={{ mb: 0 }}>
                <div>
                  {
                    !isTxSent ?
                    index !== (modalType === 'withdraw' ? withdrawSteps : (asset.asset === 'ETH' ? ethSteps : tokenSteps)).length - 1 ? <>
                      <Button
                        variant="contained"
                        onClick={(modalType === 'withdraw' && index === 0) ? handleWithdraw : (asset.asset !== 'ETH' && index === 0) ? handleApprove : asset.asset === 'ETH' ? handleDeposit : index === 1 ? handleDepositToken : () => { }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === (modalType === 'withdraw' ? withdrawSteps : (asset.asset === 'ETH' ? ethSteps : tokenSteps)).length - 1 ? 'Finish' : 'Confirm'}
                      </Button>
                      { asset.asset !== 'ETH' && modalType !== 'withdraw' && index <= 0 ? <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Next
                      </Button> : null
                      }
                    </> : null : null
                  }
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === (modalType === 'withdraw' ? withdrawSteps : (asset.asset === 'ETH' ? ethSteps : tokenSteps)).length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}

interface FadeProps {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#ffffff",
      contrastText: "#222222",
    },
  },
  typography: {
    fontFamily: [
      "Montserrat",
      "sans-serif",
    ].join(','),
  },
});

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

let style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400',
  border: 0,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  fontFamily: "Montserrat",
  bgcolor: 'primary.contrastText',
  fontSize: '1rem',
};

type AssetDetailsModalProps = {
  assetName: string,
}

export default function AssetDetailsModal({ assetName }: AssetDetailsModalProps) {
  const { openSupplyModal, setOpenSupplyModal, modalType, setOperationCompleted } = useStateContext() as ContextProviderType;

  if (isMobile) {
    style.width = '70%';
  }

  const open = openSupplyModal === assetName;

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={() => { setOpenSupplyModal(null); setOperationCompleted(true); }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography align='center' id="spring-modal-title" variant="h6" component="h2" sx={{ paddingBottom: 2 }}>
                {assetName.toUpperCase()} {modalType !== 'withdraw' ? "Supply" : "Withdraw"}
              </Typography>
              <VerticalLinearStepper asset={assetName} />

              <Box sx={{ paddingTop: 2 }}>
                <Button variant="outlined" style={{
                  width: '100%',
                  textAlign: 'center'
                }} onClick={() => { setOpenSupplyModal(null); setOperationCompleted(true); }}>
                  Close
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </ThemeProvider>
    </div>
  );
}
