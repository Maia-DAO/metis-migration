# Token Balance Checker for Migration

This repository contains scripts designed to check token balances for migration purposes. Tokens included are $MAIA, $HERMES and $starHERMES. As well as, share of staked LPs and pending gauge rewards.

## Getting Started

To get started with the repository, follow these steps:

0. Update MIGRATION_BLOCK in `getHolder.js` and package.json scripts

1. Install the necessary dependencies:
   ```bash
   forge install && yarn
   ```

## Steps to Check Token Balances for Migration

To simplify the process, we've added scripts to `package.json`. You can now run the following commands:

### Step 0: Update MIGRATION_BLOCK in `getHolder.js` and package.json scripts!

- Update MIGRATION_BLOCK in:

  - `getHolder.js`
  - `package.json` scripts
  - `hardhat.conf` fork settings

- If you think no pairs have changed you can run and skip all other steps:

```bash
  yarn run all
```

### Step 1: Run the FilterPairs Script

```bash
yarn run filter-pairs
```

### Step 1.1: Verify and Update Pairs List

1.1. Check if the pairs list obtained from the `FilterPairs.s.sol` script is different from the lists in `getHolders.js` or `getPendingRewards.js`.

1.1.1. If there are new pairs:

- Add them their addresses to the appropriate index of the matching pools array.
- Add them their creationBlocks to the appropriate index of the matching creationBlocks array where needed

### Step 2: Run the getHolders Script

```bash
yarn run get-holders
```

- Outputs to `holders_[TOKEN_ADDRESS].json`

### Step 3: Run the BalanceInsidePairs Script

```bash
yarn run balance-inside-pairs
```

- Outputs to `balances_[TOKEN_ADDRESS].json`

### Step 4: Run the ExtractTotals Script

```bash
yarn run extract-totals
```

- Outputs to `totals.json`

### Step 5: Run the getPendingRewards Script

```bash
yarn run get-rewards
```

- Outputs to `pending_rewards_[TOKEN_ADDRESS].json`

## Repository Structure

- **script/FilterPairs.s.sol**: Script to filter token pairs.
- **scriptJs/getHolders.js**: Script to get token holders.
- **script/BalanceInsidePairs.s.sol**: Script to check balances inside token pairs for each holder.
- **scriptJs/getHolders.js**: Script to get pending rewards.

## License

This project is licensed under the MIT License.

---
