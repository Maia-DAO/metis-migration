const { ethers } = require('ethers');
const fs = require('fs');

const provider = new ethers.providers.JsonRpcProvider('https://metis-mainnet.g.alchemy.com/v2/FWmhvca-2KGl6D1o9YcToyEeO8Lmshcy');

const PROTOCOL_AMOUNT = 3

const ADDRESSES_TO_IGNORE = [
    '0x0000000000000000000000000000000000000000', // ZERO_ADDRESS
    // '0x559119275a8a862edbd2cde21196f4c758d5ab84', // OLD_sMAIA_ADDRESS
    // '0x0a72d3bc826e9c435c6a2e6a59b5a62c372d112a', // USDC_USDT_ADDRESS
    // '0x27e86d206889198c9b58044b3866ff25aa479be2', // METIS_USDC_ADDRESS
    // '0x4b9e1464d9908a0f7c032030c661d61e1f915002', // MIM_USDC_ADDRESS
    // '0x72c232d56542ba082592dee7c77b1c6cfa758bcd', // MAIA address
    // '0xe2546b144efc3f8bd85d84b6ca64cc4f033c9be1', // Staking address
    // '0x1c86afe9f9af4afc23bd1f50191c5c0192d47802', // Staking Helper address
    // '0x3d183e4f3eef0191ecffafd7ffc5df8d38520fa9', // Treasury address
    // '0x77314eaa8d99c2ad55f3ca6df4300cfc50bdbc7f', // Multisig address
    // '0x88e07a0457aa113ab910103d9a01217315da1c98', // Deployer address
]

// maia
const targetTokenAddress1 = '0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD';

const pools1 = [
    '0x2f839806d7D2B3e6714c3DE23376Fa929a037e30',
    '0xa3E8e7EB4649fFC6f3cBE42B4C2ECf6625d3e802',
    '0x5706D12606E1BA405d3575A56DB8a7666DEDf5A4',
    '0xAd988948Eb90640C32B9321239D10b3d80F33e76',
    '0xA3a7A38880D58D48B03fcA5320769eD7af81Ed34',
    '0xAb251c3C2F9eE1A3821861F30C7a98e65931477A',
    '0xe70bE1428223ad93E142035967a07d26b576BdFe',
    '0x201Eb59c5b4A0c15Ccb3Bce51820B65386d4a9Cf',
    '0x12667f5EE4AFe8bBa6134e2C08201aa15E46f16D',
    '0x2797130914D492b7a6809b719F49e1c83257a41a',
    '0x5dA386306F7C9ED8B444fD6463744A912D99C7af',
    '0x60F86376c89aA5BFe2671f279C24B58CD255C35D',
    '0x39D5484d12176c63BE53a48A8437F5a73C9F71A8',
    '0xA594760370E93830E73B8F879a1A714295dFBCa0',
    '0xDe61E70ab7226674Bb2796eF60f670a63A7d79E6',
    '0xf1E9330D69a8eA9F00A4090CAcA933f8D670349d'
];

const creationBlocks1 = [
    1025267,
    1254148,
    1366418,
    1382723,
    1393291,
    1448035,
    1490256,
    1540833,
    3771376,
    5701127,
    7011167,
    9690155,
    9691099,
    10381341,
    13752187,
    14113915
]

// hermes
const targetTokenAddress2 = '0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8';

const pools2 = [
    '0xB0FE5114E2D770D696cBA21361BF30E14684C020',
    '0x191Aa0E43d6DDac6797EcB1cB6c63cC55474Eb59',
    '0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4',
    '0xD2FdaC6D756b541322a64F20C0b896e39682CC06',
    '0xea7A4F3e8918dAd063794B04080D8Bc7cC5113B2',
    '0xAd988948Eb90640C32B9321239D10b3d80F33e76',
    '0xae1B093fE3388c585f7ef311da96A63FF4fD1ddb',
    '0xAb251c3C2F9eE1A3821861F30C7a98e65931477A',
    '0x96B417C0d73f748480e1192A01Be2EC8BFFed3ae',
    '0x02F5fd9FC861D334FB4e9a38e8F2101727828cb2',
    '0x99d8ed61F73029E60895FFE6Cc6de6396639B041',
    '0x266bfAB261205c4b51e09613bd1d7CE88dF9Abb5',
    '0xa77304DC84f924a2a986c9f4CF011D1aD4f73b93',
    '0xAA283133d22db1b508D995740375748C5600A1d6',
    '0xcFe1a7474b7Ea6250893580F7d738b60811e9B41',
    '0x18916D2CCBc787AA686199f0191dEAa536FDabB3',
    '0xe6B424A11E9B93fD918b1cE7c2a0668d67e54d48',
    '0x5f448A61b1bb8965038852fBCC6C1cAC37001DAe',
    '0x7A6042dD2605f41674eCc5Ab50DE547E0CC3a72e',
    '0x40662c535290336E4952b730CA8944Cb6105519d',
    '0xA5EAbA03a3bdD92D616c001eaf21302Fb9c3c3c9',
    '0x134586340a93F2ADAe90a186f655A53bf1CE9425',
    '0xADCCf433983b1CBa63b205FCC3fA060FC897b955',
    '0x9621CfE98Fbc6997C1d45cc93B5aff8fA873f137',
    '0x687ed802Ef2Ee540543A96bbdB27ab0F826c3c81',
    '0xc40702e5ed40DA552EA91f36d10c5661B67d45c0',
    '0xCf31aDB307CB6D99De808b8caCF0a4a778CcfE1f'
];

const creationBlocks2 = [
    1326722,
    1326737,
    1330867,
    1369364,
    1372019,
    1382723,
    1414638,
    1448035,
    1585627,
    1668937,
    1832722,
    1924745,
    1924765,
    1928268,
    1981490,
    1981861,
    3137649,
    3137697,
    3844588,
    5771850,
    5867201,
    6878899,
    9690147,
    9691127,
    10091044,
    12608715,
    13387301
]

// starHermes
const targetTokenAddress3 = '0xaFF73f55968Ab4b276a26E574c96e09A615b13d6';

const pools3 = [
    '0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4',
    '0xD2FdaC6D756b541322a64F20C0b896e39682CC06',
    '0x82bE1091157d14358cC35Cb2b90EC86C5f277B29'
];

const creationBlocks3 = [
    1330867,
    1369364,
    5760370,
]

const pools = [pools1, pools2, pools3]
const targetTokenAddress = [targetTokenAddress1, targetTokenAddress2, targetTokenAddress3]
const creationBlocks = [creationBlocks1, creationBlocks2, creationBlocks3]

async function getHolders(poolContract, fromBlock, toBlock) {
    const logs = await fetchLogsInBatches(poolContract, fromBlock, toBlock, 1000000);

    const uniqueAddresses = new Set();
    for (const log of logs) {
        const from = ethers.utils.getAddress('0x' + log.topics[1].slice(26));
        const to = ethers.utils.getAddress('0x' + log.topics[2].slice(26));
        if (!ADDRESSES_TO_IGNORE.includes(from)) uniqueAddresses.add(from);
        if (!ADDRESSES_TO_IGNORE.includes(to)) uniqueAddresses.add(to);
    }

    return Array.from(uniqueAddresses);
}

async function fetchLogsInBatches(poolContract, startBlock, endBlock, batchSize) {
    let currentBlock = startBlock;
    let allLogs = [];

    while (currentBlock <= endBlock) {
        const batchEndBlock = Math.min(currentBlock + batchSize - 1, endBlock);
        try {
            const filter = poolContract.filters.Transfer();
            const logs = await poolContract.queryFilter(filter, currentBlock, batchEndBlock);
            allLogs = allLogs.concat(logs);
            currentBlock = batchEndBlock + 1;
        } catch (error) {
            console.error('Error fetching logs:', error);
            break;
        }
    }
    return allLogs;
}

async function analyzePools(pools, blocks) {
    const poolHolders = [];
    for (let i = 0; i < pools.length; i++) {
        const poolAddress = pools[i];
        const poolContract = new ethers.Contract(poolAddress, ['event Transfer(address indexed from, address indexed to, uint256 value)'], provider);
        const holders = await getHolders(poolContract, blocks[i], await provider.getBlockNumber());
        poolHolders.push({
            poolAddress,
            holders
        });
    }
    return poolHolders;
}


async function run() {
    for (let i = 0; i < PROTOCOL_AMOUNT; i++) {
        try {
            const poolHolders = await analyzePools(pools[i], creationBlocks[i]);
            fs.writeFileSync('./holders_' + targetTokenAddress[i] + '.json', JSON.stringify(poolHolders, null, 2));
            console.log('Holders saved');
        } catch (error) {
            console.error('Error running the script:', error);
        }
    }
}

run();
