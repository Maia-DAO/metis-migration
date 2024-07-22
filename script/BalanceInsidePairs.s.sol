// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "forge-std/Test.sol";

interface ITargetToken {
    function balanceOf(address owner) external view returns (uint256);
}

interface IPool {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

struct HolderInfo {
    address holder;
    uint256 tokenBalance;
    uint256 poolTokenBalance;
}

struct PoolInfo {
    address poolAddress;
    uint256 targetTokenBalance;
    uint256 totalSupply;
    HolderInfo[] holders;
}

struct Pool {
    address[] holders;
    address poolAddress;
}

contract AnalyzePools is Script {
    uint256 public immutable PROTOCOL_AMOUNT = 3;

    address targetTokenAddress1 = 0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD;
    address targetTokenAddress2 = 0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8;
    address targetTokenAddress3 = 0xaFF73f55968Ab4b276a26E574c96e09A615b13d6;

    address[] targetTokenAddress = [targetTokenAddress1, targetTokenAddress2, targetTokenAddress3];

    string holdersFilePath1 = "holders_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json";
    string holdersFilePath2 = "holders_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json";
    string holdersFilePath3 = "holders_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json";

    string[] holdersFilePath = [holdersFilePath1, holdersFilePath2, holdersFilePath3];

    string outputFilePath1 = "balances_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json";
    string outputFilePath2 = "balances_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json";
    string outputFilePath3 = "balances_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json";

    string[] outputFilePath = [outputFilePath1, outputFilePath2, outputFilePath3];

    mapping(address => mapping(address => uint256)) tokenBalances;

    function run() public {
        for (uint256 k = 0; k < PROTOCOL_AMOUNT; k++) {
            Pool[] memory pools = parseHoldersJson(holdersFilePath[k]);

            ITargetToken targetToken = ITargetToken(targetTokenAddress[k]);
            PoolInfo[] memory poolInfos = new PoolInfo[](pools.length);

            for (uint256 i = 0; i < pools.length; i++) {
                address poolAddress = pools[i].poolAddress;
                address[] memory holders = pools[i].holders;

                IPool pool = IPool(poolAddress);

                uint256 targetTokenBalance = targetToken.balanceOf(poolAddress);
                uint256 totalSupply = pool.totalSupply();

                HolderInfo[] memory holderInfos = new HolderInfo[](holders.length);
                for (uint256 j = 0; j < holders.length; j++) {
                    address holder = holders[j];
                    uint256 holderLPBalance = pool.balanceOf(holder);

                    uint256 holderTokenBalance = (targetTokenBalance * holderLPBalance) / totalSupply;

                    holderInfos[j] = HolderInfo({
                        holder: holder,
                        tokenBalance: holderTokenBalance,
                        poolTokenBalance: holderLPBalance
                    });
                }

                poolInfos[i] = PoolInfo({
                    poolAddress: poolAddress,
                    targetTokenBalance: targetTokenBalance,
                    totalSupply: totalSupply,
                    holders: holderInfos
                });
            }

            string memory jsonOutput = serializeResults(poolInfos, targetTokenAddress[k]);
            vm.writeFile(outputFilePath[k], jsonOutput);
            console.log("Results written to:", outputFilePath[k]);
        }
    }

    function parseHoldersJson(string memory jsonPath) public view returns (Pool[] memory) {
        // Read the JSON file from the provided path
        string memory json = vm.readFile(jsonPath);

        // Parse JSON into bytes
        bytes memory data = vm.parseJson(json);

        // Decode the JSON bytes into an array of Pool structs
        Pool[] memory pools = abi.decode(data, (Pool[]));

        return pools;
    }

    function serializeResults(PoolInfo[] memory poolInfos, address targetToken) internal returns (string memory) {
        bytes memory json = abi.encodePacked("{ \"pools\": [");
        bool firstPool = true;

        for (uint256 i = 0; i < poolInfos.length; i++) {
            if (!firstPool) {
                json = abi.encodePacked(json, ",");
            }
            json = abi.encodePacked(
                json,
                "{",
                '"poolAddress": "',
                vm.toString(poolInfos[i].poolAddress),
                '",',
                '"targetToken": "',
                vm.toString(targetToken),
                '",',
                '"targetTokenBalance": ',
                vm.toString(poolInfos[i].targetTokenBalance),
                ",",
                '"totalSupply": ',
                vm.toString(poolInfos[i].totalSupply),
                ",",
                '"holders": ['
            );
            firstPool = false;

            bool firstHolder = true;
            for (uint256 j = 0; j < poolInfos[i].holders.length; j++) {
                if (poolInfos[i].holders[j].tokenBalance > 0) {
                    if (!firstHolder) {
                        json = abi.encodePacked(json, ",");
                    }
                    json = abi.encodePacked(
                        json,
                        "{",
                        '"holderAddress": "',
                        vm.toString(poolInfos[i].holders[j].holder),
                        '", ',
                        '"tokenBalance": ',
                        vm.toString(poolInfos[i].holders[j].tokenBalance),
                        ", ",
                        '"poolTokenBalance": ',
                        vm.toString(poolInfos[i].holders[j].poolTokenBalance),
                        "}"
                    );

                    // Update token balance
                    tokenBalances[poolInfos[i].holders[j].holder][targetToken] += poolInfos[i].holders[j].tokenBalance;

                    firstHolder = false;
                }
            }
            json = abi.encodePacked(json, "]");
            json = abi.encodePacked(json, "}");
        }
        json = abi.encodePacked(json, "]}");
        return string(json);
    }
}
