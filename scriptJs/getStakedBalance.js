const { ethers } = require('ethers');

// Setup ethers provider
const provider = new ethers.providers.JsonRpcProvider('https://metis-mainnet.g.alchemy.com/v2/FWmhvca-2KGl6D1o9YcToyEeO8Lmshcy');

const fs = require('fs');

const MIGRATION_BLOCK = 18011710

const JSBI = require('jsbi');

const voterAddress = "0x879828da3a678D349A3C8d6B3D9C78e9Ee31137F";
const multicallAddress = "0x5D78bF8f79A66e43f5932c1Ae0b8fA6563F97f74";

const tokenList = [
    "0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD",
    "0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8",
    "0xaFF73f55968Ab4b276a26E574c96e09A615b13d6"
];

const poolListToken0 = [
    "0x2f839806d7D2B3e6714c3DE23376Fa929a037e30",
    "0xa3E8e7EB4649fFC6f3cBE42B4C2ECf6625d3e802",
    "0x5706D12606E1BA405d3575A56DB8a7666DEDf5A4",
    "0xAd988948Eb90640C32B9321239D10b3d80F33e76",
    "0xA3a7A38880D58D48B03fcA5320769eD7af81Ed34",
    "0xAb251c3C2F9eE1A3821861F30C7a98e65931477A",
    "0xe70bE1428223ad93E142035967a07d26b576BdFe",
    "0x201Eb59c5b4A0c15Ccb3Bce51820B65386d4a9Cf",
    "0x12667f5EE4AFe8bBa6134e2C08201aa15E46f16D",
    "0x2797130914D492b7a6809b719F49e1c83257a41a",
    "0x5dA386306F7C9ED8B444fD6463744A912D99C7af",
    "0x60F86376c89aA5BFe2671f279C24B58CD255C35D",
    "0x39D5484d12176c63BE53a48A8437F5a73C9F71A8",
    "0xA594760370E93830E73B8F879a1A714295dFBCa0",
    "0xDe61E70ab7226674Bb2796eF60f670a63A7d79E6",
    "0xf1E9330D69a8eA9F00A4090CAcA933f8D670349d"
];

const poolListToken1 = [
    "0xB0FE5114E2D770D696cBA21361BF30E14684C020",
    "0x191Aa0E43d6DDac6797EcB1cB6c63cC55474Eb59",
    "0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4",
    "0xD2FdaC6D756b541322a64F20C0b896e39682CC06",
    "0xea7A4F3e8918dAd063794B04080D8Bc7cC5113B2",
    "0xAd988948Eb90640C32B9321239D10b3d80F33e76",
    "0xae1B093fE3388c585f7ef311da96A63FF4fD1ddb",
    "0xAb251c3C2F9eE1A3821861F30C7a98e65931477A",
    "0x96B417C0d73f748480e1192A01Be2EC8BFFed3ae",
    "0x02F5fd9FC861D334FB4e9a38e8F2101727828cb2",
    "0x99d8ed61F73029E60895FFE6Cc6de6396639B041",
    "0x266bfAB261205c4b51e09613bd1d7CE88dF9Abb5",
    "0xa77304DC84f924a2a986c9f4CF011D1aD4f73b93",
    "0xAA283133d22db1b508D995740375748C5600A1d6",
    "0xcFe1a7474b7Ea6250893580F7d738b60811e9B41",
    "0x18916D2CCBc787AA686199f0191dEAa536FDabB3",
    "0xe6B424A11E9B93fD918b1cE7c2a0668d67e54d48",
    "0x5f448A61b1bb8965038852fBCC6C1cAC37001DAe",
    "0x7A6042dD2605f41674eCc5Ab50DE547E0CC3a72e",
    "0x40662c535290336E4952b730CA8944Cb6105519d",
    "0xA5EAbA03a3bdD92D616c001eaf21302Fb9c3c3c9",
    "0x134586340a93F2ADAe90a186f655A53bf1CE9425",
    "0xADCCf433983b1CBa63b205FCC3fA060FC897b955",
    "0x9621CfE98Fbc6997C1d45cc93B5aff8fA873f137",
    "0x687ed802Ef2Ee540543A96bbdB27ab0F826c3c81",
    "0xc40702e5ed40DA552EA91f36d10c5661B67d45c0",
    "0xCf31aDB307CB6D99De808b8caCF0a4a778CcfE1f"
];

const poolListToken2 = [
    "0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4",
    "0xD2FdaC6D756b541322a64F20C0b896e39682CC06",
    "0x82bE1091157d14358cC35Cb2b90EC86C5f277B29"
];

const poolList = [poolListToken0, poolListToken1, poolListToken2];

const inputFiles = [
    "./uniqueHolderAddresses_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json",
    "./uniqueHolderAddresses_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json",
    "./uniqueHolderAddresses_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json"
]

const balanceInputFiles = [
    "./balances_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json",
    "./balances_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json",
    "./balances_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json"
]

const outputFiles = [
    "./staked_balance_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json",
    "./staked_balance_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json",
    "./staked_balance_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json"
];


const VOTER_ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "gauges",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const GAUGE_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stake",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_bribe",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "__ve",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_voter",
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
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "claimed0",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "claimed1",
                "type": "uint256"
            }
        ],
        "name": "ClaimFees",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "reward",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ClaimRewards",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
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
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "reward",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "NotifyReward",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_ve",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
            },
            {
                "internalType": "uint256",
                "name": "maxRuns",
                "type": "uint256"
            }
        ],
        "name": "batchRewardPerToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "bribe",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "checkpoints",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "balanceOf",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "claimed0",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimed1",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "depositAll",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "derivedBalance",
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
        "name": "derivedBalances",
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
        "name": "derivedSupply",
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
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "earned",
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
        "name": "fees0",
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
        "name": "fees1",
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
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "getPriorBalanceIndex",
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
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "getPriorRewardPerToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
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
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "getPriorSupplyIndex",
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
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "name": "getReward",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "isReward",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
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
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lastEarn",
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
        "name": "lastTimeRewardApplicable",
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
        "name": "lastUpdateTime",
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
        "name": "left",
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
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "notifyRewardAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "numCheckpoints",
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
        "name": "periodFinish",
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
        "name": "rewardPerToken",
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
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "rewardPerTokenCheckpoints",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rewardPerToken",
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
        "name": "rewardPerTokenNumCheckpoints",
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
        "name": "rewardPerTokenStored",
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
        "name": "rewardRate",
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "rewards",
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
        "name": "rewardsListLength",
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
        "name": "stake",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "supplyCheckpoints",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "supply",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "supplyNumCheckpoints",
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
        "name": "tokenIds",
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
        "name": "totalSupply",
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
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userRewardPerTokenStored",
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
        "name": "voter",
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
        "inputs": [
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
        "inputs": [],
        "name": "withdrawAll",
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
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "withdrawToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const MULTICALL_ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "components": [
                    {
                        "name": "target",
                        "type": "address"
                    },
                    {
                        "name": "callData",
                        "type": "bytes"
                    }
                ],
                "name": "calls",
                "type": "tuple[]"
            }
        ],
        "name": "aggregate",
        "outputs": [
            {
                "name": "blockNumber",
                "type": "uint256"
            },
            {
                "name": "returnData",
                "type": "bytes[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
async function main() {
    for (let i = 0; i < inputFiles.length; i++) {
        const inputFile = inputFiles[i];
        const balanceInputFile = balanceInputFiles[i];
        const outputFile = outputFiles[i].toString();
        console.log("🚀 ~ main ~ outputFile:", inputFile, balanceInputFile, outputFile)

        const accounts = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        const balances = JSON.parse(fs.readFileSync(balanceInputFile, 'utf8'));

        const Voter = new ethers.Contract(voterAddress, VOTER_ABI, provider);
        const Multicall = new ethers.Contract(multicallAddress, MULTICALL_ABI, provider);

        const poolAddresses = poolList[i]
        console.log("🚀 ~ main ~ poolAddresses:", poolAddresses)
        const gaugeAddresses = await getGaugeAddresses(Voter, Multicall, i);
        console.log(`🚀 ~ main ~ gaugeAddresses for ${inputFile}:`, gaugeAddresses);

        await processTokenBalancesAndShares(Multicall, accounts, gaugeAddresses, balances, i);
    }
}

async function batchMulticall(Multicall, calls) {
    const BATCH_SIZE = 500;
    let results = [];

    for (let i = 0; i < calls.length; i += BATCH_SIZE) {
        console.log("🚀 ~ batchMulticall ~ calls:", i, i + BATCH_SIZE)
        const batchCalls = calls.slice(i, i + BATCH_SIZE);
        const { returnData } = await Multicall.aggregate(batchCalls, { blockTag: MIGRATION_BLOCK });
        console.log("🚀 ~ batchMulticall ~ returnData:", returnData)
        results = results.concat(returnData);
    }

    return results;
}

async function getGaugeAddresses(Voter, Multicall, i) {
    const calls = poolList[i].map(pool => ({
        target: voterAddress,
        callData: Voter.interface.encodeFunctionData("gauges", [pool])
    }));

    const returnData = await batchMulticall(Multicall, calls);

    return returnData.map(data => {
        const address = ethers.utils.defaultAbiCoder.decode(["address"], data)[0];
        return address !== '0x0000000000000000000000000000000000000000' ? address : null;
    }).filter(address => address !== null);
}

async function processTokenBalancesAndShares(Multicall, accounts, gaugeAddresses, balances, i) {
    const balanceCalls = gaugeAddresses.flatMap(gauge =>
        accounts.map(account => ({
            target: gauge,
            callData: new ethers.utils.Interface(GAUGE_ABI).encodeFunctionData("balanceOf", [account])
        }))
    );

    const totalSupplyCalls = gaugeAddresses.map(gauge => ({
        target: gauge,
        callData: new ethers.utils.Interface(GAUGE_ABI).encodeFunctionData("totalSupply", [])
    }));

    const allCalls = [...balanceCalls, ...totalSupplyCalls];

    console.log("🚀 ~ processTokenBalancesAndShares ~ allCalls:", allCalls)

    const returnData = await batchMulticall(Multicall, allCalls);

    processAndFormatResults(gaugeAddresses, accounts, returnData, balanceCalls.length, balances, i);
}

function processAndFormatResults(gaugeAddresses, accounts, returnData, balanceCallsLength, balances, i) {
    const results = [];
    const totalSupplyData = returnData.slice(balanceCallsLength);

    let index = 0;
    for (const gaugeAddress of gaugeAddresses) {
        let totalStakedForGauge = JSBI.BigInt(0);
        const accountStakes = [];

        for (const account of accounts) {
            const stakedBalance = ethers.utils.defaultAbiCoder.decode(["uint256"], returnData[index])[0].toString();
            console.log("🚀 ~ processAndFormatResults ~ stakedBalance:", stakedBalance)
            if (parseInt(stakedBalance) > 0) {
                accountStakes.push({
                    holderAddress: account,
                    stakedBalance
                });
                totalStakedForGauge = JSBI.add(JSBI.BigInt(totalStakedForGauge), JSBI.BigInt(stakedBalance)).toString();
            }
            index++;
        }

        const totalSupply = ethers.utils.defaultAbiCoder.decode(["uint256"], totalSupplyData.shift())[0].toString();
        console.log("🚀 ~ processAndFormatResults ~ totalSupply:", totalSupply)

        console.log("🚀 ~ processAndFormatResults ~ balances:", balances)
        // Get gauge related info by matching gauge address
        const poolBalance = balances.pools.find(balance =>
            balance.holders.find((holder) => holder.holderAddress === gaugeAddress)
        );
        console.log("🚀 ~ processAndFormatResults ~ poolBalance:", poolBalance)

        if (accountStakes.length > 0 && poolBalance) {
            const shares = accountStakes.map(stake => ({
                holderAddress: stake.holderAddress,
                stakedBalance: stake.stakedBalance,
                shareOfTargetToken: (JSBI.divide(
                    JSBI.multiply(JSBI.BigInt(stake.stakedBalance), JSBI.BigInt(poolBalance.holders.find((holder) => holder.holderAddress === gaugeAddress).tokenBalance)),
                    JSBI.BigInt(totalSupply)
                )).toString()
            })).sort((a, b) => b.shareOfTargetToken - a.shareOfTargetToken);

            results.push({
                gauge: gaugeAddress,
                stakes: shares,
                totalStakedForGauge: totalStakedForGauge.toString()
            });
        }
    }
    console.log("🚀 ~ processAndFormatResults ~ results:", results)

    fs.writeFileSync(outputFiles[i].toString(), JSON.stringify(results.sort((a, b) => b.totalStakedForGauge - a.totalStakedForGauge), null, 2));
    console.log(`Results written to ${outputFiles[i]?.toString()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});