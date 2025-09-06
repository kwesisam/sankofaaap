
# Environment Setup for EscrowContract

This document outlines the environment variables needed to run the application with the new EscrowContract on Sepolia testnet.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Ethereum Configuration
NEXT_PUBLIC_ETHEREUM_NETWORK="sepolia"
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="0x7317DA1d5c793Cb84dF9f5f3F811f2F9A810B0A2"

# Sepolia RPC URL
NEXT_PUBLIC_ETHEREUM_RPC_URL="https://ethereum-sepolia.therpc.io"

# Private Key (for testing - keep secure in production)
SEPOLIA_PRIVATE_KEY="1d45957846bffa2d56a254094bb9c5c5ccdb3ef9df97a97f20af7b28ab6327c0"
```

## Contract Details

- **Contract Address**: `0x7317DA1d5c793Cb84dF9f5f3F811f2F9A810B0A2`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **RPC URL**: `https://ethereum-sepolia.therpc.io`

## Configuration Files Updated

The following files have been updated to work with the new configuration:

1. **`lib/config.ts`** - Centralized configuration management
2. **`lib/contracts.ts`** - Updated contract addresses and ABI
3. **`lib/blockchain-provider.ts`** - Updated to use Sepolia network
4. **`app/api/escrow/create/route.ts`** - Updated environment variable usage

## Testing the Setup

1. Ensure your `.env.local` file is created with the above variables
2. Restart your development server
3. Test the escrow creation API endpoint: `POST /api/escrow/create`

## Security Notes

⚠️ **Important**: The private key in this configuration is for testing purposes only. In production:

- Never commit private keys to version control
- Use environment variables or secure key management systems
- Consider using a dedicated escrow wallet with limited funds
- Implement proper access controls and rate limiting

## Network Configuration

The application is now configured to use:
- **Sepolia Testnet** for development and testing
- **Mainnet** support is available but not configured by default
- **Custom RPC endpoints** can be configured in `lib/config.ts`

## Troubleshooting

If you encounter issues:

1. **Check Network Connection**: Ensure you can connect to `https://ethereum-sepolia.therpc.io`
2. **Verify Contract**: Confirm the contract is deployed and accessible on Sepolia
3. **Check Balance**: Ensure the wallet has sufficient Sepolia ETH for gas fees
4. **Review Logs**: Check console logs for detailed error messages

## Next Steps

After setting up the environment:

1. Test escrow creation with small amounts
2. Verify contract events are emitted correctly
3. Test delivery confirmation functionality
4. Monitor gas usage and optimize if needed
