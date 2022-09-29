import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from 'react-spring';
import { useStateContext, ContextProviderType } from '../../contexts/ContextProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isMobile } from 'react-device-detect';
import { Button, CircularProgress } from '@mui/material';
import logo from '../../assets/uniba.png';
import { claim } from '../../api/unibank';
import { ethers } from 'ethers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

export default function ModalClaim() {
    const { openClaimModal, setOpenClaimModal, tokensToClaim, setTokensToClaim } = useStateContext() as ContextProviderType;
    const [statusLastTx, setStatusLastTx] = React.useState<string>('');
    const [isTxSent, setIsTxSent] = React.useState<boolean>(false);

    if (isMobile) {
        style.width = '70%';
    }

    const handlePendingTx = async (hash: string) => {
        setStatusLastTx('pending');
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        let tx = await provider.getTransaction(hash)
        return tx.wait(1);
    }

    const handleClaim = async () => {
        let txHash = await claim();
        setIsTxSent(true);
        let txValue = await handlePendingTx(txHash.hash)
        if (txValue.status === 1) {
            setTokensToClaim('0.00');
            setStatusLastTx('success');
        }
    }

    const handleClose = () => {
        setOpenClaimModal(false); 
        setInterval(() => {
            setStatusLastTx(''); 
            setIsTxSent(false); 
        }, 500);
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    open={openClaimModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openClaimModal}>
                        <Box sx={style}>
                            <img src={logo} alt="Logo" width="70" style={{ margin: 'auto', display: 'block' }} />
                            <Typography align='center' id="spring-modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold", marginBottom: 1, marginTop: 1 }} >
                                Claim
                            </Typography>
                            {!isTxSent ? <Typography align='center' id="spring-modal-title" component="h2" sx={{ marginBottom: 2 }} >
                                UBT: {tokensToClaim}
                            </Typography> : <></>}
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
                                        </Box> : statusLastTx === 'failed' ?
                                            <Box style={{ textAlign: "center" }}>
                                                <Typography sx={{ marginBottom: '1rem' }}>Your tx has been confirmed!</Typography>
                                                <CancelIcon color='error' fontSize='large' />
                                            </Box> : <></>}
                            </Fade>
                            {!isTxSent ? <Button variant="outlined" style={{
                                width: '200px',
                                textAlign: 'center'
                            }} onClick={() => { handleClaim(); }}
                            disabled={Number(tokensToClaim) === 0}>
                                Claim
                            </Button> : <Button variant="outlined" style={{
                                width: '250px',
                                textAlign: 'center',
                                marginTop: '1rem',
                            }} onClick={handleClose}>
                                Close
                            </Button>}
                        </Box>
                    </Fade>
                </Modal>
            </ThemeProvider>
        </div >
    );
}
