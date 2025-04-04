// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IERC20WithDecimals, IERC20} from "./interfaces/IERC20WithDecimals.sol";
import {IUniswapV2Pair, IUniswapV2Factory} from "./interfaces/IUniswap.sol";

import "./ShareToken.sol";

contract Fund is Ownable {
    struct Token {
        uint256 tokenId;
        address tokenAddress;
        uint256 balance;
        uint8 decimals;
    }

    uint256 public totalTokenIds;
    mapping(uint256 => Token) public tokensHeld;
    mapping(address => uint256) public tokenIdByAddress;

    // Constants
    uint256 public constant PRECISION = 1e18;

    address public USDCAddress;
    IUniswapV2Factory public uniswapFactory;
    ShareToken public shareToken;

    constructor(
        string memory _name,
        string memory _symbol,
        address _usdcAddress,
        address _uniswapFactoryAddress,
        address _owner
    ) Ownable(_owner) {
        USDCAddress = _usdcAddress;
        uniswapFactory = IUniswapV2Factory(_uniswapFactoryAddress);

        _addSupportedToken(USDCAddress);

        // deploy share token
        shareToken = new ShareToken(_name, _symbol);
    }

    // Deposit USDC into the fund
    function depositUSDC(uint256 amount) public {
        // transfer USDC from msg.sender to this contract
        IERC20(USDCAddress).transferFrom(msg.sender, address(this), amount);

        uint256 currentTotalValue = calculateTotalValue();
        uint256 currentTotalShares = shareToken.totalSupply();

        uint256 shareAmount = (amount * PRECISION * currentTotalShares) /
            currentTotalValue;

        shareToken.mint(msg.sender, shareAmount);

        // update token balance
        tokensHeld[1].balance += amount;
    }

    // Withdraw token shares from the fund
    function withdrawTokens(uint256 shareAmount) public {
        uint256 currentTotalShares = shareToken.totalSupply();

        // burn share tokens from msg.sender
        shareToken.burn(msg.sender, shareAmount);

        // loop through all tokens and calculate the amount of each token to withdraw
        for (uint256 i = 1; i <= totalTokenIds; i++) {
            Token memory token = tokensHeld[i];
            uint256 tokenValue = (token.balance * shareAmount) /
                currentTotalShares;

            // transfer token to msg.sender
            IERC20(token.tokenAddress).transfer(msg.sender, tokenValue);

            // update token balance
            tokensHeld[i].balance -= tokenValue;
        }
    }

    // calculate total value of the fund
    function calculateTotalValue() public view returns (uint256) {
        uint256 totalValue = 0;
        for (uint256 i = 1; i <= totalTokenIds; i++) {
            Token memory token = tokensHeld[i];
            totalValue += token.balance * getTokenPrice(token.tokenAddress);
        }
        return totalValue;
    }

    // calculate value of a single token in the fund
    function getTokenPrice(
        address tokenAddress
    ) public view returns (uint256 price) {
        // check if token is supported
        require(tokenIdByAddress[tokenAddress] != 0, "Token not supported");

        // get token decimals
        uint8 decimals = tokensHeld[tokenIdByAddress[tokenAddress]].decimals;
        uint8 usdcDecimals = tokensHeld[1].decimals;

        // Get the pair address from Uniswap Factory
        address pairAddress = uniswapFactory.getPair(tokenAddress, USDCAddress);
        require(pairAddress != address(0), "Pair does not exist on Uniswap V2");

        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();

        // Determine the order of tokens in the pair
        address token0 = pair.token0();

        if (token0 == tokenAddress) {
            if (decimals >= usdcDecimals) {
                uint256 decimalsDiff = 10 ** (decimals - usdcDecimals);
                price =
                    (uint256(reserve1) * PRECISION * decimalsDiff) /
                    (uint256(reserve0));
            } else {
                uint256 decimalsDiff = 10 ** (usdcDecimals - decimals);
                price =
                    (uint256(reserve1) * PRECISION) /
                    (uint256(reserve0) * decimalsDiff);
            }
        } else {
            if (decimals >= usdcDecimals) {
                uint256 decimalsDiff = 10 ** (decimals - usdcDecimals);
                price =
                    (uint256(reserve0) * PRECISION * decimalsDiff) /
                    (uint256(reserve1));
            } else {
                uint256 decimalsDiff = 10 ** (usdcDecimals - decimals);
                price =
                    (uint256(reserve0) * PRECISION) /
                    (uint256(reserve1) * decimalsDiff);
            }
        }

        return price;
    }

    function swap(
        address tokenOut,
        address tokenIn,
        uint256 amount
    ) public onlyOwner {
        // check if both tokens are supported
        require(tokenIdByAddress[tokenOut] != 0, "Out token not supported");
        require(tokenIdByAddress[tokenIn] != 0, "In token not supported");

        // check if tokenOut has enough balance
        Token memory tokenOutToken = tokensHeld[tokenIdByAddress[tokenOut]];
        Token memory tokenInToken = tokensHeld[tokenIdByAddress[tokenIn]];

        // check if tokenIn has enough balance
        require(tokenOutToken.balance >= amount, "Insufficient balance");

        // swap logic
    }

    function addSupportedToken(address tokenAddress) public onlyOwner {
        // check if token is already supported
        require(tokenIdByAddress[tokenAddress] == 0, "Token already supported");

        _addSupportedToken(tokenAddress);
    }

    function _addSupportedToken(address tokenAddress) internal {
        uint256 tokenId = ++totalTokenIds;
        tokenIdByAddress[tokenAddress] = tokenId;

        // Get decimal places for both tokens
        uint8 decimals = IERC20WithDecimals(tokenAddress).decimals();

        tokensHeld[tokenId] = Token({
            tokenId: tokenId,
            tokenAddress: tokenAddress,
            balance: 0,
            decimals: decimals
        });
    }
}
