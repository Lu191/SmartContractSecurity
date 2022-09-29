const ethers = require('ethers')

const UNIBANK_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_unibaToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "harvestedAmount",
        "type": "uint256"
      }
    ],
    "name": "Harvest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "harvestedAmount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "PRECISION_FACTOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REWARD_PER_BLOCK",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOTAL_BLOCKS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "addMultCoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "addMultStablecoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getEthersDepositedByUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getTokenToClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "getTokensDepositedByUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startBlock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalEthDeposited",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "totalTokenDeposited",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

require('dotenv').config();

const axios = require('axios').default;

process.argv.forEach(function (val, index, array) {
  if(index === 2) {
    const API_URL = val;
    const REACT_APP_ALCHEMY_RPC = process.env.REACT_APP_ALCHEMY_RPC;
    const ethersProvider = new ethers.providers.JsonRpcProvider(REACT_APP_ALCHEMY_RPC);
    const UNIBA_CONTRACT = "0xeE105303827375bBE717dd87d6d4222027f86F80"
    const TOKEN_CONTRACTS = {
        "wbtc": "0x4fa09099d4bc5F2F32d07E1F7C86f209BC159161",
        "dai" : "0x71152066d6F6eCE6811eEa82e1a8Bcc53f6Eb475",
        "usdc": "0x36100EDeE1B65d4485D27613C0e6480FC5061968",
        "ubt" : "0xA00a90A0D0E0148B87F57a8d280a690bd4f1B708"
    }
    
    function getTVL(token=undefined) {
        const unibaContract = new ethers.Contract(UNIBA_CONTRACT, UNIBANK_ABI, ethersProvider)
        return token !== undefined ? unibaContract.totalTokenDeposited(token) : unibaContract.totalEthDeposited()
    }
    
    getTVL().then((val) => {
        const tvl = ethers.utils.formatEther(val)
        console.log('eth parsed', tvl)
    
        console.log('updating eth...')
        axios.post(API_URL, {
            asset: 'eth',
            amount: tvl,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    
    getTVL(TOKEN_CONTRACTS["wbtc"]).then((val) => {
        const tvl = ethers.utils.formatEther(val)
        console.log('wbtc parsed', tvl)
    
        console.log('updating wbtc...')
        axios.post(API_URL, {
            asset: 'wbtc',
            amount: tvl,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    
    getTVL(TOKEN_CONTRACTS["dai"]).then((val) => {
        const tvl = ethers.utils.formatEther(val)
        console.log('dai parsed', tvl)
    
        console.log('updating dai...')
        axios.post(API_URL, {
            asset: 'dai',
            amount: tvl,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    
    getTVL(TOKEN_CONTRACTS["usdc"]).then((val) => {
        const tvl = ethers.utils.formatEther(val)
        console.log('usdc parsed', tvl)
    
        console.log('updating usdc...')
        axios.post(API_URL, {
            asset: 'usdc',
            amount: tvl,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    
    getTVL(TOKEN_CONTRACTS["ubt"]).then((val) => {
        const tvl = ethers.utils.formatEther(val)
        console.log('ubt parsed', tvl)
    
        console.log('updating ubt...')
        axios.post(API_URL, {
            asset: 'ubt',
            amount: tvl,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })
  }
});