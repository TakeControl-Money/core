// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20WithDecimals, IERC20} from "./interfaces/IERC20WithDecimals.sol";
import {IUniswapV2Pair, IUniswapV2Factory} from "./interfaces/IUniswap.sol";
import {IOrcastrator} from "./interfaces/IOrcastrator.sol";

import "./ShareToken.sol";

contract Fund {
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
    IOrcastrator public orcastrator;

    modifier onlyOrcastrator() {
        require(
            msg.sender == address(orcastrator),
            "Only orcastrator can call this function"
        );
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _usdcAddress,
        address _uniswapFactoryAddress,
        address _orcastratorAddress
    ) {
        USDCAddress = _usdcAddress;
        uniswapFactory = IUniswapV2Factory(_uniswapFactoryAddress);

        // deploy share token
        shareToken = new ShareToken(_name, _symbol);
        orcastrator = IOrcastrator(_orcastratorAddress);
    }

    // Deposit USDC into the fund
    function depositUSDC(
        address user,
        uint256 amount
    ) public onlyOrcastrator returns (uint256 shareAmount) {
        // transfer USDC from msg.sender to this contract
        IERC20(USDCAddress).transferFrom(user, address(this), amount);

        uint256 currentTotalShares = shareToken.totalSupply();

        if (currentTotalShares == 0) {
            shareAmount = amount * PRECISION;
        } else {
            uint256 currentTotalValue = calculateTotalValue();

            shareAmount =
                (amount * PRECISION * currentTotalShares) /
                (currentTotalValue * (10 ** tokensHeld[1].decimals));
        }

        shareToken.mint(user, shareAmount);

        // update token balance
        tokensHeld[1].balance += amount;
    }

    // Withdraw token shares from the fund
    function withdrawTokens(
        address user,
        uint256 shareAmount
    ) public onlyOrcastrator returns (uint256 withdrawalAmount) {
        uint256 currentTotalShares = shareToken.totalSupply();

        // burn share tokens from user
        shareToken.burn(user, shareAmount);

        // calculate total value of the fund
        uint256 currentTotalValue = calculateTotalValue();
        withdrawalAmount =
            (currentTotalValue * shareAmount) /
            currentTotalShares;

        // loop through all tokens and calculate the amount of each token to withdraw
        for (uint256 i = 1; i <= totalTokenIds; i++) {
            Token memory token = tokensHeld[i];
            uint256 tokenValue = (token.balance * shareAmount) /
                currentTotalShares;

            // transfer token to user
            IERC20(token.tokenAddress).transfer(user, tokenValue);

            // update token balance
            tokensHeld[i].balance -= tokenValue;
        }
    }

    // calculate total value of the fund
    function calculateTotalValue() public view returns (uint256) {
        uint256 totalValue = 0;
        Token memory usdcToken = tokensHeld[1];
        totalValue +=
            (usdcToken.balance * PRECISION) /
            (10 ** usdcToken.decimals);
        for (uint256 i = 2; i <= totalTokenIds; i++) {
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
    ) public onlyOrcastrator returns (uint256 amountIn) {
        // check if both tokens are supported
        require(tokenIdByAddress[tokenOut] != 0, "Out token not supported");
        require(tokenIdByAddress[tokenIn] != 0, "In token not supported");

        // check if tokenOut has enough balance
        Token memory tokenOutToken = tokensHeld[tokenIdByAddress[tokenOut]];
        Token memory tokenInToken = tokensHeld[tokenIdByAddress[tokenIn]];

        // check if tokenIn has enough balance
        require(tokenOutToken.balance >= amount, "Insufficient balance");

        // swap logic

        amountIn = 0;
    }

    function addSupportedToken(
        address tokenAddress,
        uint8 decimals
    ) public onlyOrcastrator {
        // check if token is already supported
        require(tokenIdByAddress[tokenAddress] == 0, "Token already supported");

        uint256 tokenId = ++totalTokenIds;
        tokenIdByAddress[tokenAddress] = tokenId;

        tokensHeld[tokenId] = Token({
            tokenId: tokenId,
            tokenAddress: tokenAddress,
            balance: 0,
            decimals: decimals
        });
    }
}
