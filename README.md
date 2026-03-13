# Chainwork - Solana Job Marketplace

A decentralized job marketplace platform built on Solana blockchain, enabling secure and transparent freelance job postings, bidding, and payments.

## 🚀 Features

- **Blockchain-Powered**: Built on Solana for fast, low-cost transactions
- **Smart Contract Integration**: Secure job contracts and payments
- **Transaction Verification**: Backend API to verify Solana Devnet transactions
- **User Authentication**: Wallet-based authentication system
- **Job Management**: Create, browse, and manage job listings
- **Real-time Updates**: Live contract and payment status tracking

## 🛠 Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS
- Solana wallet adapters
- Vite build tool

### Backend
- Node.js with Express.js
- MongoDB database
- @solana/web3.js for blockchain interactions
- JWT authentication

### Blockchain
- Solana Devnet
- Rust smart contracts with Anchor framework

## 📦 Installation

### Prerequisites
- Node.js v14 or higher
- MongoDB
- Solana CLI (optional)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mdimran29/Chainwork.git
   cd Chainwork
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Install frontend dependencies:
   ```bash
   cd ../app
   npm install
   ```

4. Start the backend:
   ```bash
   cd server
   npm run start:api
   ```

5. Start the frontend:
   ```bash
   cd app
   npm run dev
   ```

## 🔧 Configuration

Create `.env` files in both `server/` and `app/` directories based on the `.env.example` templates.

### Server Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `SOLANA_NETWORK` - Solana network (devnet/mainnet)

### App Environment Variables
- `VITE_SOLANA_NETWORK` - Solana network
- `VITE_RPC_ENDPOINT` - Solana RPC endpoint
- `VITE_ESCROW_PROGRAM_ID` - Smart contract program ID

## 📡 API Endpoints

### Transaction Verification
`POST /api/verify-tx`

Verifies a Solana Devnet transaction.

**Request:**
```json
{
  "signature": "transaction_signature",
  "wallet": "wallet_address"
}
```

**Response:**
```json
{
  "success": true,
  "transactionFound": true,
  "status": "success",
  "walletMatched": true
}
```

## 📝 License

MIT License

## 👤 Author

**mdimran29**
- GitHub: [@mdimran29](https://github.com/mdimran29)
- Email: imranansari2932003@gmail.com

---

Built with ❤️ using Solana blockchain
