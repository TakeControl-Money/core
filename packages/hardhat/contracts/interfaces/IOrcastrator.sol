// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IOrcastrator {
    event FundCreated(
        uint256 indexed fundId,
        address indexed fundAddress,
        address indexed owner,
        string name,
        string symbol,
        string detailsJson,
        uint256 timestamp
    );
    event Deposited(
        uint256 indexed fundId,
        address indexed fundAddress,
        address indexed user,
        uint256 shareAmount,
        uint256 amount,
        uint256 timestamp
    );
    event Withdrawn(
        uint256 indexed fundId,
        address indexed fundAddress,
        address indexed user,
        uint256 shareAmount,
        uint256 amount,
        uint256 timestamp
    );
    event Swapped(
        uint256 indexed fundId,
        address indexed fundAddress,
        address tokenOut,
        address tokenIn,
        uint256 amountOut,
        uint256 amountIn,
        uint256 timestamp
    );
    event AddedSupportedToken(
        uint256 indexed fundId,
        address indexed fundAddress,
        address indexed token,
        uint256 timestamp
    );
}
