import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { useStateContext, ContextProviderType } from '../../contexts/ContextProvider';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { createTheme, ThemeProvider } from '@mui/material/styles';

type Account = {
    address: string | null | undefined;
};

const theme = createTheme({
    typography: {
        fontFamily: [
            "Montserrat", 
            "sans-serif",
        ].join(','),
    },
});

type CheckPropType = {
  css: { color: any; position: string; top: number; left: number; strokeDasharray: number; strokeDashoffset: number; transition: string; };
}

function Check(props: CheckPropType) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
}

export default function AccountMenu({address}:Account) {
  // copy animation
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  // onpe/close menu
  const handleClose = () => {
    setOpenMenu(null);
    setAnchorMenuEl(null);
  };
  const { anchorMenuEl, setAnchorMenuEl, openMenu, setOpenMenu } = useStateContext() as ContextProviderType;

  const shortenAddress = (str: string | null | undefined) => {
    if (str!.length > 35) {
      return str!.substring(0, 6) + '...' + str!.substring(str!.length-6, str!.length);
    }
    return str;
  }

  const copyToClipboard = (text: string | null | undefined) => {
    navigator.clipboard.writeText(text!).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  const openExplorer = (text: string | null | undefined) => {
    window.open("https://rinkeby.etherscan.io/address/" + text!, '_blank')!.focus();
  }

  return (
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <Menu
                anchorEl={anchorMenuEl}
                id="account-menu"
                open={openMenu === 'profile'}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                <MenuItem onClick={() => { copyToClipboard(address); setCopied(true); }}>
                    <ListItemIcon>
                    {(copied ?
                      <Check
                        css={{
                          color: '#28a745',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          strokeDasharray: 50,
                          strokeDashoffset: copied ? 0 : -50,
                          transition: "all 300ms ease-in-out"
                        }}
                      />
                      :
                      <ContentCopyIcon fontSize="small" />
                    )}
                    </ListItemIcon>
                    {shortenAddress(address)}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {openExplorer(address); handleClose() }}>
                    <ListItemIcon>
                    <CallMadeIcon fontSize="small" />
                    </ListItemIcon>
                    View on explorer
                </MenuItem>
            </Menu>
        </ThemeProvider>
    </React.Fragment>
  );
}
