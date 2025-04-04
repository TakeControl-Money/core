// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface for ERC20 token standard
interface IERC20WithDecimals is IERC20 {
    function decimals() external view returns (uint8);
}
