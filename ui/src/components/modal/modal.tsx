import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from 'react-spring';
import { useStateContext, ContextProviderType } from '../../contexts/ContextProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isMobile } from 'react-device-detect';

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

export default function GeneralModal() {
    const { openModal, setOpenModal, fixedModal, modalTitle, modalDescription } = useStateContext() as ContextProviderType;

    if (isMobile) {
        style.width = '70%';
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    open={openModal}
                    onClose={() => { if(!fixedModal) setOpenModal(false) }}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <Box sx={style}>
                            <Typography align='center' id="spring-modal-title" variant="h6" component="h2">
                                {modalTitle}
                            </Typography>
                            <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                                {modalDescription}
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>
            </ThemeProvider>
        </div>
    );
}
