import 'swiper/swiper.min.css';
import './App.scss';

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/header/Header';
import Markets from './pages/markets/Markets';
import Dashboard from './pages/dashboard/Dashboard';
import GeneralModal from './components/modal/modal'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useStateContext, ContextProviderType } from './contexts/ContextProvider';
  
function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App() {
    const { setOpenModal, setFixedModal, setModalTitle, setModalDescription } = useStateContext() as ContextProviderType;
    
    const isMetaMaskInstalled = () => {
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };

    useEffect(() => {
        if (!isMetaMaskInstalled()) {
            setModalTitle('No metamask detected');
            setModalDescription('Please install metamask wallet to use our app!');
            setFixedModal(true);
            setOpenModal(true);
        }
      }, []);
    
    return (
        <BrowserRouter>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Header />
                <Routes>
                    <Route
                        path='/dashboard'
                        element={<Dashboard />}
                    />
                    <Route
                        path='/markets'
                        element={<Markets />}
                    />
                    <Route
                        path='/'
                        element={<Markets />}
                    />
                </Routes>
                <GeneralModal />
            </Web3ReactProvider>
        </BrowserRouter>
    );
}

export default App;
