// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Fund} from "./Fund.sol";

contract Orcastrator {
    uint256 public fundCount;

    mapping(uint256 => address) public funds;

    constructor() {}

    function createFund(
        string memory _name,
        string memory _symbol,
        address _usdcAddress,
        address _uniswapFactoryAddress
    ) public returns (uint256 fundId, address fundAddress) {
        Fund fund = new Fund(
            _name,
            _symbol,
            _usdcAddress,
            _uniswapFactoryAddress,
            msg.sender
        );

        fundAddress = address(fund);
        fundId = fundCount++;

        funds[fundId] = fundAddress;
    }
}
