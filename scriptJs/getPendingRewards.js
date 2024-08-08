const fs = require('fs');
const JSBI = require('jsbi');
const { ethers } = require('ethers');

// Setup ethers provider
const provider = new ethers.providers.JsonRpcProvider('https://metis-mainnet.g.alchemy.com/v2/FWmhvca-2KGl6D1o9YcToyEeO8Lmshcy');

const MIGRATION_BLOCK = 18011710

const hermes = "0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8"
const multicallAddress = "0x5D78bF8f79A66e43f5932c1Ae0b8fA6563F97f74";

const gauges = [
    "0xf98741d52Ce0139C100560F7Df9E11C431D783fe",
    "0x96d890A629eC2732bC5145AC34A080AB206B20E8",
    "0x1445cE1260b547FcBDD016F7D1001045dB33dd96",
    "0x0253F52DfedA8daaA361ba1DAFD82D5bE4911812",
    "0x89dA0cE521252b8069D09D329Ea2e6EF848cC8cc",
    "0x418c7C25a54c34BD6468E95235Bf41B7e96ec3a8",
    "0xC9008Beb81E73B7b9eDfA24f37b7aDdd5A1E9247",
    "0x975706b498E43E3c8c5775B3C881566db8a78c67",
    "0xf85657BE0764be82933800878425AdcD15931D3C",
    "0xc91AbFcbf2dd275372f2F693e398CA80924bEdAb",
    "0x8aD71Ee4249f8856F6b3369c0DAEb942D9699d71",
    "0x57103C1fBc2BC28C1A2927744F31f1f885b7b432",
    "0x001b30a75E04540bAd4051161B0E52E882737E67",
    "0x8a93435EFA314e190A444b7eABdF23a501BA9Cf9",
    "0xFBB6A688b98DF3220FAcb66DC4D4c658a56A0A79",
    "0x5784cc9B94a5B1c9b26766b3f96d9355E2538d3C",
    "0x528c90238C612d3d827F7C866b5708C3B0d315e6",
    "0x848082bA9E293bB9dF4D4422EFDcBe2E0eE027F3",
    "0xE23e8C8c4e621Eb10B88e951877c58Fd61835B4B",
    "0x6720D626CF23B743e56236780b284dAE1DD6F6bE",
    "0xb07294A85e6862a224E3E19C89DB1198810628F9",
    "0x6B6aE1C83d9d90cEe3A6F15AAfd92Bb9245dEE1F",
    "0x3878309d8ddD1Cd72D0540b896A3893a280F6e47",
    "0x1de292ffEB57C60aBf922fF61A2bC82126394EaD",
    "0x7C1C57E40D56bc2B4D2B1498394768856842cB8C",
    "0x57bC938acF46c7017bC4763987A07018D0824239",
    "0xA67858c32c0153a37276aDB9bF26590db3E63efC",
    "0x0034C0abE9192C4CBFbB4662f2aB7c491F7bf25e",
    "0xe73CbFD56583C34040B59761eeA6bB75424c4A92",
    "0xBD41d1f38558122BbA318aA5fe9dE8DAc40590aB",
    "0xdB3CB0cDbDEFed4888A086Ef46812ba05d616B13",
    "0x7413a9Fa281091ED98b538B1C9c662aeD3530429",
    "0x869441eD109100E9220cC035905cBaC3C3973Abd",
    "0x2D678cd60B3dbE879d003Cb4f7aA039dc82Df9d0",
    "0xf81ABa5d8d003433bF88bcf8001e9e59640C9D53",
    "0x1b2eAaA54Fd53fa7a159CB1c1F776E0Db9F90A51",
    "0xAECEd7dC0C751A351b1479b5122d7E17384B9F76",
    "0xB367C91B7f5B52ceA0FB10144B124A778c92D87C",
    "0x84833989378bDFb3A9DFA408f147B697797b60A9",
    "0x8949E076709cd8Eb036c082472eC180f7968EF3e",
    "0x1CeA9813b81959e5eC02231845ff2CEdBedF6430",
    "0x25905eEA559095f4E574761aD4D223c070e94c0a",
    "0xdf02826D80Bf271234c4698e5f941e948a26DB10",
    "0xEc5e638fCb7e3391bf60FAD32a8bCcA6805b7FCe",
    "0x4Ce16856A6Dc78965bDf391F39dbda234A277793",
    "0xBc3aF1093fd1d8754f7c7f2D160aA5decdea5Bb2",
    "0xdeaFD36f988C19746377D46E7A432793AdB1adEA",
    "0xFB08AFd7d647e63EDeb0E07F353d259bcA2541a1",
    "0xF7F3FE82577AA5566c38fD63d115214fEde7978B",
    "0x535d9aac91293Ce8B14dD18c4E45B8DbBa111A3c",
    "0x543178B2DA98142bc9D9b8F3aea058f08621DE8e",
    "0x702c6468aff27B20195c8fa034370E2A14c1BA50",
    "0xCA9C9768404d9a90651A78986c7c8D898c04D1c2",
    "0x157A93a04F09EF0253c22a782634dDF96F721a1F",
    "0x465abCEE6367118b2F804ec10f5812550D7E5e2c",
    "0x6ABaBAE599F79705F32931d66EEA621ac7c49D3c",
    "0x615a51CaE6615b12479c5ABFbB2dd0F59417b9Af",
    "0x622C1A195249B77e787453c5EeAa1D79E215FB3d",
    "0x481f473fE047A83a55F8DcfFC5954557ec7c8A52",
    "0x435dcE24AC9bE638B689fbFaB3CAa6F615923F3A",
    "0x7685972f9367e77bC18bC75c11B80A6775C1bdf0",
    "0xc351812214F47192fea849bAd426B1b7D468b0e5",
    "0x8151f86b77B9a1bacD0a734CA1783441d79DcDc0",
    "0xc30880B43c432FA30b59E39b1e99e230561DC5e4",
    "0x34f096Ebf9844319A2F99F9f9eE7CDD3d055d256",
    "0x86C459D918335B5439ff01Bb0703c3C11C0a8201",
    "0xFb7FA1c9b5849140aa1d4708f169CCD7FBE7Fd48",
    "0xb46dF1f567Ff3b630A212adAa1f6Ee0beDBb65f3",
    "0x3550F01C02F3E39Ad92a80eb0346eAA81A16AB91",
    "0x3e406650875659FD8240A61Bf1d64B83bddC6F58",
    "0x9122D0043417709890345d245459747a024ceb6e",
    "0x3F716D72C460dc9328e025D704EEcFb610736222",
    "0xCE68187cdaD282D56E4EEBBe99B2146b36812F06",
    "0x21AEd2B1722152314Ca8914341cbF300e8C53C03",
    "0xD76d3CdC2db80191D583E833B03639c5A85E534f",
    "0xaF306D9e949B41299277C22e92aCAd496C1A561c",
    "0x220298715b7c2a5A29AFf5aB4C14C897A20cE6e1",
    "0xe76ff951428BE5F0492bBfcc12E27A21020E2d5d",
    "0x25f7E7306C36b8cD320Ec6e3cFa6B30BC9d2D783",
    "0x0EEAed4946962dD4f5e433B3A79ef536C5925da4",
    "0x0C562E32B3E4e3d41857Ed0F5D938024b9D4d559",
    "0x2E9B5042B38980CBD0bfbffc80E0Ca9F0084A130",
    "0x76DBae416CAd734A8153421E99eD7b9833F92De0",
    "0x08C54d7dA67bd80Bc58813963EcC847841115D55",
    "0xd600246Fd268d4A4173bACC9809237Dd871C58d1",
    "0x5930589Bc6Eee7Ff01A2c40D8f2c1f9677C34961",
    "0xe0a766B0c8C4741FFb107318CF714D8ca46E0E94",
    "0xF271d2c8Db1F866bD5AfdCd4DB093820B84c5c5d",
    "0x32a1552FE7023747b2e6EF0dE89cfAcEC9Ab73e6",
    "0x31FF2501142c2c69fFC313012a4F371b8e4CC2f1",
    "0xe22Bce6bd4026AFf1B2d517A32c77a272351d7E1",
    "0x4b4c7dd3605972494940cEb36855b14918711044",
    "0x7dd35C93070f4cA817e98515F8ec6B700bF19DA6",
    "0x39AdD083cb45f1cE1a39EDC1Da8dDd50F5EC1Ba5",
    "0xdEE1ffEBE5a515e5369C3938F387553EeE98Bd54",
    "0x73c1aB2D75a36f2157F4345c0fFa6F79f050A6B1",
    "0xFbC31A0FB469A70E426925024A5f889eF4040a31",
    "0x3C7A4b8A025b73AED14B74c2620e05de8b80b5bE",
]

const inputFile = "./uniqueHolderAddresses.json"

const outputFile = "./pending_rewards.json"

const GAUGE_ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "earned",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
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

    const accounts = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const Multicall = new ethers.Contract(multicallAddress, MULTICALL_ABI, provider);

    await processTokenRewards(Multicall, accounts, gauges, outputFile);
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

async function processTokenRewards(Multicall, accounts, gaugeAddresses, outputFile) {
    const rewardCalls = gaugeAddresses.flatMap(gauge =>
        accounts.map(account => ({
            target: gauge,
            callData: new ethers.utils.Interface(GAUGE_ABI).encodeFunctionData("earned", [hermes, account])
        }))
    );
    console.log("🚀 ~ processTokenRewards ~ rewardCalls:", rewardCalls)

    const returnData = await batchMulticall(Multicall, rewardCalls);

    processAndFormatResults(gaugeAddresses, accounts, returnData, outputFile);
}

function processAndFormatResults(gaugeAddresses, accounts, returnData, outputFile) {
    const results = [];

    let index = 0;
    for (const gaugeAddress of gaugeAddresses) {
        let totalRewardForGauge = JSBI.BigInt(0);
        const accountRewards = [];

        for (const account of accounts) {
            const pendingReward = ethers.utils.defaultAbiCoder.decode(["uint256"], returnData[index])[0].toString();
            console.log("🚀 ~ processAndFormatResults ~ pendingReward:", pendingReward)
            if (parseInt(pendingReward) > 0) {
                accountRewards.push({
                    account,
                    pendingReward
                });
                JSBI.add(totalRewardForGauge, JSBI.BigInt(pendingReward));
            }
            index++;
        }

        if (accountRewards.length > 0) {
            results.push({
                gauge: gaugeAddress,
                rewards: accountRewards,
                totalRewardForGauge: totalRewardForGauge.toString()
            });
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Results written to ${outputFile}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});