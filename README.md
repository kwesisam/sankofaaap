
# Sankofa Marketplace

**Authentic African Artistry, Globally Connected**

Sankofa is a revolutionary Web3-enabled marketplace that connects talented Ghanaian and African artisans directly to global markets, featuring blockchain-verified authenticity for every handcrafted piece.

## Project Vision

Sankofa empowers African artisans by eliminating intermediaries and providing a trusted platform where traditional craftsmanship meets modern blockchain technology. Every product comes with immutable authenticity certificates, ensuring buyers receive genuine African art while artisans receive fair compensation.

## Key Features

- **Authentic Marketplace** - Browse verified African crafts with blockchain certificates
- **Secure Escrow System** - Smart contract-based payments protect both buyers and sellers
- **NFT Authenticity Certificates** - Each craft receives a unique digital certificate
- **Global Accessibility** - Mobile-responsive design for worldwide reach
- **Web3 Integration** - Multi-wallet support (MetaMask, WalletConnect)
- **Real-time Tracking** - Live order and delivery status updates

## Architecture

### Smart Contracts (Ethereum/Sepolia)
- **AuthenticityCertificate Contract** - ERC721 NFT for digital authenticity certificates
  - **Address**: `0x9891A3Fa6039D42Bdb973acaF1Ad8DC57bFC2a45`
- **EscrowContract** - Secure payment system with automatic release
  - **Address**: `0x50bA12644d8E69c28a8694Bf46EeE5F1a47D3eF1`

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Blockchain**: Ethers.js, Wagmi, Viem, Solidity ^0.8.24
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Authentication**: NextAuth + SIWE (Sign-In With Ethereum)
- **Storage**: Supabase integration
- **Infrastructure**: Docker, Vercel deployment ready

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kwesisam/sankofaaap.git
   cd sankofaaap
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the project root:
   ```bash
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Ethereum Configuration
   NEXT_PUBLIC_ETHEREUM_NETWORK="sepolia"
   NEXT_PUBLIC_ESCROW_ADDRESS="0x50bA12644d8E69c28a8694Bf46EeE5F1a47D3eF1"
   NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS="0x9891A3Fa6039D42Bdb973acaF1Ad8DC57bFC2a45"
   NEXT_PUBLIC_ETHEREUM_RPC_URL="https://ethereum-sepolia.therpc.io"
   
   # Private Key (for testing - keep secure in production)
   SEPOLIA_PRIVATE_KEY="your-sepolia-private-key"
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the marketplace.

## API Documentation

The project includes comprehensive API documentation for the escrow system. See `README-ESCROW-API.md` for detailed endpoint information.

### Key Endpoints
- `GET /api/escrow?escrowId=<id>` - Get escrow details
- `POST /api/escrow/create` - Create new escrow
- `POST /api/escrow/confirm` - Confirm delivery
- `GET /api/escrow/status?escrowId=<id>` - Get escrow status

## Related Repositories

- **Smart Contracts**: [github.com/kwesisam/sankofa_contract](https://github.com/kwesisam/sankofa_contract)
- **Web Application**: [github.com/kwesisam/sankofaaap](https://github.com/kwesisam/sankofaaap)

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset and reseed database
```

## Network Configuration

- **Development**: Sepolia Testnet (Chain ID: 11155111)
- **Production**: Ethereum Mainnet ready
- **RPC Providers**: Multiple fallback endpoints for reliability

## Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive configuration
- The included private key is for testing purposes only
- Implement proper access controls for production deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About Sankofa

The name "Sankofa" comes from the Akan people of Ghana and symbolizes the importance of learning from the past to move forward. Our marketplace embodies this philosophy by preserving traditional African craftsmanship while embracing modern technology to create new opportunities for artisans worldwide.

---

**Built with for African artisans and craft enthusiasts worldwide**
