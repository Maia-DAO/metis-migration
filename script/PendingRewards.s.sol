// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../src/Multicall.sol";
import "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

interface IVoter {
    function gauges(address) external view returns (address);
}

interface IGauge {
    function earned(address token, address account) external view returns (uint256);
}

contract PendingRewards is Script {
    mapping(address => string) resultsByToken;

    address voterAddress = 0x879828da3a678D349A3C8d6B3D9C78e9Ee31137F;
    IVoter voter = IVoter(voterAddress);

    address[] tokenList = [
        0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD,
        0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8,
        0xaFF73f55968Ab4b276a26E574c96e09A615b13d6
    ];

    address[] poolListToken0 = [
        0x2f839806d7D2B3e6714c3DE23376Fa929a037e30,
        0xa3E8e7EB4649fFC6f3cBE42B4C2ECf6625d3e802,
        0x5706D12606E1BA405d3575A56DB8a7666DEDf5A4,
        0xAd988948Eb90640C32B9321239D10b3d80F33e76,
        0xA3a7A38880D58D48B03fcA5320769eD7af81Ed34,
        0xAb251c3C2F9eE1A3821861F30C7a98e65931477A,
        0xe70bE1428223ad93E142035967a07d26b576BdFe,
        0x201Eb59c5b4A0c15Ccb3Bce51820B65386d4a9Cf,
        0x12667f5EE4AFe8bBa6134e2C08201aa15E46f16D,
        0x2797130914D492b7a6809b719F49e1c83257a41a,
        0x5dA386306F7C9ED8B444fD6463744A912D99C7af,
        0x60F86376c89aA5BFe2671f279C24B58CD255C35D,
        0x39D5484d12176c63BE53a48A8437F5a73C9F71A8,
        0xA594760370E93830E73B8F879a1A714295dFBCa0,
        0xDe61E70ab7226674Bb2796eF60f670a63A7d79E6,
        0xf1E9330D69a8eA9F00A4090CAcA933f8D670349d
    ];

    address[] poolListToken1 = [
        0xB0FE5114E2D770D696cBA21361BF30E14684C020,
        0x191Aa0E43d6DDac6797EcB1cB6c63cC55474Eb59,
        0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4,
        0xD2FdaC6D756b541322a64F20C0b896e39682CC06,
        0xea7A4F3e8918dAd063794B04080D8Bc7cC5113B2,
        0xAd988948Eb90640C32B9321239D10b3d80F33e76,
        0xae1B093fE3388c585f7ef311da96A63FF4fD1ddb,
        0xAb251c3C2F9eE1A3821861F30C7a98e65931477A,
        0x96B417C0d73f748480e1192A01Be2EC8BFFed3ae,
        0x02F5fd9FC861D334FB4e9a38e8F2101727828cb2,
        0x99d8ed61F73029E60895FFE6Cc6de6396639B041,
        0x266bfAB261205c4b51e09613bd1d7CE88dF9Abb5,
        0xa77304DC84f924a2a986c9f4CF011D1aD4f73b93,
        0xAA283133d22db1b508D995740375748C5600A1d6,
        0xcFe1a7474b7Ea6250893580F7d738b60811e9B41,
        0x18916D2CCBc787AA686199f0191dEAa536FDabB3,
        0xe6B424A11E9B93fD918b1cE7c2a0668d67e54d48,
        0x5f448A61b1bb8965038852fBCC6C1cAC37001DAe,
        0x7A6042dD2605f41674eCc5Ab50DE547E0CC3a72e,
        0x40662c535290336E4952b730CA8944Cb6105519d,
        0xA5EAbA03a3bdD92D616c001eaf21302Fb9c3c3c9,
        0x134586340a93F2ADAe90a186f655A53bf1CE9425,
        0xADCCf433983b1CBa63b205FCC3fA060FC897b955,
        0x9621CfE98Fbc6997C1d45cc93B5aff8fA873f137,
        0x687ed802Ef2Ee540543A96bbdB27ab0F826c3c81,
        0xc40702e5ed40DA552EA91f36d10c5661B67d45c0,
        0xCf31aDB307CB6D99De808b8caCF0a4a778CcfE1f
    ];

    address[] poolListToken2 = [
        0x299348CF3daC4782ED85569b4Ab0D7EE0E0aF6c4,
        0xD2FdaC6D756b541322a64F20C0b896e39682CC06,
        0x82bE1091157d14358cC35Cb2b90EC86C5f277B29
    ];

    address[][] poolList = [poolListToken0, poolListToken1, poolListToken2];

    string inputFile = "./uniqueHolderAddresses.json";
    string outputFile = "./pending_rewards.json";

    uint256 constant BATCH_SIZE = 100;

    function run() external {
        // Load JSON file and populate poolList arrays
        string memory jsonContent = vm.readFile(inputFile);
        address[] memory accounts = abi.decode(vm.parseJson(jsonContent), (address[]));

        Multicall multicall = Multicall(address(0x5D78bF8f79A66e43f5932c1Ae0b8fA6563F97f74));

        uint256 totalPools = poolListToken0.length + poolListToken1.length + poolListToken2.length;

        // Retrieve gauge addresses for each pool
        Multicall.Call[] memory calls = new Multicall.Call[](totalPools);

        uint256 callIndex = 0;
        for (uint256 i = 0; i < poolList.length; i++) {
            for (uint256 j = 0; j < poolList[i].length; j++) {
                calls[callIndex] = Multicall.Call({
                    target: voterAddress,
                    callData: abi.encodeWithSelector(voter.gauges.selector, poolList[i][j])
                });
                callIndex++;
            }
        }

        address[] memory gaugeAddresses = new address[](totalPools);
        for (uint256 i = 0; i < totalPools; i += BATCH_SIZE) {
            uint256 end = i + BATCH_SIZE > totalPools ? totalPools : i + BATCH_SIZE;
            Multicall.Call[] memory batchCalls = new Multicall.Call[](end - i);

            for (uint256 j = i; j < end; j++) {
                batchCalls[j - i] = calls[j];
            }

            (uint256 blockNumber, bytes[] memory returnData) = multicall.aggregate(batchCalls);

            for (uint256 j = 0; j < returnData.length; j++) {
                gaugeAddresses[i + j] = abi.decode(returnData[j], (address));
            }
        }

        // Check pending rewards for each holder
        address tokenAddress = 0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8; // HERMES
        uint256 totalAccounts = accounts.length;
        uint256 totalGaugeAddresses = gaugeAddresses.length;

        string memory finalResult = "";
        for (uint256 k = 0; k < totalGaugeAddresses; k += BATCH_SIZE) {
            uint256 endGauge = k + BATCH_SIZE > totalGaugeAddresses ? totalGaugeAddresses : k + BATCH_SIZE;
            for (uint256 m = 0; m < totalAccounts; m += BATCH_SIZE) {
                uint256 endAccount = m + BATCH_SIZE > totalAccounts ? totalAccounts : m + BATCH_SIZE;

                Multicall.Call[] memory rewardCalls =
                    generateRewardCalls(gaugeAddresses, accounts, tokenAddress, k, endGauge, m, endAccount);

                (uint256 blockNumber2, bytes[] memory returnData2) = multicall.aggregate(rewardCalls);

                finalResult = string(
                    abi.encodePacked(
                        finalResult,
                        processAndFormatResults(gaugeAddresses, accounts, k, endGauge, m, endAccount, returnData2)
                    )
                );
            }
        }

        vm.writeFile(outputFile, finalResult);
    }

    function generateRewardCalls(
        address[] memory gaugeAddresses,
        address[] memory accounts,
        address tokenAddress,
        uint256 startGauge,
        uint256 endGauge,
        uint256 startAccount,
        uint256 endAccount
    ) internal pure returns (Multicall.Call[] memory rewardCalls) {
        rewardCalls = new Multicall.Call[]((endGauge - startGauge) * (endAccount - startAccount));
        uint256 callIndex = 0;
        for (uint256 i = startGauge; i < endGauge; i++) {
            for (uint256 j = startAccount; j < endAccount; j++) {
                rewardCalls[callIndex] = Multicall.Call({
                    target: gaugeAddresses[i],
                    callData: abi.encodeWithSelector(IGauge.earned.selector, tokenAddress, accounts[j])
                });
                callIndex++;
            }
        }
        return rewardCalls;
    }

    function processAndFormatResults(
        address[] memory gaugeAddresses,
        address[] memory accounts,
        uint256 startGauge,
        uint256 endGauge,
        uint256 startAccount,
        uint256 endAccount,
        bytes[] memory returnData
    ) internal view returns (string memory finalResult) {
        finalResult = "";
        for (uint256 i = 0; i < endGauge - startGauge; i++) {
            uint256 totalRewardForGauge = 0;
            string memory gaugeResult =
                string(abi.encodePacked("Gauge: ", vm.toString(gaugeAddresses[startGauge + i]), "\n"));
            for (uint256 j = 0; j < endAccount - startAccount; j++) {
                uint256 index = i * (endAccount - startAccount) + j;
                uint256 pendingReward = abi.decode(returnData[index], (uint256));
                gaugeResult = string(
                    abi.encodePacked(
                        gaugeResult,
                        "Account: ",
                        vm.toString(accounts[startAccount + j]),
                        ", Pending Reward: ",
                        vm.toString(pendingReward),
                        "\n"
                    )
                );
                totalRewardForGauge += pendingReward;
            }
            gaugeResult = string(
                abi.encodePacked(gaugeResult, "Total Reward for Gauge: ", vm.toString(totalRewardForGauge), "\n\n")
            );
            finalResult = string(abi.encodePacked(finalResult, gaugeResult));
        }
        return finalResult;
    }
}
