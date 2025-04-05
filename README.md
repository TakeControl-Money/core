# TakeControl.Money

A decentralized application for creating and managing investment pools on the Base blockchain. Users can create pools, invest USDC, earn pool share tokens, and let expert money managers and ai agents grow their assets.

## Project Overview

This platform enables users to:
- Create decentralized money management pools which can be managed either by them, smart contracts or by ai agents
- Join existing pools by investing USDC
- Manage pool assets through swapping, lending, and staking
- Track performance and transactions of pools
- Earn commissions as pool managers

The application leverages Base blockchain technology to provide transparency, security, and decentralized control over fund management.

## Tech Stack

- **Frontend Framework**: Next.js with Shadcn UI
- **Web3 Integration**: 
  - wagmi (Ethereum React hooks library)
  - viem (TypeScript interface for Ethereum)
  - Coinbase Wallet SDK
- **Form Handling**: react-hook-form with zod validation
- **Data Visualization**: recharts for charts and data visualization
- **Blockchain**: Base (Coinbase's Ethereum L2 solution)

## Key Components

### Core Components

- **ConnectWallet**: Handles wallet connection with Coinbase Smart Wallet integration with Coinbase Paymaster 
- **CreatePoolForm**: Form for creating new investment pools with options for different manager types (human, smart contract, AI)
- **PoolList**: Displays available pools with filtering options
- **PoolActions**: Interface for executing transactions like swapping, lending, and staking within a pool
- **PoolAssets**: Displays assets within a pool
- **PoolTransactions**: Transaction history for a specific pool
- **UserInvestments**: Shows user's investments across pools
- **UserPools**: Displays pools created/managed by the user

### Pages

- **Home Page**: Landing page with featured pools and how it works section
- **Pools Page**: Browse all available pools
- **Pool Detail Page**: Detailed view of a specific pool
- **Create Pool Page**: Interface for creating a new pool
- **Dashboard**: User dashboard showing investments and managed pools

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone git@github.com:TakeControl-Money/core.git takecontrol.money
   cd takecontrol.money
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

## Usage Instructions

### Creating a Pool

1. Connect your coinbase smart wallet using the "Connect Smart Wallet" button
2. Navigate to the "Create Pool" page
3. Fill out the pool details:
   - Pool Name
   - Description
   - Manager Type (Human, Smart Contract, or AI Agent)
   - Commission Percentage (your fee as the manager)
4. Submit the form to create your pool on Base

### Investing in a Pool

1. Browse available pools on the "Pools" page
2. Click on a pool to view details
3. Use the investment form to contribute USDC to the pool
4. Receive pool share tokens representing your ownership

### Managing Pool Assets

As a pool manager:
1. Navigate to your pool's detail page
2. Use the "Pool Actions" card to:
   - Swap between different tokens
   - Lend tokens on protocols like Aave or Compound
   - Stake tokens on protocols like Lido or Rocket Pool

## Features

- **Base Chain Integration**: Built on Coinbase's Base L2 for low fees and fast transactions
- **Smart Wallet Integration**: Connect with Coinbase Smart Wallet for secure transactions
- **Completely Gasless Experience**: With Coinbase Paymaster, we are able to provide completely gasless experience
- **Pool Creation**: Create customizable investment pools with different manager types
- **Asset Management**: Swap, lend, and stake assets within pools
- **Performance Tracking**: Monitor pool performance with detailed analytics
- **Transaction History**: View all transactions within a pool
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Important Notes

- This application is designed to work with USDC and other ERC-20 tokens on Base
- Pool managers earn commissions based on the percentage they set when creating the pool (maximum 5%)
- The platform supports three types of managers:
  - Human managers (direct control)
  - Smart Contract managers (programmatic rules)
  - AI Agents (algorithm-driven strategies)
- All transactions are executed on-chain for transparency and security
