import * as React from 'react';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import logo from '../../assets/uniba.png';
import { useStateContext, ContextProviderType, injectedConnector } from '../../contexts/ContextProvider';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import AccountMenu from '../menuProfile/menuProfile'
import Button from '@mui/material/Button';
import { getTokenToClaim } from '../../api/unibank';
import ModalClaim from '../modalClaim/ModalClaim';
import { ethers } from 'ethers';

const Header = () => {
    const { activePage, setActivePage, setOpenModal, setOpenMenu, setAnchorMenuEl, setModalTitle, setModalDescription, setAccount, setOpenClaimModal, tokensToClaim, setTokensToClaim } = useStateContext() as ContextProviderType;
    const { account, activate, active } = useWeb3React<Web3Provider>()
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { ethereum } = window;
    let dashboardClicked = false;
    const location = useLocation();

    const [hasConnected, setHasConnected] = React.useState<boolean>(false);

    const walletConnect = async () => {
        const net: any = await ethereum!.request({ method: 'eth_chainId' });
        if (net === "0x4") {
            await activate(injectedConnector)
            let connectedAccount: string | null = await injectedConnector.getAccount()
            setAccount(connectedAccount!)
            setHasConnected(true);
        } else {
            setModalTitle('Network unsupported!')
            setModalDescription('Please change your network to Rinkeby!')
            setOpenModal(true)
        }
    }

    const headerRef = useRef<HTMLDivElement>(null);

    const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorMenuEl(event.currentTarget);
        setOpenMenu('profile');
    };

    React.useEffect(() => {
        const getClaimableTokens = async () => {
            if (account !== null && account !== undefined) {
                let tokens = await getTokenToClaim(account)
                setTokensToClaim(Number(ethers.utils.formatEther(tokens)).toFixed(2))
            }
        }

        getClaimableTokens();
        
        const intervalId = setInterval(getClaimableTokens, 30 * 1000)
    
        return () => clearInterval(intervalId);
    }, [account]);

    React.useEffect(() => {
        setActivePage(location.pathname.split('/')[1])
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current!.classList.add('shrink');
            } else {
                headerRef.current!.classList.remove('shrink');
            }
        }
        window.addEventListener('scroll', shrinkHeader);

        const isConnected = async () => {
            if (ethereum !== undefined) {
                const accounts: any = await ethereum.request({ method: 'eth_accounts' });
                if (accounts!.length > 0) await walletConnect()
                setIsLoading(false)
            }
        }

        isConnected()

        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, []);

    React.useEffect(() => {
        if (dashboardClicked && hasConnected) {
            setActivePage('dashboard')
            dashboardClicked = false;
        }
    }, [hasConnected]);

    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo" style={{ margin: 0 }}>
                    <Link to="/" onClick={() => { setActivePage("markets") }}>
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
                <div className="title">
                    <Link to="/" onClick={() => { setActivePage("markets") }}>
                        UniBank
                    </Link>
                </div>
                <ul className="header__nav">
                    <li key="Markets" className={((activePage === "markets" || activePage === "") ? 'active' : '') + ' pagesLinks'}>
                        <Link to='/markets' onClick={() => { setActivePage("markets") }}>
                            Markets
                        </Link>
                    </li>
                    <li key="Dashboard" className={(activePage === "dashboard" ? 'active' : '') + ' pagesLinks'}>
                        <Link
                            to={hasConnected ? '/dashboard' : '/markets'}
                            onClick={() => { if (hasConnected) { setActivePage("dashboard") } else { walletConnect(); dashboardClicked = true; } }}>
                            Dashboard
                        </Link>
                    </li>
                </ul>
                <ul className="header__nav header__nav__right">
                    {active ? 
                        <>
                            <li className="claim">
                                <Button 
                                    className='gradient-button gradient-button-3' 
                                    style={{width: "100%"}} 
                                    endIcon={<img src={logo} width="30" alt="Logo" />} 
                                    onClick={() => setOpenClaimModal(true)} >
                                    {tokensToClaim} UBT
                                </Button>
                                <ModalClaim />
                            </li>
                        </> : <></>
                    }
                    <li className="icon">
                        <div>
                            {active ? (
                                <>
                                    <div className="metaIcon" onClick={openProfileMenu}>
                                        <Jazzicon diameter={30} seed={jsNumberForAddress(account!)} />
                                    </div>
                                    <AccountMenu address={account} />
                                </>
                            )
                                :
                                (
                                    <>
                                        {!isLoading ? (<button
                                            className='gradient-button gradient-button-3'
                                            onClick={walletConnect}>
                                            Connect
                                        </button>) : null
                                        }
                                    </>
                                )}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
