// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Fund} from "./Fund.sol";

contract Orcastrator {
    uint256 public fundCount;

    mapping(uint256 => address) public funds;

    address public usdcAddress;
    address public uniswapFactoryAddress;

    constructor(address _usdcAddress, address _uniswapFactoryAddress) {
        usdcAddress = _usdcAddress;
        uniswapFactoryAddress = _uniswapFactoryAddress;
    }

    function createFund(
        string memory _name,
        string memory _symbol
    ) public returns (uint256 fundId, address fundAddress) {
        Fund fund = new Fund(
            _name,
            _symbol,
            usdcAddress,
            uniswapFactoryAddress,
            msg.sender
        );

        fundAddress = address(fund);
        fundId = fundCount++;

        funds[fundId] = fundAddress;
    }
}
