import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers';

type Props = {
    children: React.ReactNode;
};

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        4, // Rinkeby
    ],
})

const { REACT_APP_ALCHEMY_RPC } = process.env;

export type AssetTvlType = {
    [key: string]: string
}

export type ContextProviderType = {
    account: string;
    setAccount: Dispatch<SetStateAction<string>>;
    activePage: string;
    setActivePage: Dispatch<SetStateAction<string>>;
    openClaimModal: boolean;
    setOpenClaimModal: Dispatch<SetStateAction<boolean>>;
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    openSupplyModal: null | string;
    setOpenSupplyModal: Dispatch<SetStateAction<null | string>>;
    fixedModal: boolean;
    setFixedModal: Dispatch<SetStateAction<boolean>>;
    openMenu: null | string;
    setOpenMenu: Dispatch<SetStateAction<null | string>>;
    anchorMenuEl: null | HTMLElement;
    setAnchorMenuEl: Dispatch<SetStateAction<null | HTMLElement>>;
    assetSelected: null | string;
    setAssetSelected: Dispatch<SetStateAction<null | string>>;
    modalTitle: string;
    setModalTitle: Dispatch<SetStateAction<string>>;
    modalDescription: string;
    setModalDescription: Dispatch<SetStateAction<string>>;
    signer: null | JsonRpcSigner;
    setSigner: Dispatch<SetStateAction<null | JsonRpcSigner>>;
    tokenTVLs: null | AssetTvlType;
    setTokenTVLs: Dispatch<SetStateAction<null | AssetTvlType>>;
    maxSupply: string;
    setMaxSupply: Dispatch<SetStateAction<string>>;
    totalTVL: number;
    setTotalTVL: Dispatch<SetStateAction<number>>;
    totalUserBalance: number;
    setTotalUserBalance: Dispatch<SetStateAction<number>>;
    userTokenBalance: string;
    setUserTokenBalance: Dispatch<SetStateAction<string>>;
    userTokenAllowance: string;
    setUserTokenAllowance: Dispatch<SetStateAction<string>>;
    modalType: string;
    setModalType: Dispatch<SetStateAction<string>>;
    operationCompleted: boolean;
    setOperationCompleted: Dispatch<SetStateAction<boolean>>;
    tokensToClaim: string;
    setTokensToClaim: Dispatch<SetStateAction<string>>;
};

const initialContext: ContextProviderType = {
    account: "",
    setAccount: (): void => {
        throw new Error('setAccount function must be overridden');
    },
    activePage: "markets",
    setActivePage: (): void => {
        throw new Error('setActivePage function must be overridden');
    },
    openClaimModal: false,
    setOpenClaimModal: (): void => {
        throw new Error('setOpenModal function must be overridden');
    },
    openModal: false,
    setOpenModal: (): void => {
        throw new Error('setOpenModal function must be overridden');
    },
    openSupplyModal: null,
    setOpenSupplyModal: (): void => {
        throw new Error('setOpenModal function must be overridden');
    },
    fixedModal: false,
    setFixedModal: (): void => {
        throw new Error('setFixedModal function must be overridden');
    },
    openMenu: null,
    setOpenMenu: (): void => {
        throw new Error('setOpenMenu function must be overridden');
    },
    anchorMenuEl: null,
    setAnchorMenuEl: (): void => {
        throw new Error('setAnchorMenuEl function must be overridden');
    },
    assetSelected: null,
    setAssetSelected: (): void => {
        throw new Error('setAssetSelected function must be overridden');
    },
    modalTitle: "",
    setModalTitle: (): void => {
        throw new Error('setModalTitle function must be overridden');
    },
    modalDescription: "",
    setModalDescription: (): void => {
        throw new Error('setModalDescription function must be overridden');
    },
    signer: null,
    setSigner: (): void => {
        throw new Error('setSigner function must be overridden');
    },
    tokenTVLs: null,
    setTokenTVLs: (): void => {
        throw new Error('setTokenTVLs function must be overridden');
    },
    maxSupply: "",
    setMaxSupply: (): void => {
        throw new Error('setMaxSupply function must be overridden');
    },
    totalTVL: 0,
    setTotalTVL: (): void => {
        throw new Error('setTotalTVL function must be overridden');
    },
    totalUserBalance: NaN,
    setTotalUserBalance: (): void => {
        throw new Error('setTotalUserBalance function must be overridden');
    },
    userTokenBalance: "",
    setUserTokenBalance: (): void => {
        throw new Error('setUserTokenBalance function must be overridden');
    },
    userTokenAllowance: "",
    setUserTokenAllowance: (): void => {
        throw new Error('setUserTokenAllowance function must be overridden');
    },
    modalType: "",
    setModalType: (): void => {
        throw new Error('setModalType function must be overridden');
    },
    operationCompleted: false,
    setOperationCompleted: (): void => {
        throw new Error('setOperationCompleted function must be overridden');
    },
    tokensToClaim: '0',
    setTokensToClaim: (): void => {
        throw new Error('setTokensToClaim function must be overridden');
    },
};

const StateContext = createContext<ContextProviderType | null>(initialContext);

export const ethersProvider = new ethers.providers.JsonRpcProvider(REACT_APP_ALCHEMY_RPC);

export const ContextProvider = ({ children }: Props) => {
    const [account, setAccount] = useState<string>("");
    const [activePage, setActivePage] = useState<string>("markets");
    const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openSupplyModal, setOpenSupplyModal] = useState<null | string>(null);
    const [fixedModal, setFixedModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalDescription, setModalDescription] = useState<string>("");
    const [openMenu, setOpenMenu] = useState<null | string>(null);
    const [anchorMenuEl, setAnchorMenuEl] = useState<null | HTMLElement>(null);
    const [assetSelected, setAssetSelected] = useState<null | string>(null);
    const [signer, setSigner] = useState<null | JsonRpcSigner>(null);
    const [tokenTVLs, setTokenTVLs] = useState<null | AssetTvlType>(null);
    const [maxSupply, setMaxSupply] = useState<string>("");
    const [totalTVL, setTotalTVL] = useState<number>(0);
    const [totalUserBalance, setTotalUserBalance] = useState<number>(NaN);
    const [userTokenBalance, setUserTokenBalance] = useState<string>("");
    const [userTokenAllowance, setUserTokenAllowance] = useState<string>("");
    const [modalType, setModalType] = useState<string>("");
    const [operationCompleted, setOperationCompleted] = useState<boolean>(false);
    const [tokensToClaim, setTokensToClaim] = useState<string>("0");

    return (
        <StateContext.Provider value={{
            account, setAccount,
            activePage, setActivePage,
            openClaimModal, setOpenClaimModal,
            openModal, setOpenModal,
            openSupplyModal, setOpenSupplyModal,
            fixedModal, setFixedModal,
            openMenu, setOpenMenu,
            anchorMenuEl, setAnchorMenuEl,
            assetSelected, setAssetSelected,
            modalTitle, setModalTitle,
            modalDescription, setModalDescription,
            signer, setSigner,
            tokenTVLs, setTokenTVLs,
            maxSupply, setMaxSupply,
            totalTVL, setTotalTVL,
            totalUserBalance, setTotalUserBalance,
            userTokenBalance, setUserTokenBalance,
            userTokenAllowance, setUserTokenAllowance,
            modalType, setModalType,
            operationCompleted, setOperationCompleted,
            tokensToClaim, setTokensToClaim,
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);