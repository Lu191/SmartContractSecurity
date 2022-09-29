import { ethers } from 'ethers'
import { ethersProvider } from '../contexts/ContextProvider';

import { PRICE_FEED } from '../abi/price_feed_chainlink'

export type priceFeedType = {
    [key: string]: string
}

const PRICE_FEED_CONTRACTS: priceFeedType = {
    "ethusd": "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    "btcusd": "0xECe365B379E1dD183B20fc5f022230C044d51404",
    "usdcusd": "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
    "daiusd": "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
}

export function getTokenFeed(pair: string): any {
    const priceFeed = new ethers.Contract(PRICE_FEED_CONTRACTS[pair], PRICE_FEED, ethersProvider)
    return priceFeed.latestRoundData()
}