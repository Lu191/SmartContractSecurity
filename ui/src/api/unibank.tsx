import { ethersProvider } from '../contexts/ContextProvider';
import { ethers } from 'ethers'
import { UNIBANK_ABI } from '../abi/UniBank'
import { ERC20ABI } from '../abi/ERC20ABI';

export type TokenContractTypes = {
    [key: string]: string
}

const { ethereum } = window;

export const UNIBA_CONTRACT: string = "0xeE105303827375bBE717dd87d6d4222027f86F80"

export const TOKEN_CONTRACTS: TokenContractTypes = {
    "wbtc": "0x4fa09099d4bc5F2F32d07E1F7C86f209BC159161",
    "dai" : "0x71152066d6F6eCE6811eEa82e1a8Bcc53f6Eb475",
    "usdc": "0x36100EDeE1B65d4485D27613C0e6480FC5061968",
    "ubt" : "0xA00a90A0D0E0148B87F57a8d280a690bd4f1B708"
}

export function getTVL(token?: string): any {
    const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, ethersProvider)
    return token !== undefined ? unibaContract.totalTokenDeposited(token) : unibaContract.totalEthDeposited()
}

export function getUserBalance(address: string, token?: string): any {
    if (token !== undefined) {
        const tokenContract = new ethers.Contract(token, ERC20ABI, ethersProvider)
        return tokenContract.balanceOf(address)
    }
    return ethersProvider.getBalance(address)
}

export function getDepositedByUser(address: string, token?: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, provider);
    if (token !== undefined) {
        return unibaContract.getTokensDepositedByUser(address, token);
    }
    return unibaContract.getEthersDepositedByUser(address);
}

export function getTokenAllowanceByUser(owner: string, spender: string, token: string): any {
    const tokenContract = new ethers.Contract(token, ERC20ABI, ethersProvider)
    return tokenContract.allowance(owner, spender)
}

export function approveToken(token: string, amount: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(token, ERC20ABI, signer);
    return tokenContract.approve(UNIBA_CONTRACT, ethers.utils.parseUnits(amount, 18));
}

export function deposit(amount: string, token?: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, signer);
    if (token !== undefined) {
        return unibaContract.deposit(token, ethers.utils.parseUnits(amount, 18), { gasLimit: 500000 });
    }
    return unibaContract.depositETH({ value: ethers.utils.parseUnits(amount, "ether"), gasLimit: 500000 })
}

export function withdraw(amount: string, token?: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, signer);
    if (token !== undefined) {
        return unibaContract.withdraw(token, ethers.utils.parseUnits(amount, 18), { gasLimit: 500000 });
    }
    return unibaContract.withdrawETH(ethers.utils.parseUnits(amount, "ether"), { gasLimit: 500000 });
}

export function estimateGasDepositETH(amount: string): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider.estimateGas({ to: UNIBA_CONTRACT, data: "0xf6326fb3", value: ethers.utils.parseUnits(amount, "ether") })
}

export function getTokenToClaim(address: string): any {
    const tokenContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, ethersProvider)
    return tokenContract.getTokenToClaim(address)
}

export function claim(): any {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, signer);
    return unibaContract.claim({ gasLimit: 500000 });
}