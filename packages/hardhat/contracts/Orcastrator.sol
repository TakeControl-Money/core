// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Fund} from "./Fund.sol";
import {IOrcastrator} from "./interfaces/IOrcastrator.sol";
import {IERC20WithDecimals} from "./interfaces/IERC20WithDecimals.sol";

contract Orcastrator is IOrcastrator {
    struct FundObj {
        uint256 id;
        address owner;
        bool isActive;
    }

    uint256 public fundCount;

    mapping(uint256 => address) public fundAddressById;
    mapping(address => FundObj) public fundByAddress;

    address public usdcAddress;
    address public uniswapFactoryAddress;

    constructor(address _usdcAddress, address _uniswapFactoryAddress) {
        usdcAddress = _usdcAddress;
        uniswapFactoryAddress = _uniswapFactoryAddress;
    }

    function createFund(
        string memory _name,
        string memory _symbol,
        string memory _detailsJson
    ) public returns (uint256 fundId, address fundAddress) {
        Fund fund = new Fund(
            _name,
            _symbol,
            usdcAddress,
            uniswapFactoryAddress,
            address(this)
        );

        fundAddress = address(fund);
        fundId = fundCount++;

        fundAddressById[fundId] = fundAddress;
        fundByAddress[fundAddress] = FundObj({
            id: fundId,
            owner: msg.sender,
            isActive: true
        });

        emit FundCreated(
            fundId,
            fundAddress,
            msg.sender,
            _name,
            _symbol,
            _detailsJson,
            block.timestamp
        );

        _addSupportedToken(fundId, fund, usdcAddress);
    }

    function deposit(uint256 fundId, uint256 amount) public {
        Fund fund = _checkAndReturnFund(fundId);

        uint256 shareAmount = fund.depositUSDC(msg.sender, amount);

        emit Deposited(
            fundId,
            address(fund),
            msg.sender,
            shareAmount,
            amount,
            block.timestamp
        );
    }

    function withdraw(uint256 fundId, uint256 shareAmount) public {
        Fund fund = _checkAndReturnFund(fundId);

        uint256 amount = fund.withdrawTokens(msg.sender, shareAmount);

        emit Withdrawn(
            fundId,
            address(fund),
            msg.sender,
            shareAmount,
            amount,
            block.timestamp
        );
    }

    function swap(
        uint256 fundId,
        address tokenOut,
        address tokenIn,
        uint256 amountOut
    ) public {
        Fund fund = _checkAndReturnFund(fundId);

        require(
            msg.sender == fundByAddress[address(fund)].owner,
            "Only owner can call this function"
        );

        uint256 amountIn = fund.swap(tokenOut, tokenIn, amountOut);

        emit Swapped(
            fundId,
            address(fund),
            tokenOut,
            tokenIn,
            amountOut,
            amountIn,
            block.timestamp
        );
    }

    function addSupportedToken(uint256 fundId, address token) public {
        Fund fund = _checkAndReturnFund(fundId);

        require(
            msg.sender == fundByAddress[address(fund)].owner,
            "Only owner can call this function"
        );

        _addSupportedToken(fundId, fund, token);
    }

    function _addSupportedToken(
        uint256 fundId,
        Fund fund,
        address token
    ) internal {
        // Get decimal places for both tokens
        uint8 decimals = IERC20WithDecimals(token).decimals();
        string memory name = IERC20WithDecimals(token).name();
        string memory symbol = IERC20WithDecimals(token).symbol();

        fund.addSupportedToken(token, decimals);

        emit AddedSupportedToken(
            fundId,
            address(fund),
            token,
            name,
            symbol,
            decimals,
            block.timestamp
        );
    }

    function _checkAndReturnFund(
        uint256 fundId
    ) internal view returns (Fund fund) {
        require(fundId < fundCount, "Orcastrator: invalid fund id");

        address fundAddress = fundAddressById[fundId];
        fund = Fund(fundAddress);
    }
}
