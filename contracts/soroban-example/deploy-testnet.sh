#!/usr/bin/env bash
set -euo pipefail

echo "Soroban CrashLab Smart Contract Deployment Script"
echo "=================================================="
echo ""
echo "This script deploys the soroban-example contract to Stellar testnet."
echo ""

# Check prerequisites
if ! command -v soroban &> /dev/null; then
    echo "Installing soroban CLI..."
    cargo install --locked soroban-cli
fi

echo ""
echo "Step 1: Configuring Stellar testnet"
echo "------------------------------------"
soroban network add --global testnet \
    --rpc-url https://soroban-testnet.stellar.org \
    --network-passphrase "Test SDF Network ; September 2015"

echo ""
echo "Step 2: Generating testnet identity"
echo "------------------------------------"
soroban keys generate --global alice --network testnet 2>/dev/null || echo "Identity 'alice' already exists"

echo ""
echo "Step 3: Building WASM"
echo "----------------------"
cargo build --release --target wasm32-unknown-unknown

echo ""
echo "Step 4: Deploying contract"
echo "--------------------------"
WASM_PATH="target/wasm32-unknown-unknown/release/soroban_example.wasm"
CONTRACT_ID=$(soroban contract deploy \
    --wasm "$WASM_PATH" \
    --source alice \
    --network testnet)

echo "Contract deployed successfully!"
echo "Contract ID: $CONTRACT_ID"

echo ""
echo "Step 5: Saving to .env"
echo "-----------------------"
echo "" >> ../../apps/web/.env.local
echo "# Smart Contract Deployment" >> ../../apps/web/.env.local
echo "NEXT_PUBLIC_STELLAR_NETWORK=testnet" >> ../../apps/web/.env.local
echo "NEXT_PUBLIC_CONTRACT_ID=$CONTRACT_ID" >> ../../apps/web/.env.local

echo ""
echo "Deployment complete!"
echo "Contract ID saved to .env"
echo ""
echo "Contract ID: $CONTRACT_ID"
