# Disperse

A modular system for processing WAX token transfers using CSV files. This system allows you to configure token transfers and process them in batch using a CSV file for recipient information.

## Features

- Batch process token transfers from CSV files
- Configurable token parameters (symbol, decimals)
- Detailed transaction success messages with Transaction IDs
- Built-in delay between transactions to prevent rate limiting

## Prerequisites

- Bun
- Active WAX account with sufficient tokens
- Private key

## Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install eosjs papaparse
```

## Configuration

Update `config.js` with your values:

```javascript
export const config = {
  rpcApi: "https://wax.qaraqol.com",
  privateKey: "",
  senderName: "",
  contractName: "alien.worlds",
  tokenName: "TLM",
  tokenPrecision: 4, //Common precision values: 8 for WAX and 4 for TLM
  memo: "Disperse",
};
```

Note: You need to add the precision.

## CSV Format

Create a CSV file (e.g., `receivers.csv`) with the following structure:

```csv
receiverName,amount
account1,1
account2,0.5
```

## Project Structure

- `config.js`: Configuration settings
- `transaction-creator.js`: Creates transaction objects
- `transaction-sender.js`: Handles sending transactions
- `csv-processor.js`: Processes CSV and coordinates transactions
- `index.js`: Main entry point

## Usage

1. Update configuration in `config.js`
2. Prepare your CSV file with receiver information
3. Run the system:

```bash
bun run app.js
```

## Success Messages

For each successful transaction, you'll see a message like:

```
Successfully sent 1.00000000 WAX to receiverAccount from senderAccount. Trx ID: abcd1234...
```
