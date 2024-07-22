// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

interface IFactory {
    function allPairs(uint256) external view returns (address);
    function allPairsLength() external view returns (uint256);
}

interface IPair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract FilterPairs is Script {
    address factoryAddress = 0x633a093C9e94f64500FC8fCBB48e90dd52F6668F;
    IFactory factory = IFactory(factoryAddress);
    mapping(address => string) resultsByToken;

    address[] tokenList = [
        0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD,
        0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8,
        0xaFF73f55968Ab4b276a26E574c96e09A615b13d6
    ];

    string outputFile = "./pairs.txt";

    function run() external {
        uint256 pairsLength = factory.allPairsLength();

        for (uint256 j = 0; j < tokenList.length; j++) {
            resultsByToken[tokenList[j]] = "";
        }

        for (uint256 i = 0; i < pairsLength; i++) {
            address pairAddress = factory.allPairs(i);
            IPair pair = IPair(pairAddress);

            address token0 = pair.token0();
            address token1 = pair.token1();

            for (uint256 j = 0; j < tokenList.length; j++) {
                if (token0 == tokenList[j] || token1 == tokenList[j]) {
                    (uint112 reserve0, uint112 reserve1,) = pair.getReserves();

                    if ((token0 == tokenList[j] && reserve0 > 0) || (token1 == tokenList[j] && reserve1 > 0)) {
                        console.log("Pair with address", pairAddress, "has non-zero balance of token", tokenList[j]);
                        resultsByToken[tokenList[j]] =
                            string(abi.encodePacked(resultsByToken[tokenList[j]], vm.toString(pairAddress), "\n"));
                    }
                }
            }
        }

        string memory finalResult = "";
        for (uint256 j = 0; j < tokenList.length; j++) {
            string memory tokenHeader = string(abi.encodePacked("Results for token: ", vm.toString(tokenList[j]), "\n"));
            finalResult = string(abi.encodePacked(finalResult, tokenHeader, resultsByToken[tokenList[j]], "\n"));
        }

        vm.writeFile(outputFile, finalResult);
    }
}
